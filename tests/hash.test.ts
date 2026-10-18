import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { argon2id } from "hash-wasm";
import {
  ARGON2_PARAMS,
  SALT_BYTES,
  argon2idEncoded,
  randomSalt,
  saltedSha1Hex,
  sha1HexOfText,
  toHex,
} from "@/lib/hash";

describe("sha1HexOfText", () => {
  it("matches the FIPS 180-1 vector for 'abc'", async () => {
    await expect(sha1HexOfText("abc")).resolves.toBe(
      "a9993e364706816aba3e25717850c26c9cd0d89d",
    );
  });

  it("agrees with node:crypto for UTF-8, empty, and long inputs", async () => {
    const samples = ["hello123", "pässwörd 🔐", "", "x".repeat(5000)];
    for (const sample of samples) {
      const expected = createHash("sha1").update(sample, "utf8").digest("hex");
      await expect(sha1HexOfText(sample)).resolves.toBe(expected);
    }
  });
});

describe("unsalted SHA-1 (mode A)", () => {
  it("gives both users the same digest for the same password", async () => {
    const [userA, userB] = await Promise.all([
      sha1HexOfText("hello123"),
      sha1HexOfText("hello123"),
    ]);
    expect(userA).toBe(userB);
    expect(userA).toBe("4233137d1c510f2e55ba5cb220b864b11033f156");
  });
});

describe("salted SHA-1 (mode B)", () => {
  it("produces different digests for the same password with different salts", async () => {
    const saltA = new Uint8Array(16).fill(0x11);
    const saltB = new Uint8Array(16).fill(0x22);
    const [userA, userB] = await Promise.all([
      saltedSha1Hex("hello123", saltA),
      saltedSha1Hex("hello123", saltB),
    ]);
    expect(userA).not.toBe(userB);
  });

  it("is deterministic for identical password and salt", async () => {
    const salt = new Uint8Array(16).fill(0xab);
    const first = await saltedSha1Hex("hello123", salt);
    const second = await saltedSha1Hex("hello123", salt);
    expect(first).toBe(second);
  });

  it("keeps the password/salt split unambiguous", async () => {
    // Naive concatenation would map ("ab", "cd") and ("abc", "d") to the same bytes.
    const joined = await saltedSha1Hex("ab", new Uint8Array([0xcd]));
    const shifted = await saltedSha1Hex("abc", new Uint8Array([0x0d]));
    expect(joined).not.toBe(shifted);
  });
});

describe("randomSalt", () => {
  it("returns SALT_BYTES of Web Crypto randomness as lowercase hex", () => {
    const salt = randomSalt();
    expect(salt).toHaveLength(SALT_BYTES);
    expect(toHex(salt)).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("Argon2id (mode C)", () => {
  const salt = Uint8Array.from({ length: 16 }, (_, index) => index); // 00..0f
  // Independently computed with argon2-cffi (argon2.low_level.hash_secret_raw,
  // time_cost=1, memory_cost=47104, parallelism=1, hash_len=32, type=Type.ID),
  // a different implementation from hash-wasm.
  const referenceHex = "fda5dc37375740ab8a0fd53b101b5f50e7cf6b31056d00107f7d076174f64d93";
  const referenceEncoded =
    // Same salt and tag as the argon2-cffi vector above, in the reference
    // implementation's unpadded base64 (hash-wasm follows that convention;
    // argon2-cffi pads, so only the padding differs, not the bytes).
    "$argon2id$v=19$m=47104,t=1,p=1$AAECAwQFBgcICQoLDA0ODw$/aXcNzdXQKuKD9U7EBtfUOfPazEFbQAQf30HYXT2TZM";

  it("matches the independently computed argon2-cffi vector", async () => {
    const hex = await argon2id({
      password: "password",
      salt,
      ...ARGON2_PARAMS,
      outputType: "hex",
    });
    expect(hex).toBe(referenceHex);
  });

  it("produces the standard PHC encoded form with parameters, salt, and hash", async () => {
    await expect(argon2idEncoded("password", salt)).resolves.toBe(referenceEncoded);
  });

  it("is reproducible for identical inputs and parameters", async () => {
    const first = await argon2idEncoded("hello123", salt);
    const second = await argon2idEncoded("hello123", salt);
    expect(first).toBe(second);
  });

  it("produces different hashes for different salts", async () => {
    const other = new Uint8Array(16).fill(7);
    const first = await argon2idEncoded("hello123", salt);
    const second = await argon2idEncoded("hello123", other);
    expect(first).not.toBe(second);
  });

  it("keeps the OWASP-minimum parameters pinned", () => {
    expect(ARGON2_PARAMS).toEqual({
      parallelism: 1,
      iterations: 1,
      memorySize: 47104,
      hashLength: 32,
    });
  });
});

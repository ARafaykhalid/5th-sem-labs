/**
 * Hashing core for the Password Lab demo. Pure functions only, no React.
 *
 * Everything runs through browser platform APIs:
 * - SHA-1 and secure randomness: Web Crypto (`crypto.subtle`, `crypto.getRandomValues`)
 * - Argon2id: hash-wasm 4.12 (loaded lazily so the WASM module stays out of the
 *   initial bundle until the first hash is requested)
 *
 * Input encodings (kept explicit so the demo cannot be accused of hand-waving):
 * - Unsalted SHA-1: SHA1(utf8(password))
 * - Salted SHA-1:   SHA1(utf8(password) + ":" + lowercase-hex(salt))
 *   The salt is always the final, fixed-length hex run and never contains ":", so the
 *   password/salt split stays unambiguous for any password.
 * - Argon2id: password and salt passed as separate arguments to hash-wasm's
 *   `argon2id`, which produces the standard PHC encoded string.
 */

export type Mode = "sha1" | "sha1-salted" | "argon2id";

/** A byte array backed by a regular ArrayBuffer, which is what Web Crypto accepts. */
export type Bytes = Uint8Array<ArrayBuffer>;

const encoder = new TextEncoder();

/** 16 random bytes per user, in line with OWASP password-storage guidance. */
export const SALT_BYTES = 16;

/**
 * Demonstration parameters (OWASP minimum for Argon2id: m=47104 KiB, t=1, p=1).
 * Small enough to finish quickly in a browser tab, large enough to make the cost
 * difference obvious next to SHA-1.
 */
export const ARGON2_PARAMS = {
  parallelism: 1,
  iterations: 1,
  memorySize: 47104,
  hashLength: 32,
} as const;

export function randomSalt(): Bytes {
  return crypto.getRandomValues(new Uint8Array(SALT_BYTES));
}

export function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

async function sha1Hex(message: Bytes): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", message);
  return toHex(new Uint8Array(digest));
}

export async function sha1HexOfText(text: string): Promise<string> {
  return sha1Hex(encoder.encode(text));
}

export async function saltedSha1Hex(password: string, salt: Bytes): Promise<string> {
  return sha1Hex(encoder.encode(`${password}:${toHex(salt)}`));
}

export async function argon2idEncoded(password: string, salt: Bytes): Promise<string> {
  const { argon2id } = await import("hash-wasm");
  return argon2id({
    password,
    salt,
    ...ARGON2_PARAMS,
    outputType: "encoded",
  });
}

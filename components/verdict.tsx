import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { Mode } from "@/lib/hash";

export type LabStatus = "idle" | "hashing" | "done" | "error";

const GOOD_NOTES: Record<Mode, string> = {
  sha1: "SHA-1 alone is still unsuitable for password storage.",
  "sha1-salted":
    "The unique salt per user stops matching rows and stops reuses of precomputed tables. Salts are stored with the hash and are not secret, and SHA-1 stays far too fast, so guessing is still cheap.",
  argon2id:
    "Argon2id builds the salt and the cost parameters into the stored value, so every offline guess costs memory and time. It raises the price of guessing; it does not make guessing impossible.",
};

const SAME_NOTE =
  "Identical passwords produce identical stored values, so one cracked hash exposes every matching account and precomputed tables stay reusable.";

export default function Verdict({
  mode,
  status,
  identical,
}: {
  mode: Mode;
  status: LabStatus;
  identical: boolean;
}) {
  if (status === "idle") {
    return (
      <p className="rounded-site border border-foreground/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/55">
        Type a sample password to run the comparison
      </p>
    );
  }

  if (status === "hashing") {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-site border border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70">
          Computing both hashes in your browser…
        </span>
        <span className="block h-0.5 w-full overflow-hidden bg-foreground/10" aria-hidden>
          <span className="progress-bar block h-full w-1/3 bg-primary" />
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="rounded-site border border-destructive px-4 py-3 text-sm">
        Hashing failed in this browser. Change the sample password or switch mode to try again.
      </div>
    );
  }

  const good = !identical;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-site border px-4 py-3 ${
        good ? "border-accent" : "border-destructive"
      }`}
    >
      {good ? (
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      ) : (
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
      )}
      <div className="flex flex-col gap-1">
        <p
          className={`text-xl leading-snug font-bold ${
            good ? "text-foreground" : "text-destructive"
          }`}
        >
          {good ? "A different hash for each user" : "Both users store the same hash"}
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/75">
          {good ? GOOD_NOTES[mode] : SAME_NOTE}
        </p>
        <p
          data-secondary
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55"
        >
          A hash is one-way. This is not encryption, and a salt is not secret.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Check, Copy } from "lucide-react";
import type { Mode } from "@/lib/hash";

const MODE_LABEL: Record<Mode, string> = {
  sha1: "SHA-1",
  "sha1-salted": "SHA-1 + salt",
  argon2id: "Argon2id + salt",
};

const MODE_INPUT: Record<Mode, string> = {
  sha1: "input = password",
  "sha1-salted": "input = password : salt",
  argon2id: "m = 47104 KiB · t = 1 · p = 1 · 32-byte tag",
};

function truncateMiddle(value: string): string {
  return value.length > 56 ? `${value.slice(0, 34)}…${value.slice(-12)}` : value;
}

export default function UserColumn({
  label,
  password,
  mode,
  digest,
  saltHex,
  computing,
}: {
  label: string;
  password: string;
  mode: Mode;
  digest: string | null;
  saltHex: string | null;
  computing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyDigest = async () => {
    if (!digest) return;
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
    } catch {
      // clipboard access refused; the digest stays visible for manual selection
    }
  };

  return (
    <article className="flex flex-col gap-3 border border-foreground/15 p-4 sm:p-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]">{label}</h2>
        {saltHex ? (
          <span
            title={`salt ${saltHex}`}
            className="border border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
          >
            salt {saltHex.slice(0, 10)}…{saltHex.slice(-4)}
          </span>
        ) : mode === "sha1" ? (
          <span className="border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/50">
            no salt
          </span>
        ) : (
          <span className="border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/50">
            salt ····
          </span>
        )}
      </header>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">Password</p>
        <p className="rounded-site border border-dashed border-foreground/40 px-3 py-2 font-mono text-sm break-all">
          {password || "…"}
        </p>
      </div>

      <div className="flow-arrow flex justify-center" aria-hidden>
        <ArrowDown className="h-3.5 w-3.5 text-foreground/40" />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">
          {MODE_LABEL[mode]}
        </p>
        <p className="rounded-site border border-border px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/75">
          {MODE_INPUT[mode]}
        </p>
      </div>

      <div className="flow-arrow flex justify-center" aria-hidden>
        <ArrowDown className="h-3.5 w-3.5 text-foreground/40" />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">
          Stored hash
        </p>
        <div className="rounded-site border border-foreground px-3 py-2">
          {computing ? (
            <div className="flex flex-col gap-2" aria-hidden>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                Hashing…
              </span>
              <span className="block h-0.5 w-full overflow-hidden bg-foreground/10">
                <span className="progress-bar block h-full w-1/3 bg-primary" />
              </span>
            </div>
          ) : digest ? (
            <>
              <p
                key={digest}
                className="digest-in digest-text font-mono text-[13px] leading-relaxed break-all"
              >
                {expanded ? digest : truncateMiddle(digest)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="cursor-pointer border border-foreground/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 ease-site hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {expanded ? "Collapse" : "Show full"}
                </button>
                <button
                  type="button"
                  onClick={copyDigest}
                  aria-label={`Copy hash for ${label}`}
                  className="flex cursor-pointer items-center gap-1.5 border border-foreground/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 ease-site hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-primary" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </>
          ) : (
            <p className="font-mono text-[13px] text-foreground/40">–</p>
          )}
        </div>
      </div>

      <details data-secondary className="border-t border-foreground/10 pt-2">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/60">
          Technical details
        </summary>
        <dl className="mt-2 flex flex-col gap-2 font-mono text-[11px] leading-relaxed text-foreground/70">
          <div>
            <dt className="text-foreground/50">Encoding</dt>
            <dd className="break-all">
              {mode === "sha1"
                ? "SHA1(utf8(password))"
                : mode === "sha1-salted"
                  ? 'SHA1(utf8(password) + ":" + hex(salt))'
                  : "argon2id(password, salt, m=47104 KiB, t=1, p=1, len=32)"}
            </dd>
          </div>
          <div>
            <dt className="text-foreground/50">Salt</dt>
            <dd className="break-all">
              {saltHex ??
                "None. Every user with this password stores the same value."}
            </dd>
          </div>
          {digest ? (
            <div>
              <dt className="text-foreground/50">Full hash</dt>
              <dd className="break-all">{digest}</dd>
            </div>
          ) : null}
        </dl>
      </details>
    </article>
  );
}

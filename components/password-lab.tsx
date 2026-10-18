"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, ShieldAlert } from "lucide-react";
import {
  argon2idEncoded,
  randomSalt,
  saltedSha1Hex,
  sha1HexOfText,
  toHex,
  type Bytes,
  type Mode,
} from "@/lib/hash";
import ModeSwitcher, { MODES } from "@/components/mode-switcher";
import UserColumn from "@/components/user-column";
import Verdict, { type LabStatus } from "@/components/verdict";

const SAMPLE_PASSWORD = "hello123";

async function derive(mode: Mode, password: string, salt: Bytes): Promise<string> {
  if (mode === "sha1") return sha1HexOfText(password);
  if (mode === "sha1-salted") return saltedSha1Hex(password, salt);
  return argon2idEncoded(password, salt);
}

interface LabRun {
  digestA: string;
  digestB: string;
  saltHexA: string | null;
  saltHexB: string | null;
}

export default function PasswordLab() {
  const [password, setPassword] = useState(SAMPLE_PASSWORD);
  const [mode, setMode] = useState<Mode>("sha1");
  const [status, setStatus] = useState<LabStatus>("hashing");
  const [run, setRun] = useState<LabRun | null>(null);
  const [saltVersion, setSaltVersion] = useState(0);
  const [presentation, setPresentation] = useState(false);
  const saltsRef = useRef<{ a: Bytes; b: Bytes } | null>(null);
  const runToken = useRef(0);
  const firstRun = useRef(true);

  useEffect(() => {
    const token = ++runToken.current;
    const delay = firstRun.current ? 0 : 240;
    firstRun.current = false;

    const timer = window.setTimeout(() => {
      if (!password) {
        setRun(null);
        setStatus("idle");
        return;
      }

      setStatus("hashing");
      const salts = saltsRef.current ?? (saltsRef.current = { a: randomSalt(), b: randomSalt() });

      Promise.all([derive(mode, password, salts.a), derive(mode, password, salts.b)])
        .then(([digestA, digestB]) => {
          if (token !== runToken.current) return; // stale run; a newer one owns the UI
          setRun({
            digestA,
            digestB,
            saltHexA: mode === "sha1" ? null : toHex(salts.a),
            saltHexB: mode === "sha1" ? null : toHex(salts.b),
          });
          setStatus("done");
        })
        .catch(() => {
          if (token !== runToken.current) return;
          setRun(null);
          setStatus("error");
        });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [password, mode, saltVersion]);

  useEffect(() => {
    const onPresentation = (event: Event) => {
      if (event instanceof CustomEvent) setPresentation(Boolean(event.detail));
    };
    const onCycle = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const step = Number(event.detail);
      if (!step) return;
      setMode((current) => {
        const index = MODES.findIndex((entry) => entry.id === current);
        return MODES[(index + step + MODES.length) % MODES.length].id;
      });
    };
    window.addEventListener("lab:presentation", onPresentation);
    window.addEventListener("lab:cycle", onCycle);
    return () => {
      window.removeEventListener("lab:presentation", onPresentation);
      window.removeEventListener("lab:cycle", onCycle);
    };
  }, []);

  const reset = () => {
    saltsRef.current = { a: randomSalt(), b: randomSalt() };
    setPassword(SAMPLE_PASSWORD);
    setRun(null);
    setStatus("hashing");
    setSaltVersion((value) => value + 1);
  };

  const salted = mode !== "sha1";
  const identical = run !== null && run.digestA === run.digestB;

  return (
    <section aria-busy={status === "hashing"} className="lab-panel flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:max-w-md">
          <label
            htmlFor="sample-password"
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Sample password
          </label>
          <input
            id="sample-password"
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={SAMPLE_PASSWORD}
            className="h-12 w-full rounded-site border border-border bg-background px-3 font-mono text-base outline-none transition-[border-color,box-shadow] duration-300 ease-site placeholder:text-foreground/35 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 border border-foreground/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/70">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Example only. Never type a real password.
          </span>
          <button
            type="button"
            onClick={reset}
            className="flex h-9 shrink-0 cursor-pointer items-center gap-2 border border-foreground px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ease-site hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset demo
          </button>
        </div>
      </div>

      <ModeSwitcher mode={mode} onChange={setMode} />

      <div className="grid gap-4 lg:grid-cols-2">
        <UserColumn
          label="User A"
          password={password}
          mode={mode}
          digest={run?.digestA ?? null}
          saltHex={salted ? (run?.saltHexA ?? null) : null}
          computing={status === "hashing"}
        />
        <UserColumn
          label="User B"
          password={password}
          mode={mode}
          digest={run?.digestB ?? null}
          saltHex={salted ? (run?.saltHexB ?? null) : null}
          computing={status === "hashing"}
        />
      </div>

      <Verdict mode={mode} status={status} identical={identical} />

      {presentation ? (
        <p
          aria-hidden
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/55"
        >
          ← → change mode · Esc exits presentation
        </p>
      ) : null}
    </section>
  );
}

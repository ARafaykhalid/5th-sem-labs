import type { Mode } from "@/lib/hash";

export const MODES: Array<{ id: Mode; label: string; sub: string; description: string }> = [
  {
    id: "sha1",
    label: "Unsalted SHA-1",
    sub: "No salt",
    description:
      "Everyone with the same password stores the same digest, so one cracked hash exposes every matching account.",
  },
  {
    id: "sha1-salted",
    label: "SHA-1 + salts",
    sub: "Unique salt per user",
    description:
      "A unique salt makes the two digests different, but SHA-1 is still far too fast to protect a password.",
  },
  {
    id: "argon2id",
    label: "Argon2id + salts",
    sub: "Memory-hard",
    description:
      "Unique salts plus a deliberately expensive algorithm: every guess costs memory and time instead of microseconds.",
  },
];

export default function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  const active = MODES.find((entry) => entry.id === mode) ?? MODES[0];

  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-wrap">
        <legend className="sr-only">Password hashing mode</legend>
        {MODES.map((entry, index) => (
          <label key={entry.id} className={index > 0 ? "-ml-px" : undefined}>
            <input
              type="radio"
              name="mode"
              value={entry.id}
              checked={mode === entry.id}
              onChange={() => onChange(entry.id)}
              className="peer sr-only"
            />
            <span className="flex min-w-40 cursor-pointer flex-col gap-0.5 border border-border bg-background px-4 py-2.5 transition-colors duration-300 ease-site hover:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                {entry.label}
              </span>
              <span className="font-meta text-[10px] uppercase tracking-[0.12em] opacity-70">
                {entry.sub}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <p
        data-secondary
        aria-live="polite"
        className="max-w-2xl text-sm leading-relaxed text-foreground/70"
      >
        {active.description}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Presentation } from "lucide-react";

/**
 * Toggles presentation mode by setting data-presentation on <html>, so the
 * server-rendered copy can react through CSS. Owns the keyboard shortcuts:
 * Escape exits, arrow keys ask the lab to cycle hashing modes.
 */
export default function PresentationToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (on) {
      root.dataset.presentation = "true";
    } else {
      delete root.dataset.presentation;
    }
    window.dispatchEvent(new CustomEvent<boolean>("lab:presentation", { detail: on }));
  }, [on]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOn(false);
        return;
      }
      if (!document.documentElement.dataset.presentation) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent<number>("lab:cycle", {
          detail: event.key === "ArrowRight" ? 1 : -1,
        }),
      );
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn((value) => !value)}
      className="flex h-10 shrink-0 cursor-pointer items-center gap-2 border border-foreground px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ease-site hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary"
    >
      <Presentation className="h-3.5 w-3.5" aria-hidden />
      <span>{on ? "Exit presentation" : "Presentation mode"}</span>
    </button>
  );
}

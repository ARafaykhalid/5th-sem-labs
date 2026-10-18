import { ExternalLink } from "lucide-react";
import PasswordLab from "@/components/password-lab";
import PresentationToggle from "@/components/presentation-toggle";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-5 py-8 sm:px-8 lg:py-12">
      <header className="flex items-center justify-between gap-4 border-b border-foreground pb-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
            Password Lab
          </span>
          <span data-secondary className="font-meta text-[11px] text-foreground/60">
            Information Security Lab · case study
          </span>
        </div>
        <PresentationToggle />
      </header>

      <section className="hero flex flex-col gap-6">
        <p
          data-secondary
          className="w-fit border-l-2 border-primary pl-3 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/70"
        >
          Unsalted SHA-1 → salted SHA-1 → Argon2id
        </p>
        <h1 className="font-brand text-[clamp(2.9rem,7vw,5.4rem)] leading-[0.92]">
          <span className="block">Same password.</span>
          <span className="block text-primary">Different protection.</span>
        </h1>
        <p
          data-secondary
          className="max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg"
        >
          Explore how salts and password-hashing algorithms change what an exposed database
          reveals. Both users below store the same sample password.
        </p>
      </section>

      <PasswordLab />

      <footer className="flex flex-col gap-4 border-t border-foreground pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70">
            Nothing leaves this page. Hashing runs in your browser.
          </p>
          <a
            href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-accent/50 underline-offset-4 transition-colors duration-300 ease-site hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            OWASP Password Storage Cheat Sheet
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
        <p data-secondary className="max-w-3xl text-xs leading-relaxed text-foreground/60">
          A hash is one-way, and password hashing is not encryption. A salt is not secret and
          does not make a weak password strong. Salting stops precomputed tables from being
          reused and stops matching rows across users, but offline guessing stays possible
          wherever the algorithm is fast. The exact entry method behind the 2012 LinkedIn
          breach was never publicly confirmed.
        </p>
        <p data-secondary className="font-meta text-[11px] text-foreground/60">
          Abdul Rafay Khalid · 24BSSW038 · Hyderabad Institute for Technology and Management Sciences
        </p>
      </footer>
    </main>
  );
}

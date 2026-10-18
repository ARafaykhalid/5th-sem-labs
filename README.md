# Password Lab

An interactive demonstration of the password-storage weaknesses behind the 2012 LinkedIn breach: unsalted SHA-1, salted SHA-1, and Argon2id, with every hash computed locally in your browser.

Built as the practical component of an Information Security Lab case study by Abdul Rafay Khalid (24BSSW038), Hyderabad Institute for Technology and Management Sciences. The visual language (colors, type, spacing, motion) is grounded in the verified light theme of [abdulrafaykhalid.dev](https://abdulrafaykhalid.dev): white surfaces, black type, electric blue `#01f` primary, `#46c` borders, `0.45rem` radius, and the site's own General Sans / Black Rolmer / Carmen Sans web fonts, self-hosted from `app/fonts/`.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Production build:

```bash
pnpm build
pnpm start
```

Checks:

```bash
pnpm typecheck  # tsc --noEmit (TypeScript 7.0.2)
pnpm lint       # ESLint via eslint-config-next
pnpm test       # Vitest hash suite
```

## Stack

| Piece | Version | Note |
| --- | --- | --- |
| Next.js | 16.4.2 | App Router. Server Components by default; `"use client"` only on the presentation toggle and the lab island. |
| React | 19.3.0 | Version shipped with the scaffold for this Next release. |
| TypeScript | 7.0.2 | Native compiler via `@typescript/native`. See the deviation note below. |
| Tailwind CSS | 4.3.3 | CSS-first configuration, tokens in `app/globals.css`. |
| hash-wasm | 4.12.0 | Argon2id (loaded lazily, only when that mode is first used). |
| lucide-react | 1.59.0 | Icons, used sparingly. |
| pnpm | 10.30.0 | Package manager. |

No backend, database, auth, remote API, analytics, or state library. Web Crypto covers SHA-1 and salt generation.

### TypeScript compatibility deviation

TypeScript 7.0.2 exists and is used for all type checks and the build. Its package intentionally ships no compiler API, so `typescript-eslint` cannot run on it yet. The project therefore uses the side-by-side layout Microsoft documents in the TypeScript 7.0 release notes:

```json
"typescript": "npm:@typescript/typescript6@6.0.2",   // TS 6 API for lint tooling
"@typescript/native": "npm:typescript@7.0.2"          // real tsc 7 for typecheck/build
```

`pnpm exec tsc` runs 7.0.2; ESLint resolves the 6.0 API. Everything passes.

## How the hashing works

All functions live in `lib/hash.ts`, separate from all presentation components.

- **Unsalted SHA-1**: `SHA1(utf8(password))` via `crypto.subtle.digest`.
- **Salted SHA-1**: `SHA1(utf8(password) + ":" + lowercase-hex(salt))`. Salts are 16 random bytes from `crypto.getRandomValues`. The salt is the fixed-length trailing hex run and never contains `:`, so the password/salt split is unambiguous for any password (tested).
- **Argon2id**: hash-wasm with `m = 47104 KiB (46 MiB), t = 1, p = 1`, 32-byte tag, `outputType: "encoded"`. These are the OWASP Password Storage Cheat Sheet minimums: quick on a classroom laptop, while the cost gap against SHA-1 stays obvious. The encoded output carries algorithm, parameters, salt, and hash.
- Salts stay stable for the life of the experiment and regenerate on reset. Hashing is debounced, and stale asynchronous results are discarded via a run token. The demo never fabricates a hash: every value on screen was computed at render time.

## Privacy

Everything runs in the browser. Passwords, salts, and hashes are never transmitted, stored, or logged: no cookies, no analytics, no persistence of any kind. The default `hello123` is clearly marked as a synthetic example. Reset clears whatever was typed and the computed results and starts a fresh experiment.

## Tests

`tests/hash.test.ts` (Vitest, node environment, 12 tests):

- SHA-1 FIPS 180-1 `abc` vector and byte-for-byte agreement with `node:crypto` (UTF-8, empty, long input).
- Unsalted mode: identical passwords produce identical digests.
- Salted mode: different salts produce different digests; identical salt and password reproduce; the `password + ":" + salt` encoding cannot be confused with a shifted split.
- Salt format: 16 bytes, lowercase hex.
- Argon2id: matches a vector independently computed with Python `argon2-cffi` (raw hex and encoded form), reproducible for identical inputs, different for different salts, and parameter values pinned.

Browser verification (Playwright harness, Chromium headless): real digests in all three modes, identical vs different verdicts, clipboard receives full untruncated hashes, presentation mode fits 1920x1080 with zero overflow, arrow keys cycle modes, Escape exits, the stale-result guard follows the latest input under fast typing, reduced-motion preferences are honored, mobile layout at 390px, and zero console errors.

## Structure

```
app/
  layout.tsx        fonts, metadata
  page.tsx          server component: header, hero, footer
  globals.css       design tokens, presentation-mode rules, keyframes
components/
  password-lab.tsx        client island: state, hashing runs, reset
  presentation-toggle.tsx client island: presentation mode + keyboard
  mode-switcher.tsx       radio group for the three algorithms
  user-column.tsx         one user's password -> algorithm -> hash flow
  verdict.tsx             comparison result strip
lib/
  hash.ts           pure hashing core (SHA-1, salted SHA-1, Argon2id)
tests/
  hash.test.ts
```

## Sources and honesty notes

- The 2012 breach exposed roughly 6.5M password hashes; LinkedIn announced salting afterward and never publicly confirmed the exact entry method. The app repeats no unverified claim.
- SHA-1 remains unsuitable for password storage even when salted. Salted hashing does not prevent offline guessing; it stops precomputed tables and cross-user matching. A salt is not secret, and hashing is not encryption.
- Argon2id raises the cost of guessing. It does not make guessing impossible.

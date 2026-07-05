# Phase 0 — Scaffold · Validation

Phase 0 is **done and mergeable** when all of the following hold.

## Primary acceptance criteria

- [ ] `npm install` completes cleanly from a fresh clone.
- [ ] `npm run dev` starts the Vite dev server without errors.
- [ ] `npm run build` produces a production build with no errors.
- [ ] `npm run preview` serves the built app.
- [ ] The app renders a **placeholder shell** (app title + a visible
      "scaffold ready" marker) proving Svelte + TS + Vite are wired together.

## Toolchain checks

- [ ] `npm run test` runs Vitest and the sample test passes.
- [ ] `npm run lint` (Biome) reports zero errors.
- [ ] `npm run format` (Biome) leaves the tree unchanged (already formatted).

## Structure checks

- [ ] `src/` contains `lib/`, `styles/`, and `components/ui/` per
      `tech-stack.md`.
- [ ] `main.ts` mounts `App.svelte`.
- [ ] The prototype (`index.html`/`main.js`/`globals.css`) is preserved for
      reference and **not** imported by the new app.

## How to verify

```bash
npm install
npm run lint
npm run test
npm run build
npm run dev     # then open the served URL and confirm the placeholder renders
```

## Explicitly not required this phase

- Design tokens, global reset, or UI primitives (Phase 0.5).
- Any data model, storage, search, filtering, or CRUD (Phase 1+).
- Husky pre-commit hooks or CI.

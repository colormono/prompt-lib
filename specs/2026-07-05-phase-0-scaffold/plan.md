# Phase 0 — Scaffold · Plan

Numbered task groups. Complete in order; each group leaves the repo in a
working state.

## 1. Initialize the Vite + Svelte + TypeScript project

1.1 Scaffold a Vite project using the `svelte-ts` template into the repo.
1.2 Reconcile the entry `index.html` with the existing prototype root
    `index.html` — keep the prototype for reference (rename if needed), let
    Vite own the app entry.
1.3 Add `package.json` scripts: `dev`, `build`, `preview`.
1.4 Add `.gitignore` for `node_modules/`, `dist/`, and local env files.
1.5 Install dependencies and confirm `npm run dev` serves the default app.

## 2. Establish the source layout

2.1 Create the `src/` structure from `tech-stack.md`:
    `lib/`, `styles/`, `components/ui/`.
2.2 Add a minimal `App.svelte` placeholder shell (app title + "scaffold ready"
    marker), mounted from `main.ts`.
2.3 Add `.gitkeep` or a short stub in each empty folder so structure is tracked.

## 3. Configure Vitest

3.1 Add Vitest and its Svelte/jsdom test dependencies.
3.2 Add test config (Vitest section in Vite config or `vitest.config.ts`).
3.3 Add a `test` script and one trivial sanity test that passes.

## 4. Configure Biome (lint + format)

4.1 Install `@biomejs/biome` and init `biome.json`.
4.2 Configure formatter + linter rules aligned to project conventions.
4.3 Add `lint` and `format` scripts.
4.4 Run Biome across the new source and fix any reported issues.

## 5. Verify & finalize

5.1 Run `npm run dev`, `npm run build`, and `npm run preview` — all succeed.
5.2 Run `npm run test` and `npm run lint` — all pass clean.
5.3 Update `README.md` with setup / dev / build / test commands.
5.4 Commit using Conventional Commits (e.g. `chore: scaffold svelte+ts+vite`).

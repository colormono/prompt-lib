# Phase 0 — Scaffold · Requirements

## Goal

Stand up the project foundation from the tech stack: a **Svelte + TypeScript +
Vite** single-page app with **Vitest** for tests and **Biome** for lint/format.
This phase ships nothing user-facing beyond a placeholder app shell — it exists
so every later phase has a clean, typed, testable base to build on.

## Scope

In scope:

- Initialize a Vite project using the Svelte + TypeScript template.
- Wire up Vitest for unit/logic tests.
- Configure Biome as the single lint + format tool.
- Establish the `src/` layout from `tech-stack.md` (empty/stub folders for
  `lib/`, `styles/`, `components/`).
- A minimal `App.svelte` placeholder shell that renders and confirms the
  toolchain works end to end.
- npm scripts: `dev`, `build`, `preview`, `test`, `lint`, `format`.

Out of scope (later phases):

- Design tokens, global reset, UI primitives → Phase 0.5.
- Data model, storage, stores → Phase 1.
- Any CRUD, search, filtering, or real UI.

## Decisions

- **Prototype coexistence:** Keep the existing prototype
  (`index.html`, `main.js`, `globals.css`) at the repo root **for reference**.
  The new app is built under `src/` alongside it. The prototype's `globals.css`
  is **not** reused (per roadmap Phase 0.5). Vite's entry `index.html` will live
  where the Svelte template expects it; if it collides with the prototype's
  root `index.html`, the prototype file is preserved (e.g. renamed for
  reference) rather than deleted.
- **Tooling:** Use **Biome** for both linting and formatting (single tool,
  no ESLint/Prettier). No Husky/CI in this phase.
- **Language/style conventions** (from `tech-stack.md`): TypeScript everywhere,
  explicit types/interfaces, functional core with side effects at the edges,
  Conventional Commits.

## Context

- `specs/mission.md`: local-first personal AI asset catalog, single user, no
  backend or accounts.
- `specs/tech-stack.md`: Svelte + TS + Vite, localStorage persistence, design
  system from scratch, Vitest, functional core. Defines the target `src/`
  structure this phase seeds.
- `specs/roadmap.md`: Phase 0 = "Initialize Svelte + TypeScript + Vite project"
  and "Add Vitest and a lint/format setup." Each phase must leave the app usable.

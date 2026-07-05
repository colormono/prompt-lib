# Roadmap

High-level implementation order in small, shippable phases. Each phase should
leave the app usable. Phase 1 focus (per stakeholder): **core CRUD + a search,
tagging, and filtering foundation.**

## Phase 0 — Scaffold ✅ Done

- Initialize Svelte + TypeScript + Vite project.
- Add Vitest and a lint/format setup.

## Phase 1 — Design system ✅ Done

- Define design tokens in `styles/tokens.css` (color, type, spacing, radii,
  shadows) with light/dark themes.
- Add a `global.css` reset + base element styles.
- Build core UI primitives (Button, Input, Card, Badge/Tag, Modal) on the tokens.
- Do not reuse the prototype's `globals.css`.

## Phase 2 — Data model & core CRUD

- Define `types.ts`: `BaseAsset` + the four asset shapes.
- Build `storage.ts`: typed load/save against localStorage.
- Add `stores.ts`: reactive Svelte store backed by storage.
- List assets as cards.
- Create, edit, and delete an asset via a typed form.
- Per-type fields shown/hidden based on asset type.
- Validation on create/edit.

## Phase 3 — Search foundation (part B)

- Full-text search across titles, descriptions, bodies, tags, model names.
- Pure, tested `search.ts` functions.

## Phase 4 — Filtering & tags (part B)

- Filter by type with live counts.
- Free-form tagging on assets.
- Filter by one or more tags.

## Phase 5 — Favorites

- Toggle favorite on an asset.
- Filter to show only starred assets.

## Phase 6 — Portability

- Export the whole library to JSON.
- Import a library from JSON (with a resolve/merge step).
- Reset to a starter library.

## Phase 7 — Quality & maintenance

- Status per asset (draft / tested / retired).
- Usage count + last-used timestamp.
- Duplicate detection.

---

## Backlog (later, out of Phase 1 scope)

- Prompt power features: fillable variables, one-click copy (raw / filled),
  versioning with rollback and compare, chaining, model variants.
- Result notes and quick ratings.
- Collections that group assets by workflow.
- Review reminders for stale assets.
- Migration to IndexedDB if data volume outgrows localStorage.

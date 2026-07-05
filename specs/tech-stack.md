# Tech Stack

## Summary

A local-first single-page app built with **Svelte + TypeScript + Vite**, storing
all data in the browser. No backend, no accounts, no network dependencies at
runtime.

## Core choices

| Concern       | Choice                          | Why                                                        |
| ------------- | ------------------------------- | --------------------------------------------------------- |
| UI framework  | **Svelte**                      | Minimal boilerplate, reactive by default, small bundle    |
| Language      | **TypeScript**                  | Types/interfaces for every asset shape; safer refactors   |
| Build tool    | **Vite**                        | Fast dev server, first-class Svelte + TS support          |
| Persistence   | **localStorage** (IndexedDB later if needed) | Local-first, zero setup, works offline       |
| Styling       | Design system built from scratch (CSS custom properties / design tokens) | Clean, intentional foundation; no legacy baggage |
| Testing       | **Vitest**                      | Native Vite integration for unit/logic tests              |

## Design system

Built from scratch — do not reuse the prototype's `globals.css`.

- **Design tokens first.** Define colors, typography, spacing, radii, and
  shadows as CSS custom properties in a single `tokens.css`.
- **Light/dark themes** via token overrides on a root data attribute.
- **Small primitive set.** Button, Input, Card, Badge/Tag, Modal built as Svelte
  components on top of the tokens before feature UI is written.
- **Accessible by default.** Visible focus states, sufficient contrast, semantic
  markup.

## Architecture

- **Local-first, offline-first.** The app never requires the network. State is
  loaded from and persisted to the browser on every mutation.
- **Component-driven.** Svelte components for cards, lists, forms, and filters.
- **Functional core.** Pure, typed functions for storage, search, filtering, and
  validation — kept separate from components and easy to unit test.
- **Reactive state.** Svelte stores hold the in-memory library; the storage
  layer is the single serialization boundary.

## Suggested project structure

```
src/
  lib/
    types.ts          # Asset interfaces (Prompt, Skill, Tool, Resource) + shared unions
    storage.ts        # load/save/export/import against localStorage (typed, pure-ish)
    search.ts         # full-text search + tag/type filtering (pure functions)
    validation.ts     # asset validation + duplicate detection
    stores.ts         # Svelte stores wrapping the library + derived filtered views
  styles/
    tokens.css        # design tokens: colors, type, spacing, radii, shadows
    global.css        # reset + base element styles built on tokens
  components/
    ui/               # design-system primitives (Button, Input, Card, Badge, Modal)
    AssetCard.svelte
    AssetList.svelte
    AssetForm.svelte
    SearchBar.svelte
    FilterBar.svelte
  App.svelte
  main.ts
```

## Data model (v1)

Every asset shares a common base; each type extends it with its own fields.

```ts
type AssetType = "prompt" | "skill" | "tool" | "resource";
type AssetStatus = "draft" | "tested" | "retired";

interface BaseAsset {
  id: string;
  type: AssetType;
  title: string;
  description: string;
  tags: string[];
  status: AssetStatus;
  favorite: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

Type-specific fields (e.g. `body`/`model`/`variables` for prompts, `url` for
tools and resources) extend `BaseAsset` and are defined in `types.ts`.

## Constraints & conventions

- TypeScript everywhere; provide explicit types and interfaces.
- Prefer functional programming and composition; keep side effects at the edges.
- Handle errors, loading, and validation states explicitly.
- Consider accessibility for all interactive components (labels, roles, focus).
- Follow Conventional Commits.

## Deliberately excluded

- No server, database engine, or ORM.
- No authentication / user management.
- No cloud sync service.

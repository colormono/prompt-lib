# Requirements — Phase 3: Search, Filtering & Favorites

## Scope

Combines roadmap Phases 3–5: full-text search, type filtering with live
counts, free-form tagging, tag filtering, and favorites.

### In scope

- **No new tagging field.** Phase 2 already replaced the roadmap's generic
  "tags" concept with the structured `roles: string[]` field on
  `BaseAsset`. This phase's "free-form tagging" and "filter by tag" roadmap
  items are implemented over the existing `roles` field — no new field is
  added to the data model.
- **Full-text search** across, per asset:
  - `title`, `description`, `roles`, `category`
  - Type-specific body text: `prompt` (PromptAsset), `body` (SkillAsset)
  - Type-specific identifiers: `model` (PromptAsset), `url` (ToolAsset,
    ResourceAsset)
  - Case-insensitive, substring match (no fuzzy matching, no ranking).
- **Type filter** — single-select (all types, or exactly one type).
  Live counts shown next to each type option, reflecting the library after
  search/roles/favorites are applied but *before* the type filter itself, so
  counts stay meaningful while switching types.
- **Role filter** ("filter by tag" from the roadmap) — multi-select from the
  set of distinct `roles` values across the whole library. Selecting
  multiple roles is an AND filter (asset must have every selected role).
- **Category filter** — chips built from the set of distinct `category`
  values across the library. `category` is a single string per asset (not
  an array like `roles`), so selecting multiple category chips is an OR
  filter (asset matches if its category is any one of the selected chips).
- **Favorites** — toggle a star on any asset (already has a `favorite: boolean`
  field from Phase 2; only the toggle UI and filter are new this phase).
  Favorites-only is a toggle in the same toolbar, not a separate view.
- **Combined filtering.** Search, type, roles, categories, and
  favorites-only all combine with AND (category chips OR *within*
  themselves, then AND with every other dimension). Toolbar lives above
  the asset list (search input, type select, role chips, category chips,
  favorites toggle). Search input is debounced (~250ms) so typing doesn't
  re-filter on every keystroke.
- Empty states: no assets at all vs. no assets matching the current filters
  are distinct messages.

### Out of scope (future phases / backlog)

- Role autocomplete/suggestions while typing (the existing plain
  comma-separated text input on the form is unchanged).
- Saved filter presets.
- Sorting controls beyond existing manual `order`.
- Export/import (Phase 4), status/usage/duplicates (Phase 5).

## Decisions

- **Reuse `roles`, don't add `tags`.** Per Phase 2's decisions, `roles` is
  the field the rest of the roadmap's "tag" language refers to. Introducing
  a second, separate free-form field would duplicate `roles` for no benefit
  — search, filtering, and the UI all operate on `roles` as-is.
- **Filter state lives in `stores.ts`**, alongside the existing `library`
  store, as a small set of writable stores (`searchQuery`, `activeType`,
  `activeRoles`, `activeCategories`, `favoritesOnly`) plus one derived store
  (`visibleAssets`) that applies pure functions from `search.ts` to
  `library`. Components never filter directly — they read `visibleAssets`
  and call setter functions.
- **All filter dimensions AND together**; within the role filter, multiple
  selected roles also AND (an asset must have all of them, not just one).
  Within the category filter, multiple selected categories OR (an asset
  matches if it has any one of them), since `category` only ever holds a
  single value per asset.
- **Filtering logic is pure and pushed into `search.ts`**, fully unit-tested
  independent of Svelte, per the existing "functional core" convention
  (`storage.ts`, `validation.ts`).
- **No new dependencies.** Debounce is a small local utility (or a plain
  `setTimeout`-based helper), not a library.
- **No data migration needed** — `roles` already exists on every persisted
  asset from Phase 2.

## Context

- Follow existing conventions: Svelte 5 runes (`$state`, `$derived`,
  `$effect`, `$props`), TypeScript everywhere, functional core / component
  shell split (see `specs/tech-stack.md`).
- Reuse existing UI primitives (`Input`, `Select`, `Badge`, `Button`) rather
  than building new primitives — this phase is feature UI, not design system
  work (Phase 1 is done).
- Role chips already render as `Badge` in `AssetCard.svelte` — follow that
  same pattern in the role filter control.
- Favorite toggle should be an accessible icon button (visible focus state,
  `aria-pressed` or equivalent, not color-only) per the project's
  accessibility conventions.
- No server/network involved; all filtering runs in-memory over the
  `library` store already loaded from `localStorage`.

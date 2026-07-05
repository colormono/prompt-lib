# Plan — Phase 3: Search, Filtering & Favorites

No data model changes are needed this phase — `roles` (Phase 2) already
serves as the "tag" field the roadmap refers to, and `favorite` already
exists on `BaseAsset`.

## 1. `search.ts` (pure, tested)

1.1. `searchableText(asset: Asset): string` — builds a lowercased blob per
asset from `title`, `description`, `category`, `roles`, and type-specific
fields (`prompt`, `model` for prompts; `body` for skills; `url` for
tools/resources).

1.2. `matchesQuery(asset: Asset, query: string): boolean` — substring match
against `searchableText`; empty/whitespace query always matches.

1.3. `matchesType(asset: Asset, type: AssetType | null): boolean`.

1.4. `matchesRoles(asset: Asset, roles: string[]): boolean` — AND semantics;
empty `roles` filter always matches.

1.5. `matchesCategories(asset: Asset, categories: string[]): boolean` — OR
semantics (`category` is single-valued per asset, so any match qualifies);
empty `categories` filter always matches.

1.6. `matchesFavorite(asset: Asset, favoritesOnly: boolean): boolean`.

1.7. `filterAssets(assets: Asset[], filters: AssetFilters): Asset[]` —
composes 1.2–1.6.

1.8. `countByType(assets: Asset[]): Record<AssetType, number>` — for the
type filter's live counts, called with the *non-type* filters already
applied.

1.9. `distinctRoles(assets: Asset[]): string[]` — sorted, de-duplicated
`roles` values across the library, for the role filter's option list.

1.10. `distinctCategories(assets: Asset[]): string[]` — sorted,
de-duplicated `category` values across the library, for the category
filter's chip list.

1.11. Unit tests in `search.test.ts` covering each function, combined
filtering, case-insensitivity, and empty-input edge cases (including the
role-AND vs. category-OR distinction).

## 2. Stores

2.1. In `stores.ts`, add writable stores: `searchQuery`, `activeType`,
`activeRoles`, `activeCategories`, `favoritesOnly` (with sensible initial
values: `""`, `null`, `[]`, `[]`, `false`).

2.2. Add a derived store `visibleAssets` combining `library` + the five
filter stores via `filterAssets`.

2.3. Add setter/toggle helpers: `setSearchQuery`, `setActiveType`,
`toggleActiveRole`, `toggleActiveCategory`, `setFavoritesOnly`,
`clearFilters`.

2.4. Add `toggleFavorite(id: string): void`, mirroring `updateAsset`'s
immutable-update pattern, bumping `updatedAt`.

2.5. Extend `stores.test.ts` with tests for `toggleFavorite` and for
`visibleAssets` reacting to filter/library changes.

## 3. Components

3.1. New `FilterBar.svelte`: search `Input` (debounced via a local
`debounce` helper), type `Select` (options built from `ASSET_TYPES` +
`countByType`), role chips (toggleable `Badge`/`Button` list from
`distinctRoles`), category chips (toggleable `Badge`/`Button` list from
`distinctCategories`), favorites toggle button. Reads/writes the stores
from 2.1–2.3.

3.2. `AssetCard.svelte`: add a favorite toggle icon button (calls
`toggleFavorite`). Existing `roles` badges are unchanged.

3.3. `AssetForm.svelte`: no changes — the "Roles" field already exists and
covers this phase's tagging needs.

3.4. `AssetList.svelte`: render `FilterBar` above the list; source cards
from `visibleAssets` instead of `library`; add a distinct empty state for
"no results match your filters" (with a "Clear filters" action) vs. "no
assets yet".

## 4. Wiring & tests

4.1. Confirm `App.svelte` needs no changes (filter state lives in stores,
not passed as props) beyond what `AssetList` already receives.

4.2. Add/extend `App.test.ts` (or component-level tests) covering: typing a
search query narrows the list, selecting a type narrows the list, toggling
a role chip narrows the list (AND across roles), toggling category chips
narrows the list (OR across categories), toggling favorites-only narrows
the list, and clearing filters restores the full list.

4.3. Run `npm run test` and `npm run check` and fix any failures.

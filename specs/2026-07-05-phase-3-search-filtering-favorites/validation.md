# Validation — Phase 3: Search, Filtering & Favorites

## Automated

- `npm run test` passes, including new/extended suites:
  - `search.test.ts` — every function in `search.ts` covered, including
    case-insensitivity, empty-query/empty-roles/empty-categories edge
    cases, AND semantics for multi-role selection, and OR semantics for
    multi-category selection.
  - `stores.test.ts` — `toggleFavorite` flips the flag and bumps
    `updatedAt`; `visibleAssets` updates when `library` or any filter store
    changes; each filter dimension (search, type, roles, categories,
    favorites) narrows results independently and in combination.
  - `validation.test.ts` — unaffected; confirm it still passes unmodified
    (no data model changes this phase).
- `npm run check` (svelte-check + tsc) passes with no new type errors.
- `npm run lint` passes with no new Biome findings.

## Manual

- **Search:** typing in the search box narrows the list to assets whose
  title, description, category, roles, prompt/body text, model, or URL
  contains the query (case-insensitive); clearing the box restores the
  full list. Typing quickly doesn't visibly lag or flicker (debounce is
  working).
- **Type filter:** selecting a type shows only that type; the counts shown
  per type update as search/roles/categories/favorites change, and always
  sum correctly against the currently filtered set.
- **Roles (tag filter):**
  - The role filter lists every distinct `roles` value in the library;
    selecting more than one role requires an asset to have *all* selected
    roles (AND).
  - Existing "Roles" field on the asset form (create/edit) is unchanged
    and still the only way to add/edit roles.
- **Categories (cat chips):**
  - The category filter lists every distinct `category` value in the
    library as chips; selecting multiple category chips shows assets
    matching *any* of them (OR), since each asset has exactly one
    category.
  - Existing "Category" field on the asset form is unchanged.
- **Favorites:**
  - The star toggle on a card flips immediately, persists across a reload,
    and is keyboard-operable with a visible focus state.
  - The favorites-only toggle in the toolbar, combined with any other
    filter, shows only starred assets matching the rest of the criteria.
- **Empty states:** an empty library shows a distinct message from a
  non-empty library where the current filters match nothing; the
  "no results" state offers a way to clear filters.
- **Combining filters:** search + type + roles + categories +
  favorites-only all applied at once produce the intersection across
  dimensions (role AND, category OR within itself), not a flat union.
- **Accessibility:** favorite toggle, role chips, and category chips are
  reachable and operable via keyboard (Tab/Enter/Space), with visible
  focus rings and non-color-only state indication.

## Definition of done

- All automated checks above pass on the `phase-3-search-filtering-favorites`
  branch.
- Manual walkthrough above completed with no open issues.
- `specs/roadmap.md` Phase 3 items can be marked done (or left for the user
  to mark) once merged.
- No new fields were added to the data model; no new runtime dependencies
  were introduced.

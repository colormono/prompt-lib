# Phase 5 — UX redesign: Plan

Numbered task groups, each independently implementable and testable. Groups
0–2 are pure logic/types (test-first friendly); groups 3–7 are UI, wired last.

## 0. Typed taxonomy (`src/lib/types.ts`, `src/lib/storage.ts`, fixtures)

0.1. Add `Category` and `Role` string-literal unions plus `CATEGORIES` /
`ROLES` const arrays (order per requirements; `ROLES` de-duplicated —
`design` once). Change `BaseAsset.category: string` → `category: Category`
and `roles: string[]` → `roles: Role[]`; same for the draft types.

0.2. Add a display helper (title-case: `on-call` → "On-call", `pm` → "PM")
used by the form, chips, and cards.

0.3. In `storage.ts`, coerce off-list values on load: unknown `category` →
default `"build"`, unknown `roles` entries dropped. Keep `loadLibrary`
fail-safe. Add/extend a storage test for coercion.

0.4. Update `fixtures/*.json` and `starterLibrary.ts` to use only valid
`Category`/`Role` values.

## 1. Preferences core (`src/lib/prefs.ts`)

1.1. Define `type Theme = "light" | "dark"` and
`type ViewMode = "list" | "grid"`, plus `interface Prefs { theme: Theme;
viewMode: ViewMode }`.

1.2. `loadPrefs(): Prefs` — reads `prompt-lib:prefs` from `localStorage`;
never throws; falls back to defaults on missing/invalid data. Default
`viewMode: "list"`; default `theme` from
`matchMedia("(prefers-color-scheme: dark)")` when unset.

1.3. `savePrefs(prefs: Prefs): void` — serializes to the prefs key. Kept
separate from the library storage key so `storage.ts` is untouched.

1.4. `applyTheme(theme: Theme): void` — sets `data-theme` on
`document.documentElement` (matches the token system's root-attribute
theming).

1.5. Unit tests in `prefs.test.ts`: load with empty storage (defaults),
load with valid/invalid JSON, save→load round-trip, and theme default
derivation (mock `matchMedia`).

## 2. Filter store: single-select (`src/lib/stores.ts`, `src/lib/search.ts`)

2.1. Replace `activeRoles: writable<string[]>` /
`activeCategories: writable<string[]>` with
`activeRole: writable<Role | null>` / `activeCategory: writable<Category |
null>`. `availableCategories`/`availableRoles` derive from the fixed
`CATEGORIES`/`ROLES` arrays filtered to values present in the library.

2.2. Replace `toggleActiveRole`/`toggleActiveCategory` with
single-select setters that toggle off when the same value is re-selected
(`setActiveRole(role)`, `setActiveCategory(category)`).

2.3. Update `clearFilters`, the `activeFilters` derived store, and
`EMPTY_FILTERS` accordingly.

2.4. Update `search.ts` filtering from "matches any selected role/category"
to "matches the single selected role/category (or no filter when null)".

2.5. Add `theme`/`viewMode` writables seeded from `loadPrefs()`, with a
subscription that calls `savePrefs`/`applyTheme` on change (mirrors the
existing `library`→`saveLibrary` subscription pattern). Expose
`toggleTheme()` and `setViewMode(mode)` actions.

2.6. Update `stores.test.ts` and `search.test.ts` for the single-select
behaviour and the new preference actions.

## 3. Header / sticky toolbar (`src/components/AppHeader.svelte`, `App.svelte`)

3.1. Extract the header into `AppHeader.svelte`: a sticky top toolbar
(`position: sticky; top: 0`) containing logo/title (button that opens the
About modal), "New asset", "Data", theme toggle, and view toggle.

3.2. Theme toggle: icon `Button` bound to `theme` store via `toggleTheme()`,
`aria-pressed`/`aria-label` reflecting current mode.

3.3. View toggle: list/grid segmented control bound to `viewMode`
(`setViewMode`), `aria-pressed` per option, `aria-label`s "List view" /
"Grid view".

3.4. Remove the old `.dev-link` style-guide anchor and centered header from
`App.svelte`; wire `AppHeader` props/state from `App.svelte` alongside the
existing modal state.

## 4. About modal (`src/components/AboutModal.svelte`)

4.1. `AboutModal.svelte` using the existing `Modal` primitive: app name,
one-line purpose (from `mission.md`), and the `#style-guide` link (preserves
access to `StyleGuide`).

4.2. Open state driven from the logo click in `AppHeader`, wired in
`App.svelte` like the other modals.

## 5. Filters bar redesign (`src/components/FilterBar.svelte`)

5.1. Compact layout: search + favorites on one row; type / category / role
chip groups tightened (smaller gaps, inline labels).

5.2. Bind category/role chips to the new single-select store actions; the
active chip renders `primary` and clicking it again clears the filter.

5.3. Remove any references to the removed multi-select stores; update
`hasActiveFilters` to the single-select shape.

## 6. Asset card redesign (`src/components/AssetCard.svelte`, `AssetList.svelte`)

6.1. Replace the Edit/Delete text buttons with **icon buttons**: Copy and
Edit; keep the favorite star. **Remove Delete** from the card. For prompts,
Copy writes the prompt with `slots` filled from the current fill-in values.

6.2. Add a transient "Copied" confirmation with `aria-live="polite"`; handle
clipboard-unavailable/error states gracefully.

6.3. Prompt preview (collapsed state): for `prompt` assets show
`prompt.slice(0, 200)` (trimmed, ellipsis if longer) in place of
`description`; other types keep `description`.

6.4. Inline expand — **"Fill in and copy" panel** (see reference screenshot in
`requirements.md`). Card toggles an in-card accordion (`aria-expanded`,
keyboard operable). For prompt assets the expanded panel renders:
  - a `FILL IN AND COPY` label;
  - the prompt text with each `slot` shown as an **inline highlighted editable
    field** (local component state, seeded from the slot value/key);
  - a `Copy` button (uses group 6.1 with the current field values);
  - a `WHY THIS WORKS` note sourced from `description`;
  - an optional `From <source>` line, shown only if a source exists (no
    data-model change — see requirements).
  For non-prompt assets the panel shows full `body`/`url` + metadata. Stop
click propagation on the icon buttons, favorite, and fillable inputs so they
don't toggle the accordion.

6.5. `AssetList.svelte`: render list vs grid based on `viewMode`; grid keeps
`asset-list__grid`, list uses a new stacked compact layout. Remove the
`onDelete` prop threading now that delete lives in the modal.

## 7. Asset modal redesign (`src/components/AssetForm.svelte`)

7.1. Replace the free-text Category `Input` with a single-choice `Select`
over the fixed `CATEGORIES` list (no free-text entry). Options display
title-cased via the group 0.2 helper.

7.2. Replace the comma-separated Roles `Input` with a multi-select control
over the fixed `ROLES` list (checkbox group or multi-select), producing a
`Role[]`. No free-text entry.

7.3. Move the Model `Input` to render **below** the slots fieldset for prompt
assets.

7.4. Add a **Delete** `Button variant="danger"` in edit mode that triggers the
existing `ConfirmDeleteModal` flow (wired via `App.svelte`), replacing the
card's removed delete action.

## 8. Tests & polish

8.1. Update/extend component tests where precedent exists (`SettingsPanel.test.ts`
style) for: single-select filter chips, theme/view toggles, card copy +
expand, and the modal delete action.

8.2. Full `npm run test`, `npm run check`, and `npm run lint` pass.

8.3. Manual pass per `validation.md`.

# Phase 5 — UX redesign: Validation

## Automated

- `npm run test` passes, including:
  - `prefs.test.ts`: defaults on empty/invalid storage, save→load round-trip,
    `viewMode` defaults to `"list"`, theme derives from `matchMedia` when unset.
  - `stores.test.ts` / `search.test.ts`: category and role filters are
    single-select; selecting a second value replaces the first; re-selecting
    the active value clears it; `null` means "no filter".
  - Component tests (where precedent exists) for theme toggle, view toggle,
    card copy + inline expand, and the modal delete action.
- `npm run check` (svelte-check + tsc) passes — no `activeRoles`/
  `activeCategories` array references remain; the single-select types flow
  through `stores.ts`, `search.ts`, and `FilterBar.svelte`.
- `types.ts` exports `Category`/`Role` unions + `CATEGORIES`/`ROLES` arrays
  (roles de-duplicated); `category: Category` and `roles: Role[]` typecheck
  across the codebase.
- `storage.test.ts`: loading a library with an off-list category coerces to
  `"build"`; off-list roles are dropped; valid data is preserved unchanged.
- `npm run lint` (Biome) passes.

## Manual

Header / toolbar

- Toolbar stays fixed to the top of the viewport while scrolling the library.
- Theme toggle flips light↔dark, updates `data-theme`, and the choice survives a
  page reload. With no stored preference, the initial theme matches the OS.
- View toggle switches list↔grid; **list is the default** on first load; the
  choice survives a reload.
- Clicking the logo opens the About modal (app name, purpose, style-guide link);
  the old header style-guide link is gone but `#style-guide` still reachable.

Filters

- Category chips are single-select: selecting one filters the list; selecting a
  different one replaces it; clicking the active one clears it.
- Role chips behave identically (single-select, toggle-off).
- "Clear filters" resets search, type, category, and role.
- Reloading the page resets filters (they are intentionally not persisted).

Asset cards

- Each card shows Copy and Edit icon buttons plus the favorite star; **no Delete
  button** on the card.
- Copy places the correct text on the clipboard: for prompts the prompt with
  slot values filled in, otherwise body/url per type; shows a brief "Copied"
  confirmation; unavailable clipboard degrades gracefully.
- Prompt cards show the first 200 characters of the prompt (ellipsis when
  longer) instead of the description; non-prompt cards still show description.
- Clicking a prompt card expands a "Fill in and copy" panel matching the
  reference: `FILL IN AND COPY` label, prompt with inline highlighted editable
  slot fields, a `Copy` button that copies the filled prompt, a `WHY THIS
  WORKS` note, and a `From <source>` line only when a source exists.
- Non-prompt cards expand to show full content (body/url) + metadata.
- Editing a fillable slot updates what Copy produces; clicking Copy/Edit/favorite
  or typing in a slot field does not toggle the accordion. Keyboard: the card is
  focusable, toggles with Enter/Space, and exposes `aria-expanded`.

Asset modal

- Category is a single-choice selector over the fixed 19-item list; Roles is a
  multi-select over the fixed 7-item list; both display title-cased labels and
  reject free-text entry.
- For prompt assets, the Model field appears **below** the slots section.
- In edit mode a Delete (danger) action opens the existing confirm-delete flow;
  confirming removes the asset and closes the modal.

Edge cases

- Empty library: header toolbar still renders; About/theme/view controls work;
  no filter chips shown.
- Long prompt with exactly/near 200 chars truncates cleanly without breaking
  layout in either view mode.
- Toggling theme does not reduce contrast below the token system's guarantees in
  either mode (spot-check text/controls in dark and light).

## Tone check

- All new microcopy (About text, "Copied", icon `aria-label`s, delete
  confirmation) is plain and low-key, consistent with existing strings. No
  exclamation marks, no marketing tone.

## Definition of done

- Roadmap Phase 5 items are all satisfied; Quality & maintenance remains
  Phase 6.
- No new runtime dependencies added.
- The only `Asset` change is re-typing `category`/`roles` as fixed unions; no
  new fields or asset types. The library storage key is unchanged; a new,
  separate preferences key is introduced. Existing data with off-list values is
  coerced on load rather than lost or crashing.
- Automated checks (test, check, lint) all pass and the manual walkthrough above
  is verified in both light and dark themes and both view modes.

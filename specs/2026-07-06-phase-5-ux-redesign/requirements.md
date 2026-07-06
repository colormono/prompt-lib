# Phase 5 — UX redesign: Requirements

## Scope

A UX-focused pass over the existing app shell and its four main surfaces. No
new asset types. The only data-model change is **re-typing `category` and
`roles` from free-form strings to fixed, typed unions** (see Decisions);
otherwise this phase reshapes how existing data is presented and interacted
with.

In scope:

- **App header → sticky toolbar.** A single sticky top bar holding the app
  title/logo, the primary "New asset" action, the Data/Settings button, a
  **light/dark theme toggle**, and a **list/grid view toggle** (list is the
  default).
- **Filters bar → compact.** Tighter single-row-ish layout; **single-select
  category chip** and **single-select role chip** (was multi-select); the
  "Design system style guide" link is removed from the header and folded into
  an **About modal** opened by clicking the logo.
- **Asset cards → action icons + inline expand.** A **copy-to-clipboard** icon
  button, an **edit** icon button, the **Delete action moved out of the card**
  into the asset modal, a **200-character prompt preview** (for prompt assets,
  in place of the description), and **click-to-expand inline** detail (accordion
  within the card).
- **Typed taxonomy.** `category` becomes a fixed `Category` union and `roles`
  a `Role[]` over a fixed `Role` union (defined in `types.ts`), replacing the
  current free-form strings.
- **New/Edit asset modal.** Replace free-text category/roles inputs with
  **selectors backed by the fixed lists** (single category, multiple roles),
  and **move the Model field below the slots** section for prompt assets. The
  **Delete action lives here** (edit mode only).

Out of scope (future phases / backlog):

- Asset status, usage counts, timestamps, duplicate detection (Phase 6).
- New asset types or new asset fields (the only type change is re-typing the
  existing `category`/`roles` fields as fixed unions).
- User-editable/custom taxonomy — the category and role lists are fixed in
  code for this phase.
- Multi-select filtering (this phase intentionally narrows to single-select).
- New copy/variable-fill "power features" beyond copy-to-clipboard.

### Surfaces & behaviour

| Surface        | Change                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------- |
| Header toolbar | Sticky; logo (opens About), New asset, Data, theme toggle, view toggle                   |
| Theme          | Light/dark toggle, persisted; defaults to system (`prefers-color-scheme`)                |
| View mode      | List (default) / grid toggle, persisted                                                  |
| Filter chips   | Category: single-select; Role: single-select; click active chip to clear (toggle off)    |
| About modal    | Opened from logo click; houses the design-system style-guide link + brief app info       |
| Asset card     | Copy + Edit icon buttons; no Delete; prompt preview (200 chars); click expands inline     |
| Asset modal    | Category selector, Role selector, Model below slots; Delete action (edit mode)            |
| Taxonomy       | `category` → fixed `Category` union; `roles` → `Role[]` over a fixed `Role` union         |

## Decisions

- **Fixed typed taxonomy.** In `types.ts`, define string-literal unions and
  matching const arrays (source of truth for both the form selectors and the
  filter chips):

  ```ts
  export type Category =
    | "understand" | "plan" | "prototype" | "build" | "test" | "refactor"
    | "review" | "steer" | "debug" | "git" | "release" | "data" | "automate"
    | "product" | "design" | "docs" | "marketing" | "security" | "on-call";

  export type Role =
    | "pm" | "design" | "marketing" | "docs" | "data" | "security" | "ops";

  export const CATEGORIES: Category[] = [/* in the order above */];
  export const ROLES: Role[] = [/* in the order above */];
  ```

  `BaseAsset.category: string` becomes `category: Category` and
  `roles: string[]` becomes `roles: Role[]` (same in the draft types). The
  role list de-duplicates the requested input (`design` was listed twice → one
  entry). Values are stored lowercase; the UI title-cases them for display
  (e.g. `on-call` → "On-call", `pm` → "PM").
- **Migration of existing data.** Because the library is local and personal,
  on load `storage.ts` coerces off-list values: unknown `category` falls back
  to a safe default (`"build"`) and unknown `roles` entries are dropped. This
  keeps `loadLibrary` fail-safe (invalid data never crashes the app) and is
  covered by a storage test. Existing fixtures/starter data are updated to use
  only valid values.
- **Theme:** a `theme` preference (`"light" | "dark"`) persisted to
  `localStorage` and applied via a `data-theme` attribute on the document root
  (the existing token system already themes via a root data attribute — see
  `tech-stack.md` and `styles/tokens.css`). Initial value follows
  `window.matchMedia("(prefers-color-scheme: dark)")` when no stored
  preference exists.
- **View mode:** a `viewMode` preference (`"list" | "grid"`) persisted to
  `localStorage`, **defaulting to `"list"`**. Grid reuses the existing
  `asset-list__grid` layout; list is a new stacked/compact layout.
- **Preference persistence is separate from filters.** Only theme and view mode
  persist across sessions. **Active filters (category/role/type/search) do NOT
  persist** — they reset on reload, matching today's behaviour. UI preferences
  live under their own storage key (e.g. `prompt-lib:prefs`), distinct from the
  library key, so `storage.ts`'s library load/save is untouched.
- **Single-select chips:** `activeRoles: string[]` and
  `activeCategories: string[]` collapse to `activeRole: Role | null` and
  `activeCategory: Category | null`. Clicking a chip selects it; clicking the
  already-selected chip clears it (toggle off). `search.ts` filtering updates
  from "matches any of N" to "matches the one selected". Type filter stays
  single-select as it already is. The chip lists are driven by the fixed
  `CATEGORIES`/`ROLES` arrays; only chips for values actually present in the
  library are shown (preserving today's "no empty filters" behaviour).
- **About modal** opens from clicking the logo/title in the header. It contains
  brief app info (name, one-line purpose from `mission.md`) and the existing
  `#style-guide` link, keeping the dev style guide reachable without a header
  link. Reuses the existing `Modal` primitive.
- **Card copy button** copies the most useful text for the asset type via
  `navigator.clipboard.writeText`: for prompts, the `prompt` **with its `slots`
  filled in** using the values entered in the expanded fill-in panel (falls back
  to the slot defaults/keys when collapsed); `body` for skills; `url` for
  tools/resources. Shows a brief "Copied" confirmation (transient, accessible
  via `aria-live`). Falls back gracefully (disabled or error state) if the
  clipboard API is unavailable.
- **Attribution line ("From <source>")** in the reference has **no matching
  field** in today's `Asset` shape. To honour the "no data-model changes" scope,
  it is shown **only when a source is available** and is otherwise omitted;
  adding a dedicated `source`/`origin` field is deferred (flagged as an open
  item, not implemented in this phase).
- **Card actions become icon buttons** (Copy, Edit) alongside the existing
  favorite star. **Delete is removed from the card** and surfaced inside the
  edit modal as a `Button variant="danger"` that opens the existing
  `ConfirmDeleteModal` flow. This declutters cards and matches the intent that
  destructive actions live one level deeper.
- **Prompt preview:** for `prompt` assets the card shows the first 200
  characters of `prompt` (trimmed, with an ellipsis when truncated) instead of
  `description`. Other types keep showing `description`.
- **Inline expand (see reference below):** clicking a card toggles an in-card
  accordion. For **prompt** assets the expanded panel is a **"Fill in and copy"**
  block: the prompt text rendered with its `slots` as **inline highlighted,
  editable fields**, a **Copy** button that copies the prompt with the current
  slot values filled in, and a **"Why this works"** note (from the asset's
  `description`) plus an optional source/attribution line. For non-prompt assets
  the panel shows the full content (`body`/`url`) and metadata. The card is a
  keyboard-accessible control (`aria-expanded`, toggles on Enter/Space), and
  clicks on the action icons/fillable fields do not toggle the accordion.

  Reference (attached prototype for Question 1):

  ![Inline fill-in-and-copy expand example](/Users/colormono/.cursor/projects/Users-colormono-Documents-Code-prompt-lib/assets/Screenshot_2026-07-06_at_9.09.03_AM-01d40416-d088-48ce-883c-9d8a824115e7.png)

  The expanded card mirrors this layout: a `FILL IN AND COPY` label, the prompt
  with highlighted inline slot inputs, a `Copy` button, a `WHY THIS WORKS`
  explanation, and a `From <source>` attribution link.
- **Asset modal selectors:** Category is a single-choice `Select` over the
  fixed `CATEGORIES` list; Roles is a multi-select control over the fixed
  `ROLES` list (checkbox group or multi-select). **No free-text entry** — the
  taxonomy is fixed in code for this phase. Model field moves below the slots
  fieldset for prompt assets.

## Context

- Follow `specs/tech-stack.md`: Svelte + TypeScript + Vite, **no new
  dependencies**. Theme toggle uses `matchMedia` + `localStorage`; clipboard
  uses the native `navigator.clipboard` API; view/list layout is CSS only.
- Follow `specs/mission.md`: local-first, fast retrieval, accessible by
  default. This phase should make retrieval faster and the shell calmer without
  changing what data is stored.
- Match existing conventions: pure logic in `src/lib/` (a small `prefs.ts` for
  theme/view persistence, mirroring `storage.ts`), thin Svelte components,
  stores as the single read/write surface, Conventional Commits, explicit
  loading/error states.
- **Preserve the design system.** Reuse existing tokens (`styles/tokens.css`)
  and UI primitives (`Button`, `Badge`, `Card`, `Modal`, `Select`, `Input`).
  Do not introduce ad-hoc colors or spacing; extend tokens if genuinely needed.
- Copy tone: plain, low-key microcopy consistent with existing strings
  (e.g. `ConfirmDeleteModal`'s "This can't be undone."). No exclamation marks,
  no marketing tone. Icon buttons need `aria-label`s ("Copy to clipboard",
  "Edit", "Toggle theme", "List view", "Grid view").
- Accessibility: sticky toolbar controls must be keyboard-reachable with
  visible focus; toggles expose pressed/expanded state (`aria-pressed` /
  `aria-expanded`); the "Copied" confirmation and any errors use `aria-live`;
  theme toggle must not trap contrast below the tokens' guarantees in either
  mode.

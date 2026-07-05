# Phase 2 — Data Model & Core CRUD · Requirements

## Goal

Give the catalog real data: a typed data model for the four asset shapes, a
localStorage-backed persistence layer, a reactive store, and full create /
read / update / delete flows built on the Phase 1 design system. This is the
first phase where the app holds and manipulates the user's actual library.

## Scope

In scope:

- `src/lib/types.ts`: `AssetType`, `SdlcStage` unions, `BaseAsset` interface,
  and the four type-specific interfaces (`PromptAsset`, `SkillAsset`,
  `ToolAsset`, `ResourceAsset`) extending it, plus an `Asset` discriminated
  union.
- `src/lib/storage.ts`: typed `loadLibrary` / `saveLibrary` against a single
  localStorage key, with safe fallback on missing/corrupt data.
- `src/lib/stores.ts`: a writable Svelte store wrapping the library, backed
  by `storage.ts`, exposing `addAsset` / `updateAsset` / `deleteAsset`
  actions that assign defaults and bump timestamps.
- `src/lib/validation.ts`: pure validation for required shared fields and
  required per-type fields, returning field-level error messages.
- `AssetCard.svelte` + `AssetList.svelte`: list all assets as cards, sorted
  by most-recently-updated, with an empty state when the library is empty.
- `AssetForm.svelte`: a single typed form, hosted in the `Modal` primitive,
  used for both create and edit, with per-type fields shown/hidden based on
  the selected type.
- Confirm-before-delete via a `Modal`.
- Unit tests (Vitest) for `storage.ts`, `validation.ts`, and `stores.ts`.

Out of scope (later phases / backlog, per `specs/roadmap.md`):

- Full-text search (Phase 3).
- Role/category filtering UI (Phase 4). `roles` and `category` are stored
  on every asset this phase, but there's no filter-by-role or
  filter-by-category UI yet — Phase 4's "filter by tag" work operates over
  the `roles` field.
- Favorite toggle UI and "starred only" filter (Phase 5). The `favorite`
  field exists on `BaseAsset` (default `false`) so the type doesn't need to
  change later, but no UI exposes it this phase.
- Status changes, usage-count tracking, and duplicate detection (Phase 7).
  `status`, `usageCount`, and `lastUsedAt` are **not** part of the Phase 2
  type at all — Phase 7 adds them to `BaseAsset` when it implements this
  functionality.
- Export/import/reset (Phase 6).
- Fillable-variable templating and one-click copy (Backlog). Prompt's
  `slots` field stores a name → current-value map for each `{placeholder}`
  in `prompt`, but there's no template-substitution rendering or
  copy-with-values-filled-in UI this phase — copying a prompt copies the
  raw `prompt` string with placeholders intact.
- Manual drag-and-drop reordering. The `order` field exists on `BaseAsset`
  and is auto-assigned on creation, but no reorder interaction is built
  this phase. This isn't on the roadmap anywhere yet — flagged as a
  candidate backlog item, not committed work.

## Decisions

- **Field set beyond `tech-stack.md`'s sample:** the stakeholder asked for
  additional shared fields not in the `tech-stack.md` v1 sketch:
  - `category: string` — a broader grouping than `type` or `roles`.
  - `sdlcStage: SdlcStage` — which SDLC stage the asset is used in
    (`"discover" | "design" | "build" | "ship" | "operate"`).
  - `roles: string[]` — a single free-form taxonomy field replacing both
    `tags` and a separate `targetRoles` idea. Values cover both
    tag-like labels and personas/functions (e.g. `"data"`, `"pm"`,
    `"marketing"`, `"security"`), with no fixed enum since this is a
    single-user tool and the taxonomy is personal. Phase 4's roadmap item
    "free-form tagging + filter by tag" operates over this field.
  - `order: number` — a manual display-order value, auto-assigned as
    `max(order) + 1` on creation. Reordering UI is out of scope (see
    above); the field just avoids a future data migration.
- **Keep `BaseAsset` scoped to Phase 2 needs:** `favorite` ships now
  (field only, default `false`, no UI) since it's simple and stable, but
  `status`, `usageCount`, and `lastUsedAt` are deliberately left out of
  the type this phase. Their shape is more likely to change once Phase 7
  (status transitions, usage tracking, duplicate detection) is actually
  designed, so they're added then rather than guessed at now.
- **Type-specific fields:**
  - `PromptAsset`: `prompt: string` (renamed from the earlier `body`
    draft — the prompt text itself, using `{placeholder}` syntax for fill-
    able spots), `model: string` (optional, e.g. `"gpt-4"`, `""` if
    unspecified), `slots: Record<string, string>` (renamed from the
    earlier `variables: string[]` draft — maps each `{placeholder}` name
    to its current/example value, e.g. `{ file: "@ads-performance.csv" }`;
    no template-substitution rendering or fill-in UI yet, see Scope).
  - `SkillAsset`: `body: string` (instructions/workflow text). Kept as
    `body` rather than `prompt` since a Skill's content isn't a prompt —
    only `PromptAsset`'s field was renamed.
  - `ToolAsset`: `url: string`.
  - `ResourceAsset`: `url: string`, `resourceType: "article" | "video" |
    "doc" | "other"`.
- **ID generation:** `crypto.randomUUID()` — native, zero dependencies.
- **CRUD UI pattern:** one `AssetForm.svelte`, hosted in the `Modal`
  primitive, reused for both create and edit (pre-filled). Avoids
  duplicating form markup across a separate create/edit view.
- **Delete confirmation:** required, via a confirm `Modal` ("Delete
  '<title>'? This can't be undone."). No undo toast this phase.
- **Seed data:** none. The library starts empty; the empty state in
  `AssetList` prompts the user to create their first asset. Matches the
  personal, local-first nature of the tool — no demo content to clear out.
- **Default list order:** most-recently-updated first (`updatedAt` desc).
  Matches "fast retrieval" from `mission.md` — recently touched assets are
  usually the ones being worked on.
- **Test depth:** full unit coverage for the functional core this phase —
  `storage.ts` (round-trip save/load, corrupt-data fallback),
  `validation.ts` (per-type required-field rules), and `stores.ts`
  (add/update/delete mutate state and persist). Unlike Phase 1 (which
  deferred primitive interaction tests), this phase's core logic is pure
  and cheap to test, and it's the foundation every later phase builds on.

## Data model

```ts
type AssetType = "prompt" | "skill" | "tool" | "resource";
type SdlcStage = "discover" | "design" | "build" | "ship" | "operate";

interface BaseAsset {
  id: string;
  type: AssetType;
  title: string;
  description: string;
  category: string;
  roles: string[];
  sdlcStage: SdlcStage;
  favorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PromptAsset extends BaseAsset {
  type: "prompt";
  prompt: string;
  model: string;
  slots: Record<string, string>;
}

interface SkillAsset extends BaseAsset {
  type: "skill";
  body: string;
}

interface ToolAsset extends BaseAsset {
  type: "tool";
  url: string;
}

interface ResourceAsset extends BaseAsset {
  type: "resource";
  url: string;
  resourceType: "article" | "video" | "doc" | "other";
}

type Asset = PromptAsset | SkillAsset | ToolAsset | ResourceAsset;
```

## Context

- `specs/mission.md`: local-first, single-user asset catalog across four
  asset types; fast retrieval and rich metadata are core.
- `specs/tech-stack.md`: Svelte + TS + Vite; functional core (pure, typed,
  testable `lib/` modules) separate from components; suggested `types.ts` /
  `storage.ts` / `stores.ts` / `validation.ts` layout; BaseAsset v1 sketch
  used as a starting point, extended per the Decisions above.
- `specs/roadmap.md`: Phase 0 (scaffold) and Phase 1 (design system) are
  done. Phase 2 (this phase) = data model & core CRUD. Phases 3–7 build
  search, filtering, favorites, portability, and quality features on top of
  this data model without needing schema migrations, per the Decisions
  above.
- `specs/2026-07-05-phase-1-design-system/`: prior phase's spec docs, used
  as the structural template for this one, and the source of the `Button`,
  `Input`, `Textarea`, `Select`, `Checkbox`, `Card`, `Badge`, and `Modal`
  primitives this phase composes into `AssetCard`, `AssetList`, and
  `AssetForm`.

# Phase 2 — Data Model & Core CRUD · Validation

Phase 2 is **done and mergeable** when all of the following hold.

## Primary acceptance criteria

- [ ] `src/lib/types.ts` defines `AssetType`, `SdlcStage`, `BaseAsset`, and
      the four type-specific interfaces (`PromptAsset`, `SkillAsset`,
      `ToolAsset`, `ResourceAsset`) exactly per `requirements.md`'s data
      model.
- [ ] `src/lib/storage.ts` loads/saves the library from/to a single
      localStorage key, and falls back to an empty library on missing key,
      corrupt JSON, or malformed shape (never throws to the caller).
- [ ] `src/lib/stores.ts` exposes a `library` store plus `addAsset` /
      `updateAsset` / `deleteAsset`, each persisting to `storage.ts`.
- [ ] `addAsset` assigns `id` (via `crypto.randomUUID()`), `createdAt`,
      `updatedAt`, `favorite: false`, and the next `order` automatically —
      none of these are user-editable in the Phase 2 form.
- [ ] `src/lib/validation.ts` rejects a missing `title` for every type,
      a missing `prompt` for Prompt, a missing `body` for Skill, and a
      missing `url` for Tool/Resource.
- [ ] Assets render as cards via `AssetList`/`AssetCard`, sorted by
      `updatedAt` descending, with an empty-state message when the
      library has zero assets.
- [ ] `AssetForm` (in a `Modal`) creates and edits assets of all four
      types, showing only the fields relevant to the selected type, and
      surfaces validation errors inline without closing the modal.
- [ ] Deleting an asset requires confirming in a `Modal`; cancel/backdrop/
      `Escape` leaves the library unchanged.
- [ ] Data survives a full page reload (i.e. it round-trips through
      localStorage correctly).

## Accessibility checks

- [ ] `AssetForm`'s fields use the `Input`/`Textarea`/`Select`/`Checkbox`
      primitives (inheriting their label association and focus states) —
      no raw unlabeled form controls.
- [ ] Both the create/edit modal and the delete-confirmation modal trap
      focus, close on `Escape` and backdrop click, and expose
      `role="dialog"` + `aria-modal="true"` (inherited from `Modal`).
- [ ] Each `AssetCard`'s edit/delete controls are reachable and operable
      via keyboard (Tab + Enter/Space).

## Toolchain checks

- [ ] `npm run lint` (Biome) reports zero errors.
- [ ] `npm run format` (Biome) leaves the tree unchanged.
- [ ] `npm run check` (svelte-check + tsc) reports zero type errors.
- [ ] `npm run test` passes, including new tests for `storage.ts`,
      `validation.ts`, and `stores.ts`.
- [ ] `npm run build` and `npm run preview` succeed with no console errors.

## How to verify

```bash
npm install
npm run lint
npm run check
npm run test
npm run build
npm run dev
```

In the browser:

1. With an empty library, confirm the empty-state message and a visible
   "new asset" entry point.
2. Create one asset of each type (Prompt, Skill, Tool, Resource); confirm
   only the relevant per-type fields appear in the form for each.
3. Try submitting with a missing required field (e.g. blank title, blank
   Prompt text, blank Tool url); confirm inline errors block the save.
4. Edit an existing asset; confirm the form pre-fills correctly and the
   card reflects changes (and `updatedAt` moves it to the top of the list).
5. Delete an asset; confirm the confirmation modal appears, cancel leaves
   it intact, and confirming removes it.
6. Reload the page; confirm all remaining assets are still present with
   the same data.

## Explicitly not required this phase

- Full-text search, role/category filtering UI (Phases 3–4).
- Favorite toggle UI (Phase 5) — the `favorite` field exists with a fixed
  default, but no UI reads or mutates it yet beyond creation.
- Status-change UI, usage-count tracking, duplicate detection (Phase 7) —
  `status`, `usageCount`, and `lastUsedAt` don't exist in the Phase 2 type
  at all; Phase 7 adds them.
- Export/import/reset (Phase 6).
- Fillable-variable substitution or one-click copy for Prompts (Backlog) —
  `slots` stores name → value pairs this phase, but no template rendering
  or copy-with-values-filled UI.
- Manual drag-and-drop reordering UI — the `order` field exists but isn't
  surfaced or editable.

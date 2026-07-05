# Phase 2 — Data Model & Core CRUD · Plan

Numbered task groups. Complete in order; each group leaves the repo in a
working state.

## 1. Data model

1.1 Create `src/lib/types.ts` with `AssetType`, `SdlcStage` unions;
    `BaseAsset` interface; `PromptAsset`, `SkillAsset`, `ToolAsset`,
    `ResourceAsset` interfaces extending it; and an `Asset` discriminated
    union (see `requirements.md` for the exact shape).
1.2 Export small per-type helpers/guards as needed (e.g. `isPromptAsset`)
    for use in the form and card components.

## 2. Storage layer

2.1 Create `src/lib/storage.ts`: `loadLibrary(): Asset[]` and
    `saveLibrary(assets: Asset[]): void` against a single localStorage key
    (e.g. `"prompt-lib:assets"`).
2.2 Guard `loadLibrary` against missing key, invalid JSON, and
    non-array/malformed data — fall back to `[]` rather than throwing.
2.3 Guard `saveLibrary` against write failures (e.g. quota exceeded) —
    catch and surface a typed error without crashing the caller.
2.4 Unit tests: save/load round-trip, missing key, corrupt JSON, malformed
    shape all fall back safely.

## 3. Reactive store

3.1 Create `src/lib/stores.ts`: a writable Svelte store `library` seeded
    from `storage.loadLibrary()` on module init.
3.2 Persist to `storage.saveLibrary` on every mutation.
3.3 Implement `addAsset(input)`: generates `id` via `crypto.randomUUID()`,
    fills `createdAt`/`updatedAt` (now), `favorite: false`, and
    `order: max(existing order) + 1`.
3.4 Implement `updateAsset(id, patch)`: merges `patch`, bumps `updatedAt`.
3.5 Implement `deleteAsset(id)`: removes by id.
3.6 Unit tests: each action mutates `library` correctly and triggers a
    persisted save (mock/spy on `storage.ts`).

## 4. Validation

4.1 Create `src/lib/validation.ts`: `validateAsset(input): ValidationResult`
    (e.g. `{ valid: boolean; errors: Record<string, string> }`).
4.2 Required-field rules: `title` non-empty for all types; `prompt`
    non-empty for Prompt; `body` non-empty for Skill; `url` non-empty for
    Tool/Resource.
4.3 Unit tests: valid input for each type passes; missing `title` fails
    for all types; missing type-specific required field fails with the
    right error key.

## 5. Asset list UI

5.1 `src/components/AssetCard.svelte`: renders one asset on the `Card`
    primitive — title, description, type `Badge`, roles as `Badge`s, edit
    and delete actions.
5.2 `src/components/AssetList.svelte`: subscribes to the `library` store,
    renders assets sorted by `updatedAt` descending as `AssetCard`s, shows
    an empty-state message + "create your first asset" prompt when empty.
5.3 Wire `AssetList` into `App.svelte`, replacing placeholder content, with
    a "New asset" button in the list header.

## 6. Create/edit form

6.1 `src/components/AssetForm.svelte`: hosted inside the `Modal` primitive;
    shared fields (title, description, category, roles, sdlcStage via
    `Select`) plus a type `Select` that drives which per-type fields
    render (Prompt: `prompt`/`model` via `Textarea`/`Input`, plus a
    repeatable name/value pair editor for `slots`; Skill: body; Tool: url;
    Resource: url/resourceType).
6.2 On submit, call `validateAsset`; show inline field errors from the
    result and block save when invalid.
6.3 On valid submit, call `addAsset` (create mode) or `updateAsset` (edit
    mode) and close the modal.
6.4 Wire "New asset" (create mode, blank form) and each `AssetCard`'s edit
    action (edit mode, pre-filled form) to open `AssetForm`.

## 7. Delete flow

7.1 Confirm-delete `Modal` triggered from `AssetCard`'s delete action,
    showing the asset's title and a "this can't be undone" warning.
7.2 Confirming calls `deleteAsset(id)` and closes; cancel, backdrop click,
    or `Escape` closes without changes.

## 8. Verify & finalize

8.1 Manually create, edit, and delete one asset of each type; confirm
    per-type fields show/hide correctly in the form and that data survives
    a page reload (localStorage persistence).
8.2 Confirm the empty state renders correctly when the library is cleared.
8.3 Run `npm run build` and `npm run preview` — no console errors.
8.4 Run `npm run lint` and `npm run format` — clean.
8.5 Run `npm run test` — new `storage.ts`/`validation.ts`/`stores.ts` tests
    and existing tests all pass.
8.6 Run `npm run check` — no type errors.
8.7 Update `README.md` if the new CRUD flow needs a usage note.
8.8 Commit using Conventional Commits (e.g. `feat: add data model, storage,
    and core CRUD for assets`).

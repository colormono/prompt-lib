# Phase 4 — Portability: Requirements

## Scope

In scope:

- **Export** the whole library to a downloadable JSON file.
- **Import** a library from a JSON file, with a resolve/merge step for
  conflicts against the existing library.
- **Reset** the library to a small curated starter set.
- A new **Settings/Data panel** (modal or dedicated view) housing the three
  actions above.

Out of scope (future phases / backlog):

- Per-field merge (merging individual fields of a conflicting asset).
- Cloud sync, remote backup, or multi-device sync.
- Scheduled/automatic backups.
- Undo after a reset or import completes.

### Data shape

Export/import operate on the existing `Asset` union from `src/lib/types.ts`
(`PromptAsset | SkillAsset | ToolAsset | ResourceAsset`), unmodified. The
exported file is a JSON envelope, not a bare array, so future versions can
evolve without breaking old exports:

```ts
interface LibraryExport {
  version: 1;
  exportedAt: string; // ISO timestamp
  assets: Asset[];
}
```

## Decisions

- **Export** produces a single `.json` file download
  (`prompt-lib-export-YYYY-MM-DD.json`) containing the `LibraryExport`
  envelope above. Triggered via a Blob + `<a download>`, no server round-trip.
- **Import** reads a user-selected `.json` file, validates its shape
  (reusing/extending the existing `isAssetShape` guard style from
  `storage.ts`), and diffs against the current library **by `id`**:
  - No `id` collision → asset is added as new.
  - `id` collision → treated as a **conflict**. Conflicts are presented to
    the user in a review step; for each conflicting asset the user chooses
    **Keep mine**, **Keep imported**, or **Keep both** (imported copy gets a
    new `id` and `" (imported)"` appended to its title).
  - Invalid file / unparsable JSON / wrong shape → import is rejected with an
    inline error, library is left untouched (mirrors `loadLibrary`'s
    fail-safe philosophy, but surfaced to the user instead of silently
    swallowed, since this is a user-initiated action).
  - Nothing is written to storage until the user confirms the merge step.
- **Reset to starter library** replaces the entire library with a small
  curated set of sample assets — **one of each type** (prompt, skill, tool,
  resource) — showcasing realistic field values. Requires an explicit
  confirmation modal (same `Modal` + `Button variant="danger"` pattern as
  `ConfirmDeleteModal.svelte`) since it's destructive.
- **UI placement**: a new **Settings/Data panel**, opened from a button in
  the app header (next to existing controls), implemented as a `Modal`
  containing three sections: Export, Import, Reset. This keeps the primary
  toolbar uncluttered and matches the existing modal-driven interaction
  pattern (`AssetForm`, `ConfirmDeleteModal`).
- New pure logic lives in `src/lib/portability.ts` (export/import/merge
  functions), following the existing separation of pure `lib/` functions from
  Svelte components (`search.ts`, `validation.ts` are the precedent). Storage
  writes still go through the existing `library` store / `saveLibrary`, no
  new persistence primitives.

## Context

- Follow `specs/tech-stack.md`: Svelte + TypeScript + Vite, no new
  dependencies — file download uses native Blob/URL APIs, file upload uses a
  native `<input type="file">`, JSON parsing is native.
- Follow `specs/mission.md`'s "no lock-in" principle: export must always
  succeed and be a complete, faithful snapshot of the library.
- Match existing conventions: functional core (`portability.ts` pure and
  tested like `search.ts`), Svelte components thin, stores as the single
  read/write surface for `library`, Conventional Commits, typed
  errors/states (loading, error, success) surfaced in the UI rather than
  swallowed.
- Copy tone: match the app's existing plain, low-key microcopy (e.g.
  `ConfirmDeleteModal`'s "This can't be undone."). No exclamation marks, no
  marketing tone.
- Accessibility: reuse `Modal`'s existing focus-trap/labeling; file input and
  conflict-resolution controls need visible labels and keyboard operability,
  consistent with the "Accessible by default" principle in
  `tech-stack.md`.

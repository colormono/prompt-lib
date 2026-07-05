# Phase 4 — Portability: Plan

Numbered task groups, each independently implementable and testable.

## 1. Starter library data

1.1. Define a `STARTER_LIBRARY: Asset[]` constant (one prompt, one skill, one
tool, one resource) with realistic sample content, in
`src/lib/starterLibrary.ts`.

1.2. Each sample asset gets its own fixed `id`, sensible `category`/`roles`/
`sdlcStage`, `favorite: false`, `order` 0–3, and stable ISO timestamps.

## 2. Seed file for import testing

2.1. Add `fixtures/seed-library.json`, a hand-authored `LibraryExport`
envelope (`version`, `exportedAt`, `assets`) with a handful of realistic
sample assets across all four types — used to manually exercise the Import
flow end-to-end (this repo has no server, so it's a static file for local
use, not an app asset shipped to users).

2.2. Include at least one asset `id` that intentionally collides with a
`STARTER_LIBRARY` entry, so importing this file after a Reset exercises the
conflict-resolution UI (keep mine / keep imported / keep both) without
hand-editing JSON.

2.3. Reference this fixture from `validation.md`'s manual import scenarios
and, where useful, load it directly in `portability.test.ts` /
`ImportPanel` component tests instead of constructing import fixtures
inline.

## 3. Portability core (`src/lib/portability.ts`)

3.1. `interface LibraryExport { version: 1; exportedAt: string; assets: Asset[] }`.

3.2. `buildExport(assets: Asset[]): LibraryExport` — wraps the current
library with `version` and `exportedAt = new Date().toISOString()`.

3.3. `serializeExport(data: LibraryExport): string` — `JSON.stringify` with
2-space indent for human-readable files.

3.4. `parseImport(raw: string): LibraryExport | ImportError` (or a `Result`-style
return) — parses JSON, validates top-level shape (`version === 1`,
`assets` is an array), filters `assets` through an `isAssetShape`-style
guard (extend/reuse the one in `storage.ts` — export it if needed). Never
throws; returns a typed error on failure (`"invalid-json"` |
`"invalid-shape"`).

3.5. `interface ImportDiff { toAdd: Asset[]; conflicts: { incoming: Asset; existing: Asset }[] }`.

3.6. `diffImport(existing: Asset[], incoming: Asset[]): ImportDiff` — pure
function splitting incoming assets into non-conflicting (`toAdd`) and
`id`-colliding (`conflicts`) groups.

3.7. `type ConflictResolution = "keep-mine" | "keep-imported" | "keep-both"`.

3.8. `resolveImport(existing: Asset[], diff: ImportDiff, resolutions: Record<string, ConflictResolution>): Asset[]`
— pure function producing the final merged asset list given a per-conflict
resolution choice (matches on the incoming asset's `id`); `"keep-both"`
clones the incoming asset with a new `id` and `" (imported)"` suffix on
`title`.

3.9. Unit tests in `portability.test.ts` covering: build/serialize
round-trip, parse of valid/invalid/malformed JSON, diff with no conflicts,
diff with conflicts, resolve for each of the three resolutions, and
resolve with mixed resolutions across multiple conflicts. Use
`fixtures/seed-library.json` (group 2) as a real-world import fixture
alongside inline cases.

## 4. Store integration (`src/lib/stores.ts`)

4.1. `exportLibrary(): LibraryExport` — reads current `library` value via
`buildExport`.

4.2. `importLibrary(assets: Asset[]): void` — replaces `library` with the
fully-resolved asset list (single `library.set(...)` call, which persists
via the existing `saveLibrary` subscription).

4.3. `resetToStarterLibrary(): void` — `library.set(STARTER_LIBRARY)`.

4.4. Tests in `stores.test.ts` for all three new actions (mirroring existing
`addAsset`/`deleteAsset` test style).

## 5. Export UI

5.1. `ExportPanel.svelte` (or a section within the Settings modal): a
"Export library" button that calls `exportLibrary()`, serializes it, and
triggers a download via a Blob + temporary `<a download>` element named
`prompt-lib-export-YYYY-MM-DD.json`.

5.2. Disable/hide export (or show an inline note) when the library is empty,
matching existing empty-state conventions in `AssetList.svelte`.

## 6. Import UI

6.1. File picker (`<input type="file" accept="application/json">`) reads the
selected file via `FileReader`/`file.text()`.

6.2. On read, call `parseImport` then `diffImport` against the current
`library` value.

6.3. If there's a parse error, show an inline error message and stop (no
library mutation).

6.4. If there are no conflicts, show a short summary ("Import 5 new
assets?") with Confirm/Cancel, then call `importLibrary`.

6.5. If there are conflicts, render a per-conflict resolution UI (existing
vs incoming title/description side by side, radio group for keep
mine/imported/both) before enabling the final Confirm button; call
`resolveImport` then `importLibrary` on confirm.

6.6. Component: `ImportPanel.svelte`, composed of a smaller
`ImportConflictRow.svelte` for each conflicting pair. Use
`fixtures/seed-library.json` for manual smoke-testing during development.

## 7. Reset UI

7.1. `ResetLibraryModal.svelte` (or a section in the Settings modal) using
the existing `Modal` + `Button variant="danger"` pattern from
`ConfirmDeleteModal.svelte`: "Reset to starter library? This replaces your
current library and can't be undone."

7.2. On confirm, call `resetToStarterLibrary()` and close.

## 8. Settings/Data panel & entry point

8.1. `SettingsPanel.svelte`: a `Modal` with three sections (Export, Import,
Reset), composing the components from groups 5–7.

8.2. Add a "Data" / gear-icon `Button` to the app header (wherever
`FilterBar`/toolbar controls currently live) that opens `SettingsPanel`.

8.3. Wire open/close state the same way `AssetForm`/`ConfirmDeleteModal` are
wired from `App.svelte` today.

## 9. Tests & polish

9.1. Component-level tests (if the project has precedent for Svelte
component tests — check `App.test.ts`) for the conflict-resolution flow and
reset confirmation.

9.2. Full `npm run test` and typecheck pass.

9.3. Manual pass per `validation.md`.

# Phase 4 — Portability: Validation

## Automated

Run and confirm all pass before merging:

```bash
npm run test
npm run check
npm run lint
```

Specific assertions required in the new/updated test suites:

- `portability.test.ts`
  - `buildExport`/`serializeExport` round-trip: serializing then parsing
    yields back the same `assets`.
  - `parseImport` returns an error (not a throw) for malformed JSON, for
    valid JSON with the wrong top-level shape, and for an `assets` array
    containing non-asset entries (which are filtered, not rejected wholesale
    — mirrors `storage.ts`'s `isAssetShape` filtering behavior).
  - `diffImport` correctly splits assets with colliding `id`s into
    `conflicts` and the rest into `toAdd`, including the zero-conflict case.
  - `resolveImport` produces correct output for each `ConflictResolution`
    variant, and for a mix of resolutions across multiple simultaneous
    conflicts (`keep-mine` leaves existing asset untouched, `keep-imported`
    replaces it, `keep-both` adds a new asset with a new `id` and
    `" (imported)"` title suffix without touching the existing one).
- `stores.test.ts`
  - `exportLibrary()` reflects the current `library` value.
  - `importLibrary()` persists the merged result (round-trips through
    `saveLibrary`/`loadLibrary`).
  - `resetToStarterLibrary()` replaces the library with exactly
    `STARTER_LIBRARY` and persists it.
- Component tests (`App.test.ts` or a new `SettingsPanel.test.ts`, following
  the existing `@testing-library/svelte` pattern):
  - Opening the Settings panel and clicking Export does not throw (download
    trigger can be asserted via a mocked anchor click / Blob URL creation).
  - Importing a file with only new assets shows a confirmation summary and,
    on confirm, adds them to the visible list.
  - Importing a file with a conflicting `id` renders the conflict resolution
    UI, and each resolution path (keep mine / keep imported / keep both)
    produces the expected visible outcome.
  - Reset requires confirmation (cancel leaves the library untouched;
    confirm replaces it with the starter set).

## Manual

- Export the current library, inspect the downloaded file: valid JSON,
  correct filename pattern, `version`/`exportedAt`/`assets` all present.
- Re-import that same exported file into the same library: since every `id`
  collides, all assets should surface as conflicts; resolving all as "keep
  mine" leaves the library visibly unchanged.
- Import `fixtures/seed-library.json` (mix of new assets and at least one
  `id` colliding with a `STARTER_LIBRARY` entry): confirm new ones are added
  silently and the colliding one requires a choice before the Confirm
  button is enabled.
- Attempt to import a non-JSON file and a JSON file with the wrong shape
  (e.g. `{"foo": "bar"}`): both should show an inline error and leave the
  library untouched.
- Reset to starter library from a populated library: confirm the modal's
  warning text, cancel it (library unchanged), then confirm it (library
  replaced with exactly one prompt, one skill, one tool, one resource).
- Keyboard-only pass: open Settings via keyboard, tab through Export/Import/
  Reset controls and the conflict-resolution radio group, confirm focus is
  trapped in the modal and visible at every step (per the "Accessible by
  default" principle).
- Empty-library check: with zero assets, Export is disabled or clearly
  no-ops instead of downloading an empty/confusing file; Reset still works.

## Tone check

- All new copy (button labels, confirmation text, error messages) matches
  the app's existing plain, low-key microcopy style (e.g. `ConfirmDeleteModal`'s
  "This can't be undone."). No exclamation marks, no marketing language.

## Definition of done

- All automated checks above pass (`test`, `check`, `lint`).
- All manual scenarios above behave as described.
- `specs/roadmap.md` Phase 4 items are checked off / marked done.
- Changes are committed following Conventional Commits.

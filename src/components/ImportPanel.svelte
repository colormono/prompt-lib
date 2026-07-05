<script lang="ts">
  import {
    type ConflictResolution,
    diffImport,
    type ImportDiff,
    parseImport,
    resolveImport,
  } from "../lib/portability";
  import { importLibrary, library } from "../lib/stores";
  import ImportConflictRow from "./ImportConflictRow.svelte";
  import Button from "./ui/Button.svelte";

  let fileInputEl: HTMLInputElement | undefined = $state();
  let error = $state<string | undefined>(undefined);
  let diff = $state<ImportDiff | undefined>(undefined);
  let resolutions = $state<Record<string, ConflictResolution>>({});
  let imported = $state(false);

  const allConflictsResolved = $derived(
    diff?.conflicts.every((conflict) => resolutions[conflict.incoming.id]),
  );

  const hasNothingToImport = $derived(
    diff !== undefined && diff.toAdd.length === 0 && diff.conflicts.length === 0,
  );

  function reset() {
    error = undefined;
    diff = undefined;
    resolutions = {};
    imported = false;
    if (fileInputEl) fileInputEl.value = "";
  }

  function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    imported = false;

    let raw: string;
    try {
      raw = await readFileAsText(file);
    } catch {
      error = "Couldn't read that file.";
      diff = undefined;
      return;
    }

    const parsed = parseImport(raw);

    if (parsed === "invalid-json") {
      error = "That file isn't valid JSON.";
      diff = undefined;
      return;
    }
    if (parsed === "invalid-shape") {
      error = "That file doesn't look like a library export.";
      diff = undefined;
      return;
    }

    error = undefined;
    diff = diffImport($library, parsed.assets);
    resolutions = {};
  }

  function handleConfirm() {
    if (!diff) return;
    importLibrary(resolveImport($library, diff, resolutions));
    imported = true;
    diff = undefined;
    resolutions = {};
    if (fileInputEl) fileInputEl.value = "";
  }

  function handleCancel() {
    reset();
  }
</script>

<section class="import-panel">
  <h3>Import</h3>
  <p class="import-panel__description">
    Choose a previously exported JSON file. Nothing changes until you confirm.
  </p>

  <div class="import-panel__field">
    <label class="import-panel__label" for="import-file">Library file</label>
    <input
      bind:this={fileInputEl}
      id="import-file"
      type="file"
      accept="application/json"
      onchange={handleFileChange}
    />
  </div>

  {#if error}
    <p class="import-panel__error" role="alert">{error}</p>
  {/if}

  {#if imported}
    <p class="import-panel__success" role="status">Import complete.</p>
  {/if}

  {#if diff}
    {#if hasNothingToImport}
      <p class="import-panel__note">
        No new or changed assets found in that file.
      </p>
      <Button variant="ghost" onclick={handleCancel}>Close</Button>
    {:else}
      {#if diff.toAdd.length > 0}
        <p class="import-panel__summary">
          {diff.toAdd.length} new asset{diff.toAdd.length === 1 ? "" : "s"} will
          be added.
        </p>
      {/if}

      {#if diff.conflicts.length > 0}
        <div class="import-panel__conflicts">
          <p class="import-panel__summary">
            {diff.conflicts.length} asset{diff.conflicts.length === 1
              ? ""
              : "s"} already exist{diff.conflicts.length === 1 ? "s" : ""} —
            choose what to keep for each:
          </p>
          {#each diff.conflicts as conflict (conflict.incoming.id)}
            <ImportConflictRow
              {conflict}
              bind:resolution={resolutions[conflict.incoming.id]}
            />
          {/each}
        </div>
      {/if}

      <div class="import-panel__actions">
        <Button variant="ghost" onclick={handleCancel}>Cancel</Button>
        <Button onclick={handleConfirm} disabled={!allConflictsResolved}>
          Confirm import
        </Button>
      </div>
    {/if}
  {/if}
</section>

<style>
  .import-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .import-panel h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
  }

  .import-panel__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .import-panel__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .import-panel__label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .import-panel__error {
    font-size: var(--font-size-sm);
    color: var(--color-danger);
  }

  .import-panel__success {
    font-size: var(--font-size-sm);
    color: var(--color-success);
  }

  .import-panel__note {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .import-panel__summary {
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }

  .import-panel__conflicts {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .import-panel__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }
</style>

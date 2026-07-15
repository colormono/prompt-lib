<script lang="ts">
  import { serializeExport } from "../lib/portability";
  import { exportLibrary, library } from "../lib/stores";
  import Button from "./ui/Button.svelte";

  const libraryIsEmpty = $derived($library.length === 0);

  function exportFilename(): string {
    const date = new Date().toISOString().slice(0, 10);
    return `prompt-lib-export-${date}.json`;
  }

  function handleExport() {
    const data = serializeExport(exportLibrary());
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = exportFilename();
    link.click();

    URL.revokeObjectURL(url);
  }
</script>

<section class="export-panel">
  <h3>Export</h3>
  <p class="export-panel__description">
    Download the whole library as a JSON file you can back up or import
    elsewhere.
  </p>
  {#if libraryIsEmpty}
    <p class="export-panel__note">Your library is empty — nothing to export.</p>
  {:else}
    <Button onclick={handleExport}>Export library</Button>
  {/if}
</section>

<style>
  .export-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .export-panel h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-title);
  }

  .export-panel__description {
    max-width: 48ch;
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    color: var(--color-text-secondary);
  }

  .export-panel__note {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>

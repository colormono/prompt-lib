<script lang="ts">
  import ExportPanel from "./ExportPanel.svelte";
  import ImportPanel from "./ImportPanel.svelte";
  import ResetLibraryModal from "./ResetLibraryModal.svelte";
  import Button from "./ui/Button.svelte";
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  let resetOpen = $state(false);
</script>

<Modal bind:open title="Data">
  <div class="settings-panel">
    <ExportPanel />
    <hr class="settings-panel__divider" />
    <ImportPanel />
    <hr class="settings-panel__divider" />
    <section class="settings-panel__section">
      <h3>Reset</h3>
      <p class="settings-panel__description">
        Replace your library with a small starter set.
      </p>
      <Button variant="danger" onclick={() => (resetOpen = true)}>
        Reset to starter library
      </Button>
    </section>
  </div>
</Modal>

<ResetLibraryModal bind:open={resetOpen} />

<style>
  .settings-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .settings-panel__divider {
    border: none;
    border-top: 1px solid var(--color-border);
  }

  .settings-panel__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .settings-panel__section h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
  }

  .settings-panel__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>

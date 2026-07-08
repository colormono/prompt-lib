<script lang="ts">
  import { resetToStarterLibrary } from "../lib/stores";
  import ExportPanel from "./ExportPanel.svelte";
  import ImportPanel from "./ImportPanel.svelte";
  import Button from "./ui/Button.svelte";
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
    onResetComplete?: () => void;
  }

  let { open = $bindable(false), onResetComplete }: Props = $props();

  // Reset confirmation replaces this modal's content in place rather than
  // stacking a second modal, so there's only ever one dialog and one
  // keydown/focus-trap handler active at a time (see Modal.svelte).
  let confirmingReset = $state(false);

  function handleResetCancel() {
    confirmingReset = false;
  }

  function handleResetConfirm() {
    resetToStarterLibrary();
    confirmingReset = false;
    open = false;
    onResetComplete?.();
  }
</script>

{#snippet resetFooter()}
  <Button variant="ghost" onclick={handleResetCancel}>Cancel</Button>
  <Button variant="danger" onclick={handleResetConfirm}>Reset library</Button>
{/snippet}

<Modal
  bind:open
  title={confirmingReset ? "Reset to starter library?" : "Data"}
  onclose={() => (confirmingReset = false)}
  footer={confirmingReset ? resetFooter : undefined}
>
  {#if confirmingReset}
    <p>
      This replaces your current library with a small starter set. This
      can't be undone.
    </p>
  {:else}
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
        <Button variant="danger" onclick={() => (confirmingReset = true)}>
          Reset to starter library
        </Button>
      </section>
    </div>
  {/if}
</Modal>

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

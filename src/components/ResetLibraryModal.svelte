<script lang="ts">
  import { resetToStarterLibrary } from "../lib/stores";
  import Button from "./ui/Button.svelte";
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  function handleCancel() {
    open = false;
  }

  function handleConfirm() {
    resetToStarterLibrary();
    open = false;
  }
</script>

<Modal bind:open title="Reset to starter library?">
  <p>
    This replaces your current library with a small starter set. This can't
    be undone.
  </p>
  {#snippet footer()}
    <Button variant="ghost" onclick={handleCancel}>Cancel</Button>
    <Button variant="danger" onclick={handleConfirm}>Reset library</Button>
  {/snippet}
</Modal>

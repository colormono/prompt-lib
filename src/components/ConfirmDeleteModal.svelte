<script lang="ts">
  import type { Asset } from "../lib/types";
  import Button from "./ui/Button.svelte";
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
    asset?: Asset;
    onConfirm: (asset: Asset) => void;
  }

  let { open = $bindable(false), asset, onConfirm }: Props = $props();

  function handleCancel() {
    open = false;
  }

  function handleConfirm() {
    if (!asset) return;
    onConfirm(asset);
    open = false;
  }
</script>

<Modal bind:open title="Delete asset?">
  <p>
    Delete <strong>{asset?.title}</strong>? This can't be undone.
  </p>
  {#snippet footer()}
    <Button variant="ghost" onclick={handleCancel}>Cancel</Button>
    <Button variant="danger" onclick={handleConfirm}>Delete</Button>
  {/snippet}
</Modal>

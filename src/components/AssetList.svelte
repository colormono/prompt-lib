<script lang="ts">
  import { clearFilters, library, visibleAssets } from "../lib/stores";
  import type { Asset } from "../lib/types";
  import AssetCard from "./AssetCard.svelte";
  import FilterBar from "./FilterBar.svelte";
  import Button from "./ui/Button.svelte";

  interface Props {
    onCreate: () => void;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
  }

  let { onCreate, onEdit, onDelete }: Props = $props();

  let assets = $derived(
    [...$visibleAssets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
  const libraryIsEmpty = $derived($library.length === 0);
</script>

<section class="asset-list">
  <div class="asset-list__header">
    <h2>Library</h2>
    <Button onclick={onCreate}>New asset</Button>
  </div>

  {#if !libraryIsEmpty}
    <FilterBar />
  {/if}

  {#if libraryIsEmpty}
    <div class="asset-list__empty">
      <p>Your library is empty.</p>
      <Button onclick={onCreate}>Create your first asset</Button>
    </div>
  {:else if assets.length === 0}
    <div class="asset-list__empty">
      <p>No assets match your filters.</p>
      <Button variant="secondary" onclick={clearFilters}>
        Clear filters
      </Button>
    </div>
  {:else}
    <div class="asset-list__grid">
      {#each assets as asset (asset.id)}
        <AssetCard {asset} {onEdit} {onDelete} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .asset-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    width: 100%;
    max-width: 72rem;
    margin: 0 auto;
    padding: var(--space-6) var(--space-4);
  }

  .asset-list__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .asset-list__header h2 {
    font-size: var(--font-size-xl);
  }

  .asset-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-16) var(--space-4);
    border: 1px dashed var(--color-border-strong);
    border-radius: var(--radius-lg);
    color: var(--color-text-muted);
  }

  .asset-list__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    gap: var(--space-4);
  }
</style>

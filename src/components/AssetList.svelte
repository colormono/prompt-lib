<script lang="ts">
  import { clearFilters, library, viewMode, visibleAssets } from "../lib/stores";
  import type { Asset } from "../lib/types";
  import AssetCard from "./AssetCard.svelte";
  import FilterBar from "./FilterBar.svelte";
  import Button from "./ui/Button.svelte";

  interface Props {
    onCreate: () => void;
    onEdit: (asset: Asset) => void;
  }

  let { onCreate, onEdit }: Props = $props();

  let assets = $derived(
    [...$visibleAssets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
  const libraryIsEmpty = $derived($library.length === 0);
  const currentViewMode = $derived($viewMode);
</script>

<section class="asset-list" aria-labelledby="asset-list-heading">
  <h2 id="asset-list-heading" class="sr-only">Library</h2>
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
    <div class="asset-list__{currentViewMode}">
      {#each assets as asset (asset.id)}
        <AssetCard {asset} {onEdit} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .asset-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--space-3);
    width: 100%;
    max-width: 81.25rem;
    margin: 0 auto;
    padding: var(--space-4) var(--space-6);
  }

  .asset-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: var(--space-3);
    min-height: 12rem;
    padding: var(--space-12) var(--space-4);
    border: 1px dashed var(--color-border-strong);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    text-align: center;
  }

  .asset-list__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: var(--space-2);
  }

  .asset-list__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
</style>

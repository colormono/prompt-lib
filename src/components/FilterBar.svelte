<script lang="ts">
  import {
    activeCategory,
    activeRole,
    activeType,
    availableCategories,
    availableRoles,
    clearFilters,
    favoritesOnly,
    searchQuery,
    setActiveCategory,
    setActiveRole,
    setActiveType,
    setFavoritesOnly,
    setSearchQuery,
    typeCounts,
  } from "../lib/stores";
  import type { AssetType } from "../lib/types";
  import { ASSET_TYPES, formatTaxonomyLabel } from "../lib/types";
  import Button from "./ui/Button.svelte";
  import Checkbox from "./ui/Checkbox.svelte";
  import Input from "./ui/Input.svelte";

  const SEARCH_DEBOUNCE_MS = 250;

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  let queryText = $state($searchQuery);
  let debounceHandle: ReturnType<typeof setTimeout> | undefined;

  function handleQueryInput() {
    clearTimeout(debounceHandle);
    debounceHandle = setTimeout(() => {
      setSearchQuery(queryText);
    }, SEARCH_DEBOUNCE_MS);
  }

  const hasActiveFilters = $derived(
    $searchQuery !== "" ||
      $activeType !== null ||
      $activeRole !== null ||
      $activeCategory !== null ||
      $favoritesOnly,
  );

  const roles = $derived($availableRoles);
  const categories = $derived($availableCategories);
  const counts = $derived($typeCounts);
  const totalCount = $derived(
    Object.values(counts).reduce((sum, count) => sum + count, 0),
  );

  function handleClear() {
    queryText = "";
    clearFilters();
  }

  function handleTypeClick(type: AssetType | null) {
    setActiveType($activeType === type ? null : type);
  }
</script>

<div class="filter-bar">
  <div class="filter-bar__row">
    <div class="filter-bar__search">
      <Input
        label="Search"
        placeholder="Search title, description, roles, model…"
        type="search"
        bind:value={queryText}
        oninput={handleQueryInput}
      />
    </div>
    <Checkbox
      label="Favorites only"
      checked={$favoritesOnly}
      onchange={(event: Event) =>
        setFavoritesOnly((event.target as HTMLInputElement).checked)}
    />
    {#if hasActiveFilters}
      <Button variant="ghost" size="sm" onclick={handleClear}>Clear</Button>
    {/if}
  </div>

  <div class="filter-bar__chips">
    <Button
      variant={$activeType === null ? "primary" : "secondary"}
      size="sm"
      aria-pressed={$activeType === null}
      onclick={() => handleTypeClick(null)}
    >
      All ({totalCount})
    </Button>
    {#each ASSET_TYPES as type (type)}
      <Button
        variant={$activeType === type ? "primary" : "secondary"}
        size="sm"
        aria-pressed={$activeType === type}
        onclick={() => handleTypeClick(type)}
      >
        {capitalize(type)} ({counts[type]})
      </Button>
    {/each}
  </div>

  {#if categories.length > 0}
    <fieldset class="filter-bar__chips">
      <legend class="sr-only">Category</legend>
      {#each categories as category (category)}
        <Button
          variant={$activeCategory === category ? "primary" : "secondary"}
          size="sm"
          aria-pressed={$activeCategory === category}
          onclick={() => setActiveCategory(category)}
        >
          {formatTaxonomyLabel(category)}
        </Button>
      {/each}
    </fieldset>
  {/if}

  {#if roles.length > 0}
    <fieldset class="filter-bar__chips">
      <legend class="sr-only">Role</legend>
      {#each roles as role (role)}
        <Button
          variant={$activeRole === role ? "primary" : "secondary"}
          size="sm"
          aria-pressed={$activeRole === role}
          onclick={() => setActiveRole(role)}
        >
          {formatTaxonomyLabel(role)}
        </Button>
      {/each}
    </fieldset>
  {/if}
</div>

<style>
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
  }

  .filter-bar__row {
    display: flex;
    align-items: flex-end;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .filter-bar__search {
    flex: 1;
    min-width: 14rem;
  }

  .filter-bar__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin: 0;
    padding: 0;
    border: none;
  }
</style>

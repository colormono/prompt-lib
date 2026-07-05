<script lang="ts">
  import {
    activeCategories,
    activeRoles,
    activeType,
    availableCategories,
    availableRoles,
    clearFilters,
    favoritesOnly,
    searchQuery,
    setActiveType,
    setFavoritesOnly,
    setSearchQuery,
    toggleActiveCategory,
    toggleActiveRole,
    typeCounts,
  } from "../lib/stores";
  import type { AssetType } from "../lib/types";
  import { ASSET_TYPES } from "../lib/types";
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
      $activeRoles.length > 0 ||
      $activeCategories.length > 0 ||
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
  </div>

  <div class="filter-bar__group">
    <span class="filter-bar__group-label">Type</span>
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
  </div>

  {#if roles.length > 0}
    <div class="filter-bar__group">
      <span class="filter-bar__group-label">Roles</span>
      <div class="filter-bar__chips">
        {#each roles as role (role)}
          <Button
            variant={$activeRoles.includes(role) ? "primary" : "secondary"}
            size="sm"
            aria-pressed={$activeRoles.includes(role)}
            onclick={() => toggleActiveRole(role)}
          >
            {role}
          </Button>
        {/each}
      </div>
    </div>
  {/if}

  {#if categories.length > 0}
    <div class="filter-bar__group">
      <span class="filter-bar__group-label">Category</span>
      <div class="filter-bar__chips">
        {#each categories as category (category)}
          <Button
            variant={$activeCategories.includes(category)
              ? "primary"
              : "secondary"}
            size="sm"
            aria-pressed={$activeCategories.includes(category)}
            onclick={() => toggleActiveCategory(category)}
          >
            {category}
          </Button>
        {/each}
      </div>
    </div>
  {/if}

  {#if hasActiveFilters}
    <Button variant="ghost" size="sm" onclick={handleClear}>
      Clear filters
    </Button>
  {/if}
</div>

<style>
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
  }

  .filter-bar__row {
    display: flex;
    align-items: flex-end;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .filter-bar__search {
    flex: 1;
    min-width: 16rem;
  }

  .filter-bar__group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .filter-bar__group-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .filter-bar__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }
</style>

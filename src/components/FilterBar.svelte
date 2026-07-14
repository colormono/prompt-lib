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
  import Input from "./ui/Input.svelte";

  const SEARCH_DEBOUNCE_MS = 250;

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  let queryText = $state($searchQuery);
  let debounceHandle: ReturnType<typeof setTimeout> | undefined;

  // Keep the field in sync when filters are cleared from elsewhere.
  $effect(() => {
    queryText = $searchQuery;
  });

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

  function toggleFavorites() {
    setFavoritesOnly(!$favoritesOnly);
  }
</script>

<div class="filter-bar">
  <div class="filter-bar__toolbar">
    <div class="filter-bar__search">
      <Input
        label="Search"
        hideLabel
        placeholder="Search title, description, roles, model…"
        type="search"
        bind:value={queryText}
        oninput={handleQueryInput}
      />
    </div>

    <div class="filter-bar__controls">
      <button
        type="button"
        class="filter-bar__fav"
        class:filter-bar__fav--on={$favoritesOnly}
        aria-pressed={$favoritesOnly}
        aria-label="Favorites only"
        title="Favorites only"
        onclick={toggleFavorites}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2.5 9.8 6.1l3.9.6-2.8 2.8.7 3.9L8 11.4 4.4 13.4l.7-3.9L2.3 6.7l3.9-.6L8 2.5Z"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linejoin="round"
            fill={$favoritesOnly ? "currentColor" : "none"}
          />
        </svg>
        <span class="filter-bar__fav-label">Favorites</span>
      </button>

      <button
        type="button"
        class="filter-bar__clear"
        class:filter-bar__clear--idle={!hasActiveFilters}
        disabled={!hasActiveFilters}
        aria-hidden={!hasActiveFilters}
        tabindex={hasActiveFilters ? 0 : -1}
        onclick={handleClear}
      >
        Clear
      </button>
    </div>
  </div>

  <div class="filter-bar__chips" role="group" aria-label="Asset type">
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
    gap: var(--space-3);
    padding-block: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .filter-bar__toolbar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-bar__search {
    flex: 1;
    min-width: 0;
  }

  .filter-bar__search :global(.field) {
    gap: 0;
  }

  .filter-bar__search :global(.field__control) {
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface);
    border-color: var(--color-border);
    font-size: var(--font-size-base);
  }

  .filter-bar__search :global(.field__control:focus) {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
  }

  .filter-bar__controls {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--space-1);
  }

  .filter-bar__fav {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: 2.25rem;
    padding: 0 var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    white-space: nowrap;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .filter-bar__fav:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }

  .filter-bar__fav--on {
    color: var(--color-accent);
    border-color: color-mix(in srgb, var(--color-ember) 35%, transparent);
    background-color: var(--color-accent-subtle);
  }

  .filter-bar__fav-label {
    font-family: var(--font-family-base);
  }

  .filter-bar__clear {
    min-width: 3.5rem;
    min-height: 2.25rem;
    padding: 0 var(--space-2);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    text-decoration: underline;
    text-underline-offset: 0.15em;
    transition: opacity var(--transition-fast), color var(--transition-fast);
  }

  .filter-bar__clear:hover:not(:disabled) {
    color: var(--color-text);
  }

  /* Reserve width so Clear never shoves the toolbar when filters activate. */
  .filter-bar__clear--idle {
    opacity: 0;
    pointer-events: none;
  }

  .filter-bar__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin: 0;
    padding: 0;
    border: none;
  }

  @media (max-width: 40rem) {
    .filter-bar__toolbar {
      flex-wrap: wrap;
    }

    .filter-bar__search {
      flex-basis: 100%;
    }

    .filter-bar__fav-label {
      display: none;
    }
  }
</style>

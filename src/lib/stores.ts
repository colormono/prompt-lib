import { derived, get, writable } from "svelte/store";
import type { LibraryExport } from "./portability";
import { buildExport } from "./portability";
import {
  countByType,
  distinctCategories,
  distinctRoles,
  EMPTY_FILTERS,
  filterAssets,
} from "./search";
import { STARTER_LIBRARY } from "./starterLibrary";
import { loadLibrary, saveLibrary } from "./storage";
import type { Asset, AssetDraft, AssetType } from "./types";

export const library = writable<Asset[]>(loadLibrary());

library.subscribe((assets) => {
  saveLibrary(assets);
});

function nextOrder(assets: Asset[]): number {
  return assets.reduce((max, asset) => Math.max(max, asset.order), -1) + 1;
}

/** Creates an asset from a form draft, assigning `id`, timestamps, `favorite`, and `order`. */
export function addAsset(draft: AssetDraft): Asset {
  const now = new Date().toISOString();
  const asset = {
    ...draft,
    id: crypto.randomUUID(),
    favorite: false,
    order: nextOrder(get(library)),
    createdAt: now,
    updatedAt: now,
  } as Asset;

  library.update((assets) => [...assets, asset]);
  return asset;
}

/** Replaces an existing asset's editable fields with a new draft, bumping `updatedAt`. */
export function updateAsset(id: string, draft: AssetDraft): void {
  const now = new Date().toISOString();
  library.update((assets) =>
    assets.map((asset) =>
      asset.id === id
        ? ({ ...asset, ...draft, updatedAt: now } as Asset)
        : asset,
    ),
  );
}

export function deleteAsset(id: string): void {
  library.update((assets) => assets.filter((asset) => asset.id !== id));
}

/** Toggles `favorite` on an asset, bumping `updatedAt`. */
export function toggleFavorite(id: string): void {
  const now = new Date().toISOString();
  library.update((assets) =>
    assets.map((asset) =>
      asset.id === id
        ? { ...asset, favorite: !asset.favorite, updatedAt: now }
        : asset,
    ),
  );
}

/** Snapshots the current library as a `LibraryExport` envelope. */
export function exportLibrary(): LibraryExport {
  return buildExport(get(library));
}

/** Replaces the library with the fully-resolved result of an import. */
export function importLibrary(assets: Asset[]): void {
  library.set(assets);
}

/** Replaces the library with the curated starter set. */
export function resetToStarterLibrary(): void {
  library.set(STARTER_LIBRARY);
}

export const searchQuery = writable<string>(EMPTY_FILTERS.query);
export const activeType = writable<AssetType | null>(EMPTY_FILTERS.type);
export const activeRoles = writable<string[]>(EMPTY_FILTERS.roles);
export const activeCategories = writable<string[]>(EMPTY_FILTERS.categories);
export const favoritesOnly = writable<boolean>(EMPTY_FILTERS.favoritesOnly);

/** The library narrowed by every active filter, combined with AND. */
export const visibleAssets = derived(
  [
    library,
    searchQuery,
    activeType,
    activeRoles,
    activeCategories,
    favoritesOnly,
  ],
  ([
    $library,
    $searchQuery,
    $activeType,
    $activeRoles,
    $activeCategories,
    $favoritesOnly,
  ]) =>
    filterAssets($library, {
      query: $searchQuery,
      type: $activeType,
      roles: $activeRoles,
      categories: $activeCategories,
      favoritesOnly: $favoritesOnly,
    }),
);

/**
 * Per-type counts for the type filter, computed with every filter except
 * the type filter itself so counts stay meaningful while switching types.
 */
export const typeCounts = derived(
  [library, searchQuery, activeRoles, activeCategories, favoritesOnly],
  ([$library, $searchQuery, $activeRoles, $activeCategories, $favoritesOnly]) =>
    countByType(
      filterAssets($library, {
        query: $searchQuery,
        type: null,
        roles: $activeRoles,
        categories: $activeCategories,
        favoritesOnly: $favoritesOnly,
      }),
    ),
);

export function setSearchQuery(query: string): void {
  searchQuery.set(query);
}

export function setActiveType(type: AssetType | null): void {
  activeType.set(type);
}

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function toggleActiveRole(role: string): void {
  activeRoles.update((roles) => toggleInList(roles, role));
}

export function toggleActiveCategory(category: string): void {
  activeCategories.update((categories) => toggleInList(categories, category));
}

export function setFavoritesOnly(value: boolean): void {
  favoritesOnly.set(value);
}

/** All distinct roles/categories in the library, for the filter chip lists. */
export const availableRoles = derived(library, ($library) =>
  distinctRoles($library),
);
export const availableCategories = derived(library, ($library) =>
  distinctCategories($library),
);

export function clearFilters(): void {
  searchQuery.set(EMPTY_FILTERS.query);
  activeType.set(EMPTY_FILTERS.type);
  activeRoles.set(EMPTY_FILTERS.roles);
  activeCategories.set(EMPTY_FILTERS.categories);
  favoritesOnly.set(EMPTY_FILTERS.favoritesOnly);
}

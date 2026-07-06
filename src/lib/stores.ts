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
import type { Theme } from "./theme";
import { getInitialTheme, setTheme } from "./theme";
import type { Asset, AssetDraft, AssetType, Category, Role } from "./types";
import type { ViewMode } from "./viewMode";
import { getInitialViewMode, setViewMode as persistViewMode } from "./viewMode";

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
export const activeRole = writable<Role | null>(EMPTY_FILTERS.role);
export const activeCategory = writable<Category | null>(EMPTY_FILTERS.category);
export const favoritesOnly = writable<boolean>(EMPTY_FILTERS.favoritesOnly);

/** The library narrowed by every active filter, combined with AND. */
export const visibleAssets = derived(
  [library, searchQuery, activeType, activeRole, activeCategory, favoritesOnly],
  ([
    $library,
    $searchQuery,
    $activeType,
    $activeRole,
    $activeCategory,
    $favoritesOnly,
  ]) =>
    filterAssets($library, {
      query: $searchQuery,
      type: $activeType,
      role: $activeRole,
      category: $activeCategory,
      favoritesOnly: $favoritesOnly,
    }),
);

/**
 * Per-type counts for the type filter, computed with every filter except
 * the type filter itself so counts stay meaningful while switching types.
 */
export const typeCounts = derived(
  [library, searchQuery, activeRole, activeCategory, favoritesOnly],
  ([$library, $searchQuery, $activeRole, $activeCategory, $favoritesOnly]) =>
    countByType(
      filterAssets($library, {
        query: $searchQuery,
        type: null,
        role: $activeRole,
        category: $activeCategory,
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

/** Single-select: choosing the already-active role clears the filter. */
export function setActiveRole(role: Role): void {
  activeRole.update((current) => (current === role ? null : role));
}

/** Single-select: choosing the already-active category clears the filter. */
export function setActiveCategory(category: Category): void {
  activeCategory.update((current) => (current === category ? null : category));
}

export function setFavoritesOnly(value: boolean): void {
  favoritesOnly.set(value);
}

/** All roles/categories used in the library, for the filter chip lists. */
export const availableRoles = derived(library, ($library) =>
  distinctRoles($library),
);
export const availableCategories = derived(library, ($library) =>
  distinctCategories($library),
);

export function clearFilters(): void {
  searchQuery.set(EMPTY_FILTERS.query);
  activeType.set(EMPTY_FILTERS.type);
  activeRole.set(EMPTY_FILTERS.role);
  activeCategory.set(EMPTY_FILTERS.category);
  favoritesOnly.set(EMPTY_FILTERS.favoritesOnly);
}

export const theme = writable<Theme>(getInitialTheme());

theme.subscribe((value) => {
  setTheme(value);
});

export function toggleTheme(): void {
  theme.update((current) => (current === "light" ? "dark" : "light"));
}

export const viewMode = writable<ViewMode>(getInitialViewMode());

viewMode.subscribe((value) => {
  persistViewMode(value);
});

export function setViewMode(mode: ViewMode): void {
  viewMode.set(mode);
}

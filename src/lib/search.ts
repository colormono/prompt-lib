import type { Asset, AssetType } from "./types";

export interface AssetFilters {
  query: string;
  type: AssetType | null;
  roles: string[];
  categories: string[];
  favoritesOnly: boolean;
}

export const EMPTY_FILTERS: AssetFilters = {
  query: "",
  type: null,
  roles: [],
  categories: [],
  favoritesOnly: false,
};

/** Type-specific searchable text: prompt body, skill instructions, model, URL. */
function typeSpecificText(asset: Asset): string[] {
  switch (asset.type) {
    case "prompt":
      return [asset.prompt, asset.model];
    case "skill":
      return [asset.body];
    case "tool":
    case "resource":
      return [asset.url];
  }
}

/** Lowercased, space-joined text blob used for substring search. */
export function searchableText(asset: Asset): string {
  return [
    asset.title,
    asset.description,
    asset.category,
    ...asset.roles,
    ...typeSpecificText(asset),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(asset: Asset, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") return true;
  return searchableText(asset).includes(normalized);
}

export function matchesType(asset: Asset, type: AssetType | null): boolean {
  if (type === null) return true;
  return asset.type === type;
}

/** AND semantics — the asset must have every role in `roles`. */
export function matchesRoles(asset: Asset, roles: string[]): boolean {
  if (roles.length === 0) return true;
  return roles.every((role) => asset.roles.includes(role));
}

/** OR semantics — `category` is single-valued, so any match qualifies. */
export function matchesCategories(asset: Asset, categories: string[]): boolean {
  if (categories.length === 0) return true;
  return categories.includes(asset.category);
}

export function matchesFavorite(asset: Asset, favoritesOnly: boolean): boolean {
  if (!favoritesOnly) return true;
  return asset.favorite;
}

export function filterAssets(assets: Asset[], filters: AssetFilters): Asset[] {
  return assets.filter(
    (asset) =>
      matchesQuery(asset, filters.query) &&
      matchesType(asset, filters.type) &&
      matchesRoles(asset, filters.roles) &&
      matchesCategories(asset, filters.categories) &&
      matchesFavorite(asset, filters.favoritesOnly),
  );
}

/** Counts assets per type, meant to be called with the non-type filters already applied. */
export function countByType(assets: Asset[]): Record<AssetType, number> {
  const counts: Record<AssetType, number> = {
    prompt: 0,
    skill: 0,
    tool: 0,
    resource: 0,
  };
  for (const asset of assets) {
    counts[asset.type] += 1;
  }
  return counts;
}

function distinctSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function distinctRoles(assets: Asset[]): string[] {
  return distinctSorted(assets.flatMap((asset) => asset.roles));
}

export function distinctCategories(assets: Asset[]): string[] {
  return distinctSorted(
    assets.map((asset) => asset.category).filter((category) => category !== ""),
  );
}

import type { Asset, AssetType, Category, Role } from "./types";
import { CATEGORIES, ROLES } from "./types";

export interface AssetFilters {
  query: string;
  type: AssetType | null;
  role: Role | null;
  category: Category | null;
  favoritesOnly: boolean;
}

export const EMPTY_FILTERS: AssetFilters = {
  query: "",
  type: null,
  role: null,
  category: null,
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

/** Single-select: with no role chosen everything matches; otherwise the asset must include it. */
export function matchesRole(asset: Asset, role: Role | null): boolean {
  if (role === null) return true;
  return asset.roles.includes(role);
}

/** Single-select: with no category chosen everything matches; otherwise it must be an exact match. */
export function matchesCategory(
  asset: Asset,
  category: Category | null,
): boolean {
  if (category === null) return true;
  return asset.category === category;
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
      matchesRole(asset, filters.role) &&
      matchesCategory(asset, filters.category) &&
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

/** Roles from the fixed list that are actually used in the library, in fixed display order. */
export function distinctRoles(assets: Asset[]): Role[] {
  const used = new Set(assets.flatMap((asset) => asset.roles));
  return ROLES.filter((role) => used.has(role));
}

/** Categories from the fixed list that are actually used in the library, in fixed display order. */
export function distinctCategories(assets: Asset[]): Category[] {
  const used = new Set(assets.map((asset) => asset.category));
  return CATEGORIES.filter((category) => used.has(category));
}

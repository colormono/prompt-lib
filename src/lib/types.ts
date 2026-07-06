export type AssetType = "prompt" | "skill" | "tool" | "resource";

export type SdlcStage = "discover" | "design" | "build" | "ship" | "operate";

export type ResourceType = "article" | "video" | "doc" | "other";

/** Fixed taxonomy: what stage of work an asset is used for. */
export type Category =
  | "understand"
  | "plan"
  | "prototype"
  | "build"
  | "test"
  | "refactor"
  | "review"
  | "steer"
  | "debug"
  | "git"
  | "release"
  | "data"
  | "automate"
  | "product"
  | "design"
  | "docs"
  | "marketing"
  | "security"
  | "on-call";

/** Fixed taxonomy: who an asset is relevant to. */
export type Role =
  | "pm"
  | "design"
  | "marketing"
  | "docs"
  | "data"
  | "security"
  | "ops";

export interface BaseAsset {
  id: string;
  type: AssetType;
  title: string;
  description: string;
  category: Category;
  roles: Role[];
  sdlcStage: SdlcStage;
  favorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromptAsset extends BaseAsset {
  type: "prompt";
  prompt: string;
  model: string;
  slots: Record<string, string>;
}

export interface SkillAsset extends BaseAsset {
  type: "skill";
  body: string;
}

export interface ToolAsset extends BaseAsset {
  type: "tool";
  url: string;
}

export interface ResourceAsset extends BaseAsset {
  type: "resource";
  url: string;
  resourceType: ResourceType;
}

export type Asset = PromptAsset | SkillAsset | ToolAsset | ResourceAsset;

/** Shared shape for the fields a user fills in via the form. */
interface BaseAssetDraft {
  title: string;
  description: string;
  category: Category;
  roles: Role[];
  sdlcStage: SdlcStage;
}

export interface PromptDraft extends BaseAssetDraft {
  type: "prompt";
  prompt: string;
  model: string;
  slots: Record<string, string>;
}

export interface SkillDraft extends BaseAssetDraft {
  type: "skill";
  body: string;
}

export interface ToolDraft extends BaseAssetDraft {
  type: "tool";
  url: string;
}

export interface ResourceDraft extends BaseAssetDraft {
  type: "resource";
  url: string;
  resourceType: ResourceType;
}

/**
 * Fields the user fills in via the form; the store assigns everything else
 * (id, timestamps, favorite, order) on create.
 */
export type AssetDraft = PromptDraft | SkillDraft | ToolDraft | ResourceDraft;

export function isPromptAsset(asset: Asset): asset is PromptAsset {
  return asset.type === "prompt";
}

export function isSkillAsset(asset: Asset): asset is SkillAsset {
  return asset.type === "skill";
}

export function isToolAsset(asset: Asset): asset is ToolAsset {
  return asset.type === "tool";
}

export function isResourceAsset(asset: Asset): asset is ResourceAsset {
  return asset.type === "resource";
}

export const ASSET_TYPES: AssetType[] = ["prompt", "skill", "tool", "resource"];
export const SDLC_STAGES: SdlcStage[] = [
  "discover",
  "design",
  "build",
  "ship",
  "operate",
];
export const RESOURCE_TYPES: ResourceType[] = [
  "article",
  "video",
  "doc",
  "other",
];

/** Fixed category list, in display order. Source of truth for the form selector and filter chips. */
export const CATEGORIES: Category[] = [
  "understand",
  "plan",
  "prototype",
  "build",
  "test",
  "refactor",
  "review",
  "steer",
  "debug",
  "git",
  "release",
  "data",
  "automate",
  "product",
  "design",
  "docs",
  "marketing",
  "security",
  "on-call",
];

/** Fixed role list, in display order. Source of truth for the form selector and filter chips. */
export const ROLES: Role[] = [
  "pm",
  "design",
  "marketing",
  "docs",
  "data",
  "security",
  "ops",
];

const DEFAULT_CATEGORY: Category = "build";

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

/** Coerces an unknown category to a valid one, defaulting to `"build"`. */
export function toCategory(value: unknown): Category {
  return isCategory(value) ? value : DEFAULT_CATEGORY;
}

/** Coerces an unknown roles array, dropping any entries outside the fixed list. */
export function toRoles(value: unknown): Role[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRole);
}

/** Title-cases a fixed taxonomy value for display, e.g. `"on-call"` → `"On-call"`, `"pm"` → `"PM"`. */
export function formatTaxonomyLabel(value: Category | Role): string {
  if (value === "pm") return "PM";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

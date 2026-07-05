export type AssetType = "prompt" | "skill" | "tool" | "resource";

export type SdlcStage = "discover" | "design" | "build" | "ship" | "operate";

export type ResourceType = "article" | "video" | "doc" | "other";

export interface BaseAsset {
  id: string;
  type: AssetType;
  title: string;
  description: string;
  category: string;
  roles: string[];
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
  category: string;
  roles: string[];
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

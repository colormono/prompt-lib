export type ViewMode = "list" | "grid";

const STORAGE_KEY = "prompt-lib:view-mode";
const DEFAULT_VIEW_MODE: ViewMode = "list";

export function getStoredViewMode(): ViewMode | null {
  if (typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "list" || stored === "grid" ? stored : null;
}

export function getInitialViewMode(): ViewMode {
  return getStoredViewMode() ?? DEFAULT_VIEW_MODE;
}

export function setViewMode(mode: ViewMode): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, mode);
}

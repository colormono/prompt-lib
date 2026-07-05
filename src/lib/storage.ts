import type { Asset } from "./types";

const STORAGE_KEY = "prompt-lib:assets";

export function isAssetShape(value: unknown): value is Asset {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.title === "string"
  );
}

/**
 * Loads the library from localStorage. Falls back to an empty library on a
 * missing key, invalid JSON, or a malformed (non-array / non-asset) shape —
 * this is the only place corrupt data is allowed to surface, and it never
 * throws to the caller.
 */
export function loadLibrary(): Asset[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAssetShape);
  } catch {
    return [];
  }
}

export class StorageWriteError extends Error {
  constructor(cause: unknown) {
    super("Failed to save the library to localStorage");
    this.name = "StorageWriteError";
    this.cause = cause;
  }
}

/**
 * Saves the library to localStorage. Throws a typed `StorageWriteError`
 * (e.g. on quota exceeded) so callers can decide how to surface it, rather
 * than letting a raw DOMException bubble up.
 */
export function saveLibrary(assets: Asset[]): void {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch (error) {
    throw new StorageWriteError(error);
  }
}

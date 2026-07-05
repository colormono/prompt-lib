import { isAssetShape } from "./storage";
import type { Asset } from "./types";

export const LIBRARY_EXPORT_VERSION = 1;

export interface LibraryExport {
  version: 1;
  exportedAt: string;
  assets: Asset[];
}

/** Wraps the current library with a version and export timestamp. */
export function buildExport(assets: Asset[]): LibraryExport {
  return {
    version: LIBRARY_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    assets,
  };
}

/** Serializes an export as human-readable, indented JSON. */
export function serializeExport(data: LibraryExport): string {
  return JSON.stringify(data, null, 2);
}

export type ImportError = "invalid-json" | "invalid-shape";

function isLibraryExportShape(
  value: unknown,
): value is { version: unknown; exportedAt: unknown; assets: unknown[] } {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return "assets" in candidate && Array.isArray(candidate.assets);
}

/**
 * Parses a raw JSON string into a `LibraryExport`. Never throws — returns a
 * typed error so the caller can surface it to the user, mirroring
 * `loadLibrary`'s fail-safe parsing but without silently swallowing the
 * failure, since import is a user-initiated action.
 */
export function parseImport(raw: string): LibraryExport | ImportError {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "invalid-json";
  }

  if (!isLibraryExportShape(parsed)) return "invalid-shape";

  const assets = parsed.assets.filter(isAssetShape);
  return {
    version: LIBRARY_EXPORT_VERSION,
    exportedAt:
      typeof parsed.exportedAt === "string"
        ? parsed.exportedAt
        : new Date().toISOString(),
    assets,
  };
}

export interface ImportConflict {
  incoming: Asset;
  existing: Asset;
}

export interface ImportDiff {
  toAdd: Asset[];
  conflicts: ImportConflict[];
}

/** Splits incoming assets into new (`toAdd`) and `id`-colliding (`conflicts`). */
export function diffImport(existing: Asset[], incoming: Asset[]): ImportDiff {
  const existingById = new Map(existing.map((asset) => [asset.id, asset]));
  const toAdd: Asset[] = [];
  const conflicts: ImportConflict[] = [];

  for (const asset of incoming) {
    const match = existingById.get(asset.id);
    if (match) {
      conflicts.push({ incoming: asset, existing: match });
    } else {
      toAdd.push(asset);
    }
  }

  return { toAdd, conflicts };
}

export type ConflictResolution = "keep-mine" | "keep-imported" | "keep-both";

/** Clones an incoming asset as a new, non-conflicting entry. */
function cloneAsBoth(asset: Asset): Asset {
  return {
    ...asset,
    id: crypto.randomUUID(),
    title: `${asset.title} (imported)`,
  };
}

/**
 * Produces the final merged asset list given a per-conflict resolution
 * choice, keyed by the incoming asset's `id`. Assets with no resolution
 * entry default to `"keep-mine"`.
 */
export function resolveImport(
  existing: Asset[],
  diff: ImportDiff,
  resolutions: Record<string, ConflictResolution>,
): Asset[] {
  const result = [...existing, ...diff.toAdd];

  for (const conflict of diff.conflicts) {
    const resolution = resolutions[conflict.incoming.id] ?? "keep-mine";

    switch (resolution) {
      case "keep-mine":
        break;
      case "keep-imported": {
        const index = result.findIndex(
          (asset) => asset.id === conflict.existing.id,
        );
        if (index !== -1) result[index] = conflict.incoming;
        break;
      }
      case "keep-both":
        result.push(cloneAsBoth(conflict.incoming));
        break;
    }
  }

  return result;
}

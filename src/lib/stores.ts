import { get, writable } from "svelte/store";
import { loadLibrary, saveLibrary } from "./storage";
import type { Asset, AssetDraft } from "./types";

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

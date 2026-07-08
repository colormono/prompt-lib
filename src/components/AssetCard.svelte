<script lang="ts">
  import { getCopyText } from "../lib/copyText";
  import { parsePromptSegments } from "../lib/promptFill";
  import { toggleFavorite } from "../lib/stores";
  import type { Asset, AssetType } from "../lib/types";
  import { formatTaxonomyLabel } from "../lib/types";
  import Badge from "./ui/Badge.svelte";
  import Card from "./ui/Card.svelte";

  interface Props {
    asset: Asset;
    onEdit: (asset: Asset) => void;
  }

  let { asset, onEdit }: Props = $props();

  const TYPE_LABELS: Record<AssetType, string> = {
    prompt: "Prompt",
    skill: "Skill",
    tool: "Tool",
    resource: "Resource",
  };

  const TYPE_VARIANTS: Record<
    AssetType,
    "brand" | "success" | "warning" | "neutral"
  > = {
    prompt: "brand",
    skill: "success",
    tool: "warning",
    resource: "neutral",
  };

  const PREVIEW_LENGTH = 200;

  const preview = $derived(
    asset.type === "prompt"
      ? asset.prompt.length > PREVIEW_LENGTH
        ? `${asset.prompt.slice(0, PREVIEW_LENGTH)}…`
        : asset.prompt
      : asset.description,
  );

  const promptSegments = $derived(
    asset.type === "prompt" ? parsePromptSegments(asset.prompt) : [],
  );

  let expanded = $state(false);
  let copied = $state(false);
  let copyError = $state(false);
  let slotValues = $state<Record<string, string>>({});
  let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

  function toggleExpanded() {
    if (!expanded && asset.type === "prompt") {
      slotValues = { ...asset.slots };
    }
    expanded = !expanded;
  }

  /** Collapsed header copy: raw prompt template (placeholders intact). */
  async function handleHeaderCopy(event: MouseEvent) {
    event.stopPropagation();
    const text =
      asset.type === "prompt" ? asset.prompt : getCopyText(asset);
    await copyToClipboard(text);
  }

  /** Expanded panel copy: prompt with current slot inputs filled in. */
  async function handleFilledCopy(event: MouseEvent) {
    event.stopPropagation();
    const text = getCopyText(asset, slotValues);
    await copyToClipboard(text);
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      copyError = false;
    } catch {
      copyError = true;
      copied = false;
    }
    clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => {
      copied = false;
      copyError = false;
    }, 2000);
  }

  function handleEdit(event: MouseEvent) {
    event.stopPropagation();
    onEdit(asset);
  }

  function handleFavorite(event: MouseEvent) {
    event.stopPropagation();
    toggleFavorite(asset.id);
  }
</script>

<Card>
  <div class="asset-card">
    <div class="asset-card__top">
      <Badge variant={TYPE_VARIANTS[asset.type]}>
        {TYPE_LABELS[asset.type]}
      </Badge>
      {#if asset.roles.length > 0}
        <div class="asset-card__roles">
          {#each asset.roles as role (role)}
            <Badge variant="neutral">{formatTaxonomyLabel(role)}</Badge>
          {/each}
        </div>
      {/if}
      <div class="asset-card__actions">
        <button
          type="button"
          class="asset-card__icon-btn"
          aria-label={asset.type === "prompt"
            ? "Copy prompt template"
            : "Copy to clipboard"}
          onclick={handleHeaderCopy}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3" />
            <path d="M3 10.5V3.5a1 1 0 0 1 1-1h7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
          </svg>
        </button>
        <button
          type="button"
          class="asset-card__icon-btn"
          aria-label="Edit"
          onclick={handleEdit}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10.5 2.5 13.5 5.5 5.5 13.5H2.5V10.5L10.5 2.5Z"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          class="asset-card__icon-btn"
          class:asset-card__icon-btn--active={asset.favorite}
          aria-pressed={asset.favorite}
          aria-label={asset.favorite
            ? "Remove from favorites"
            : "Add to favorites"}
          onclick={handleFavorite}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2.5 9.8 6.1l3.9.6-2.8 2.8.7 3.9L8 11.4 4.4 13.4l.7-3.9L2.3 6.7l3.9-.6L8 2.5Z"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
              fill={asset.favorite ? "currentColor" : "none"}
            />
          </svg>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="asset-card__toggle"
      aria-expanded={expanded}
      onclick={toggleExpanded}
    >
      <h3 class="asset-card__title">{asset.title}</h3>
      {#if preview}
        <p class="asset-card__preview">{preview}</p>
      {/if}
    </button>

    <p class="asset-card__status" aria-live="polite">
      {#if copied}Copied{:else if copyError}Couldn't copy{/if}
    </p>

    {#if expanded}
      <div class="asset-card__panel">
        {#if asset.type === "prompt"}
          <p class="asset-card__panel-label">Fill in and copy</p>
          <p class="asset-card__fill">
            {#each promptSegments as segment, index (index)}
              {#if segment.type === "text"}{segment.value}{:else}<input
                  class="asset-card__slot-input"
                  aria-label={segment.key}
                  size={Math.max((slotValues[segment.key] ?? "").length, 4)}
                  bind:value={slotValues[segment.key]}
                />{/if}
            {/each}
          </p>
          <button
            type="button"
            class="asset-card__copy-btn"
            aria-label="Copy with filled slots"
            onclick={handleFilledCopy}
          >
            Copy filled
          </button>
          {#if asset.description}
            <p class="asset-card__panel-label">Why this works</p>
            <p class="asset-card__why">{asset.description}</p>
          {/if}
        {:else if asset.type === "skill"}
          <p class="asset-card__why">{asset.body}</p>
        {:else}
          <p class="asset-card__why">
            <a href={asset.url} target="_blank" rel="noreferrer">{asset.url}</a>
          </p>
        {/if}
      </div>
    {/if}
  </div>
</Card>

<style>
  .asset-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .asset-card__top {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .asset-card__actions {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-1);
  }

  .asset-card__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--font-size-md);
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  .asset-card__icon-btn:hover {
    background-color: var(--color-bg-subtle);
    color: var(--color-text);
  }

  .asset-card__icon-btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .asset-card__icon-btn--active {
    /* Electric Indigo, not --color-warning: favoriting is an actionable
       selection state, not a status signal, and warning/amber is already
       reserved for the "Tool" type badge (see DESIGN.md's One Signal Rule). */
    color: var(--color-accent);
  }

  .asset-card__toggle {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    text-align: start;
    width: 100%;
    border-radius: var(--radius-md);
  }

  .asset-card__title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    transition: color var(--transition-fast);
  }

  .asset-card__toggle:hover .asset-card__title {
    color: var(--color-accent);
  }

  .asset-card__preview {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-family: var(--font-family-mono);
    overflow-wrap: anywhere;
  }

  .asset-card__roles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .asset-card__status {
    min-height: 1rem;
    font-size: var(--font-size-xs);
    color: var(--color-success);
  }

  .asset-card__panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-bg-subtle);
  }

  .asset-card__panel-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
  }

  .asset-card__fill {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .asset-card__slot-input {
    display: inline-block;
    max-inline-size: 100%;
    padding: 0 var(--space-1);
    border: 1px dashed var(--color-accent);
    border-radius: var(--radius-sm);
    background-color: var(--color-accent-subtle);
    color: var(--color-text);
    font: inherit;
  }

  .asset-card__copy-btn {
    align-self: flex-start;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-accent-solid);
    color: var(--color-text-on-brand);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .asset-card__copy-btn:hover {
    background-color: var(--color-accent-solid-hover);
  }

  .asset-card__why {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>

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
    prompt: "neutral",
    skill: "success",
    tool: "warning",
    resource: "brand",
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

  function handleResetSlots(event: MouseEvent) {
    event.stopPropagation();
    slotValues = { ...asset.slots };
  }

  const tokenEstimate = $derived(
    asset.type === "prompt"
      ? Math.max(1, Math.round(asset.prompt.trim().split(/\s+/).length * 1.3))
      : 0,
  );

  const metaPills = $derived.by(() => {
    if (asset.type !== "prompt") return [];
    const pills: string[] = [];
    if (asset.model) pills.push(asset.model);
    pills.push(formatTaxonomyLabel(asset.category));
    for (const role of asset.roles) {
      pills.push(formatTaxonomyLabel(role));
    }
    pills.push(`~${tokenEstimate} tokens`);
    return pills;
  });
</script>

<Card padding="sm">
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
          class:asset-card__icon-btn--ok={copied && !copyError}
          class:asset-card__icon-btn--err={copyError}
          aria-label={asset.type === "prompt"
            ? "Copy prompt template"
            : "Copy to clipboard"}
          onclick={handleHeaderCopy}
        >
          {#if copied && !copyError}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8.5 6.5 11.5 12.5 4.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3" />
              <path d="M3 10.5V3.5a1 1 0 0 1 1-1h7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            </svg>
          {/if}
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

    <p class="sr-only" aria-live="polite">
      {#if copied}Copied to clipboard{:else if copyError}Couldn't copy{/if}
    </p>

    {#if expanded}
      {#if asset.type === "prompt"}
        <div class="code-block">
          <div class="code-block__header">
            <div class="code-block__dots" aria-hidden="true">
              <span class="code-block__dot code-block__dot--red"></span>
              <span class="code-block__dot code-block__dot--amber"></span>
              <span class="code-block__dot code-block__dot--green"></span>
            </div>
            <div class="code-block__actions">
              <button
                type="button"
                class="code-block__ghost-btn"
                aria-label="Reset slot values"
                onclick={handleResetSlots}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 3.5v3h3M12.5 12.5v-3h-3"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.2 9.5A4.5 4.5 0 0 0 12 11.2M11.8 6.5A4.5 4.5 0 0 0 4 4.8"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                  />
                </svg>
                Reset
              </button>
              <button
                type="button"
                class="code-block__copy-btn"
                class:code-block__copy-btn--ok={copied && !copyError}
                aria-label="Copy with filled slots"
                onclick={handleFilledCopy}
              >
                {#if copied && !copyError}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Copied
                {:else}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect
                      x="5.5"
                      y="5.5"
                      width="8"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      stroke-width="1.3"
                    />
                    <path
                      d="M3 10.5V3.5a1 1 0 0 1 1-1h7"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                    />
                  </svg>
                  Copy
                {/if}
              </button>
            </div>
          </div>

          <p class="code-block__body">
            {#each promptSegments as segment, index (index)}
              {#if segment.type === "text"}{segment.value}{:else}<input
                  class="code-block__slot"
                  aria-label={segment.key}
                  size={Math.max((slotValues[segment.key] ?? "").length, 4)}
                  bind:value={slotValues[segment.key]}
                />{/if}
            {/each}
          </p>

          {#if metaPills.length > 0}
            <div class="code-block__meta">
              {#each metaPills as pill, index (index)}
                <span class="code-block__pill">{pill}</span>
              {/each}
            </div>
          {/if}
        </div>
        {#if asset.description}
          <div class="asset-card__note">
            <p class="asset-card__panel-label">Why this works</p>
            <p class="asset-card__why">{asset.description}</p>
          </div>
        {/if}
      {:else}
        <div class="asset-card__panel">
          {#if asset.type === "skill"}
            <p class="asset-card__why">{asset.body}</p>
          {:else}
            <p class="asset-card__why">
              <a href={asset.url} target="_blank" rel="noreferrer">{asset.url}</a>
            </p>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</Card>

<style>
  .asset-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .asset-card__top {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .asset-card__actions {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;
    gap: 0;
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
    /* Ember marks actionable selection (favorite), not a status signal. */
    color: var(--color-accent);
  }

  .asset-card__icon-btn--ok {
    color: var(--color-success);
  }

  .asset-card__icon-btn--err {
    color: var(--color-danger);
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
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-body);
    line-height: var(--line-height-tight);
    color: var(--color-text);
    transition: color var(--transition-fast);
  }

  .asset-card__toggle:hover .asset-card__title {
    color: var(--color-accent);
  }

  .asset-card__preview {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-family-mono);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .asset-card__roles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .asset-card__panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2);
    border-radius: var(--radius-md);
    background-color: var(--color-bg-subtle);
  }

  .asset-card__note {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-top: var(--space-2);
  }

  .asset-card__panel-label {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-muted);
  }

  .asset-card__why {
    font-family: var(--font-family-editorial);
    font-size: 1.0625rem;
    line-height: 1.5;
    color: var(--color-text);
  }

  /* Warm dark prompt code block — compact */
  .code-block {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-top: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-code-border);
    border-radius: var(--radius-md);
    background-color: var(--color-code-surface);
  }

  .code-block__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .code-block__dots {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .code-block__dot {
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 50%;
  }

  .code-block__dot--red {
    background-color: var(--color-code-dot-red);
  }

  .code-block__dot--amber {
    background-color: var(--color-code-dot-amber);
  }

  .code-block__dot--green {
    background-color: var(--color-code-dot-green);
  }

  .code-block__actions {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .code-block__ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: 0.15em 0.4em;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-code-text-muted);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-regular);
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  .code-block__ghost-btn:hover {
    color: var(--color-code-text);
  }

  .code-block__ghost-btn:focus-visible,
  .code-block__copy-btn:focus-visible,
  .code-block__slot:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .code-block__copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    min-inline-size: 5.25rem;
    padding: 0.2em 0.55em;
    border: none;
    border-radius: var(--radius-md);
    background-color: var(--color-action);
    color: var(--color-action-text);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-regular);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .code-block__copy-btn--ok {
    background-color: var(--color-forest);
  }

  .code-block__copy-btn:hover {
    background-color: var(--color-action-hover);
  }

  .code-block__copy-btn--ok:hover {
    background-color: var(--color-forest);
  }

  .code-block__body {
    margin: 0;
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    line-height: 1.5;
    color: var(--color-code-text);
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .code-block__slot {
    display: inline-block;
    max-inline-size: 100%;
    margin-inline: 0.05em;
    padding: 0 0.2em;
    border: 1px dashed var(--color-code-slot-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-code-slot-bg);
    color: var(--color-amber);
    font: inherit;
  }

  .code-block__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .code-block__pill {
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    color: var(--color-code-text-muted);
    font-family: var(--font-family-mono);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-regular);
  }
</style>

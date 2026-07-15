<script lang="ts">
  import type {
    Asset,
    AssetDraft,
    AssetType,
    Category,
    ResourceType,
    Role,
    SdlcStage,
  } from "../lib/types";
  import {
    ASSET_TYPES,
    CATEGORIES,
    formatTaxonomyLabel,
    RESOURCE_TYPES,
    ROLES,
    SDLC_STAGES,
  } from "../lib/types";
  import { validateAsset } from "../lib/validation";
  import Button from "./ui/Button.svelte";
  import Checkbox from "./ui/Checkbox.svelte";
  import Input from "./ui/Input.svelte";
  import Modal from "./ui/Modal.svelte";
  import Select from "./ui/Select.svelte";
  import Textarea from "./ui/Textarea.svelte";

  interface Props {
    open: boolean;
    asset?: Asset;
    onSubmit: (draft: AssetDraft) => void;
    onDelete: (asset: Asset) => void;
  }

  let { open = $bindable(false), asset, onSubmit, onDelete }: Props = $props();

  interface SlotRow {
    key: string;
    value: string;
  }

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  const CATEGORY_OPTIONS = CATEGORIES.map((value) => ({
    value,
    label: formatTaxonomyLabel(value),
  }));

  let type = $state<AssetType>("prompt");
  let title = $state("");
  let description = $state("");
  let category = $state<Category>(CATEGORIES[0]);
  let roles = $state<Role[]>([]);
  let sdlcStage = $state<SdlcStage>("discover");
  let promptText = $state("");
  let model = $state("");
  let slotRows = $state<SlotRow[]>([]);
  let body = $state("");
  let url = $state("");
  let resourceType = $state<ResourceType>("doc");
  let errors = $state<Record<string, string>>({});

  const isEditing = $derived(asset !== undefined);
  const modalTitle = $derived(isEditing ? "Edit asset" : "New asset");

  function resetForm() {
    errors = {};
    if (!asset) {
      type = "prompt";
      title = "";
      description = "";
      category = CATEGORIES[0];
      roles = [];
      sdlcStage = "discover";
      promptText = "";
      model = "";
      slotRows = [];
      body = "";
      url = "";
      resourceType = "doc";
      return;
    }

    type = asset.type;
    title = asset.title;
    description = asset.description;
    category = asset.category;
    roles = [...asset.roles];
    sdlcStage = asset.sdlcStage;
    promptText = asset.type === "prompt" ? asset.prompt : "";
    model = asset.type === "prompt" ? asset.model : "";
    slotRows =
      asset.type === "prompt"
        ? Object.entries(asset.slots).map(([key, value]) => ({ key, value }))
        : [];
    body = asset.type === "skill" ? asset.body : "";
    url = asset.type === "tool" || asset.type === "resource" ? asset.url : "";
    resourceType = asset.type === "resource" ? asset.resourceType : "doc";
  }

  $effect(() => {
    if (open) resetForm();
  });

  function addSlotRow() {
    slotRows = [...slotRows, { key: "", value: "" }];
  }

  function removeSlotRow(index: number) {
    slotRows = slotRows.filter((_, i) => i !== index);
  }

  function toggleRole(role: Role, checked: boolean) {
    roles = checked ? [...roles, role] : roles.filter((r) => r !== role);
  }

  function buildDraft(): AssetDraft {
    const shared = {
      title,
      description,
      category,
      roles,
      sdlcStage,
    };

    if (type === "prompt") {
      const slots: Record<string, string> = {};
      for (const row of slotRows) {
        if (row.key.trim()) slots[row.key.trim()] = row.value;
      }
      return { type: "prompt", ...shared, prompt: promptText, model, slots };
    }
    if (type === "skill") {
      return { type: "skill", ...shared, body };
    }
    if (type === "tool") {
      return { type: "tool", ...shared, url };
    }
    return {
      type: "resource",
      ...shared,
      url,
      resourceType,
    };
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const draft = buildDraft();
    const result = validateAsset(draft);
    if (!result.valid) {
      errors = result.errors;
      return;
    }
    onSubmit(draft);
    open = false;
  }

  function handleCancel() {
    open = false;
  }

  function handleDelete() {
    if (asset) onDelete(asset);
  }
</script>

<Modal bind:open title={modalTitle}>
  <form class="asset-form" novalidate onsubmit={handleSubmit}>
    {#if !isEditing}
      <fieldset class="asset-form__chips">
        <legend>Type</legend>
        <div class="asset-form__chip-row" role="radiogroup" aria-label="Type">
          {#each ASSET_TYPES as option (option)}
            <button
              type="button"
              class="asset-form__chip"
              class:asset-form__chip--selected={type === option}
              aria-pressed={type === option}
              onclick={() => (type = option)}
            >
              {capitalize(option)}
            </button>
          {/each}
        </div>
      </fieldset>
    {/if}

    <Input label="Title" bind:value={title} error={errors.title} required />
    <Select
      label="Category"
      value={category}
      options={CATEGORY_OPTIONS}
      onchange={(event: Event) =>
        (category = (event.target as HTMLSelectElement).value as Category)}
      required
    />
    <fieldset class="asset-form__roles">
      <legend>Roles</legend>
      <div class="asset-form__roles-grid">
        {#each ROLES as role (role)}
          <Checkbox
            label={formatTaxonomyLabel(role)}
            checked={roles.includes(role)}
            onchange={(event: Event) =>
              toggleRole(role, (event.target as HTMLInputElement).checked)}
          />
        {/each}
      </div>
    </fieldset>

    <fieldset class="asset-form__chips">
      <legend>SDLC stage</legend>
      <div
        class="asset-form__chip-row"
        role="radiogroup"
        aria-label="SDLC stage"
      >
        {#each SDLC_STAGES as option (option)}
          <button
            type="button"
            class="asset-form__chip"
            class:asset-form__chip--selected={sdlcStage === option}
            aria-pressed={sdlcStage === option}
            onclick={() => (sdlcStage = option)}
          >
            {capitalize(option)}
          </button>
        {/each}
      </div>
    </fieldset>

    <!-- Stack type panels in one grid cell so height stays stable when
         switching Type (avoids modal/content jump). -->
    <div class="asset-form__type-fields">
      <div
        class="asset-form__type-panel"
        class:asset-form__type-panel--active={type === "prompt"}
        aria-hidden={type !== "prompt"}
        inert={type !== "prompt" ? true : undefined}
      >
        <Textarea
          label="Prompt"
          bind:value={promptText}
          error={errors.prompt}
          required={type === "prompt"}
          help="Use {'{placeholder}'} syntax for fillable spots."
        />
        <fieldset class="asset-form__slots">
          <legend>Slots</legend>
          {#each slotRows as row, index (index)}
            <div class="asset-form__slot-row">
              <Input
                label="Name"
                hideLabel
                placeholder="Name"
                bind:value={row.key}
              />
              <Input
                label="Value"
                hideLabel
                placeholder="Value"
                bind:value={row.value}
              />
              <button
                type="button"
                class="asset-form__icon-btn"
                aria-label="Remove slot"
                title="Remove slot"
                onclick={() => removeSlotRow(index)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 4.5h9M6.5 4.5V3.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5.5 4.5v8a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-8M7 7v4M9 7v4"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          {/each}
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onclick={addSlotRow}
          >
            Add slot
          </Button>
        </fieldset>
        <Input label="Model" bind:value={model} placeholder="e.g. gpt-4" />
      </div>

      <div
        class="asset-form__type-panel"
        class:asset-form__type-panel--active={type === "skill"}
        aria-hidden={type !== "skill"}
        inert={type !== "skill" ? true : undefined}
      >
        <Textarea label="Description" bind:value={description} />
        <Textarea
          label="Instructions"
          bind:value={body}
          error={errors.body}
          required={type === "skill"}
        />
      </div>

      <div
        class="asset-form__type-panel"
        class:asset-form__type-panel--active={type === "tool"}
        aria-hidden={type !== "tool"}
        inert={type !== "tool" ? true : undefined}
      >
        <Textarea label="Description" bind:value={description} />
        <Input
          label="URL"
          type="url"
          bind:value={url}
          error={errors.url}
          required={type === "tool"}
        />
      </div>

      <div
        class="asset-form__type-panel"
        class:asset-form__type-panel--active={type === "resource"}
        aria-hidden={type !== "resource"}
        inert={type !== "resource" ? true : undefined}
      >
        <Textarea label="Description" bind:value={description} />
        <Input
          label="URL"
          type="url"
          bind:value={url}
          error={errors.url}
          required={type === "resource"}
        />
        <fieldset class="asset-form__chips">
          <legend>Resource type</legend>
          <div
            class="asset-form__chip-row"
            role="radiogroup"
            aria-label="Resource type"
          >
            {#each RESOURCE_TYPES as option (option)}
              <button
                type="button"
                class="asset-form__chip"
                class:asset-form__chip--selected={resourceType === option}
                aria-pressed={resourceType === option}
                onclick={() => (resourceType = option)}
              >
                {capitalize(option)}
              </button>
            {/each}
          </div>
        </fieldset>
      </div>
    </div>

    <div class="asset-form__actions">
      {#if isEditing}
        <Button variant="danger" type="button" onclick={handleDelete}>
          Delete
        </Button>
      {/if}
      <div class="asset-form__actions-end">
        <Button variant="ghost" type="button" onclick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Save changes" : "Create asset"}
        </Button>
      </div>
    </div>
  </form>
</Modal>

<style>
  .asset-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .asset-form__type-fields {
    display: grid;
  }

  .asset-form__type-panel {
    grid-area: 1 / 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    visibility: hidden;
    pointer-events: none;
  }

  .asset-form__type-panel--active {
    visibility: visible;
    pointer-events: auto;
  }

  .asset-form__chips,
  .asset-form__roles,
  .asset-form__slots {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    border: none;
  }

  .asset-form__roles,
  .asset-form__slots {
    padding: var(--space-3);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
  }

  .asset-form__chips legend,
  .asset-form__roles legend,
  .asset-form__slots legend {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.004em;
    padding: 0;
    margin-block-end: var(--space-1);
  }

  .asset-form__roles legend,
  .asset-form__slots legend {
    padding-inline: var(--space-1);
  }

  .asset-form__chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .asset-form__chip {
    display: inline-flex;
    align-items: center;
    padding: 0.35em 0.75em;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text-secondary);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }

  .asset-form__chip:hover {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
    color: var(--color-text);
  }

  .asset-form__chip--selected {
    border-color: var(--color-accent-solid);
    background-color: var(--color-accent-solid);
    color: var(--color-text-on-brand);
  }

  .asset-form__chip--selected:hover {
    border-color: var(--color-accent-solid-hover);
    background-color: var(--color-accent-solid-hover);
    color: var(--color-text-on-brand);
  }

  .asset-form__roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: var(--space-2);
  }

  .asset-form__slot-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    align-items: center;
    gap: var(--space-2);
  }

  .asset-form__slot-row :global(.field) {
    gap: 0;
  }

  .asset-form__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2.25rem;
    block-size: 2.25rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .asset-form__icon-btn:hover {
    background-color: var(--color-danger-subtle);
    color: var(--color-danger);
  }

  .asset-form__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .asset-form__actions-end {
    display: flex;
    gap: var(--space-2);
    margin-inline-start: auto;
  }
</style>

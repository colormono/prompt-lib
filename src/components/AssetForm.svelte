<script lang="ts">
  import type {
    Asset,
    AssetDraft,
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

  const TYPE_OPTIONS = ASSET_TYPES.map((value) => ({
    value,
    label: capitalize(value),
  }));
  const SDLC_OPTIONS = SDLC_STAGES.map((value) => ({
    value,
    label: capitalize(value),
  }));
  const RESOURCE_TYPE_OPTIONS = RESOURCE_TYPES.map((value) => ({
    value,
    label: capitalize(value),
  }));
  const CATEGORY_OPTIONS = CATEGORIES.map((value) => ({
    value,
    label: formatTaxonomyLabel(value),
  }));

  let type = $state("prompt");
  let title = $state("");
  let description = $state("");
  let category = $state<Category>(CATEGORIES[0]);
  let roles = $state<Role[]>([]);
  let sdlcStage = $state("discover");
  let promptText = $state("");
  let model = $state("");
  let slotRows = $state<SlotRow[]>([]);
  let body = $state("");
  let url = $state("");
  let resourceType = $state("doc");
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
      sdlcStage: sdlcStage as SdlcStage,
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
      resourceType: resourceType as ResourceType,
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
    <Select
      label="Type"
      bind:value={type}
      options={TYPE_OPTIONS}
      disabled={isEditing}
      required
    />
    <Input label="Title" bind:value={title} error={errors.title} required />
    <Textarea label="Description" bind:value={description} />
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
    <Select
      label="SDLC stage"
      bind:value={sdlcStage}
      options={SDLC_OPTIONS}
      required
    />

    {#if type === "prompt"}
      <Textarea
        label="Prompt"
        bind:value={promptText}
        error={errors.prompt}
        required
        help="Use {'{placeholder}'} syntax for fillable spots."
      />
      <fieldset class="asset-form__slots">
        <legend>Slots</legend>
        {#each slotRows as row, index (index)}
          <div class="asset-form__slot-row">
            <Input label="Name" bind:value={row.key} />
            <Input label="Value" bind:value={row.value} />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onclick={() => removeSlotRow(index)}
            >
              Remove
            </Button>
          </div>
        {/each}
        <Button variant="secondary" size="sm" type="button" onclick={addSlotRow}>
          Add slot
        </Button>
      </fieldset>
      <Input label="Model" bind:value={model} placeholder="e.g. gpt-4" />
    {:else if type === "skill"}
      <Textarea
        label="Instructions"
        bind:value={body}
        error={errors.body}
        required
      />
    {:else if type === "tool"}
      <Input
        label="URL"
        type="url"
        bind:value={url}
        error={errors.url}
        required
      />
    {:else if type === "resource"}
      <Input
        label="URL"
        type="url"
        bind:value={url}
        error={errors.url}
        required
      />
      <Select
        label="Resource type"
        bind:value={resourceType}
        options={RESOURCE_TYPE_OPTIONS}
        required
      />
    {/if}

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

  .asset-form__roles,
  .asset-form__slots {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .asset-form__roles legend,
  .asset-form__slots legend {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    padding-inline: var(--space-1);
  }

  .asset-form__roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: var(--space-2);
  }

  .asset-form__slot-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
    gap: var(--space-2);
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

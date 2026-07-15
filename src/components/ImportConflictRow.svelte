<script lang="ts">
  import type { ConflictResolution, ImportConflict } from "../lib/portability";

  interface Props {
    conflict: ImportConflict;
    resolution?: ConflictResolution;
  }

  let { conflict, resolution = $bindable(undefined) }: Props = $props();

  const autoId = $props.id();
  const groupName = `conflict-${autoId}`;

  const RESOLUTIONS: { value: ConflictResolution; label: string }[] = [
    { value: "keep-mine", label: "Keep mine" },
    { value: "keep-imported", label: "Keep imported" },
    { value: "keep-both", label: "Keep both" },
  ];

  const options = $derived(
    RESOLUTIONS.map((option) => ({
      ...option,
      id: `${groupName}-${option.value}`,
    })),
  );
</script>

<fieldset class="conflict-row">
  <legend class="conflict-row__title">{conflict.existing.title}</legend>

  <div class="conflict-row__compare">
    <div class="conflict-row__side">
      <span class="conflict-row__side-label">Mine</span>
      <p class="conflict-row__side-title">{conflict.existing.title}</p>
      {#if conflict.existing.description}
        <p class="conflict-row__side-description">
          {conflict.existing.description}
        </p>
      {/if}
    </div>
    <div class="conflict-row__side">
      <span class="conflict-row__side-label">Imported</span>
      <p class="conflict-row__side-title">{conflict.incoming.title}</p>
      {#if conflict.incoming.description}
        <p class="conflict-row__side-description">
          {conflict.incoming.description}
        </p>
      {/if}
    </div>
  </div>

  <div class="conflict-row__options">
    {#each options as option (option.value)}
      <span class="conflict-row__option">
        <input
          id={option.id}
          type="radio"
          name={groupName}
          value={option.value}
          checked={resolution === option.value}
          onchange={() => (resolution = option.value)}
        />
        <!-- biome-ignore lint/a11y/noLabelWithoutControl: label content is the dynamic `option.label`, associated via matching for/id -->
        <label for={option.id}>{option.label}</label>
      </span>
    {/each}
  </div>
</fieldset>

<style>
  .conflict-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .conflict-row__title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    padding-inline: var(--space-1);
  }

  .conflict-row__compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  .conflict-row__side {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .conflict-row__side-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .conflict-row__side-title {
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }

  .conflict-row__side-description {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .conflict-row__options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .conflict-row__option {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
    letter-spacing: var(--letter-spacing-body);
    color: var(--color-text);
  }

  .conflict-row__option input {
    appearance: none;
    -webkit-appearance: none;
    flex-shrink: 0;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    margin: 0;
    border: 1px solid var(--color-border-strong);
    border-radius: 50%;
    background-color: var(--color-surface);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .conflict-row__option input:hover {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
  }

  .conflict-row__option input:checked {
    border-color: var(--color-accent-solid);
    background-color: var(--color-surface);
    box-shadow: inset 0 0 0 0.275rem var(--color-accent-solid);
  }

  .conflict-row__option label {
    cursor: pointer;
  }
</style>

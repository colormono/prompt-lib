<script lang="ts">
  interface Props {
    label: string;
    checked?: boolean;
    id?: string;
    disabled?: boolean;
    help?: string;
  }

  let {
    label,
    checked = $bindable(false),
    id,
    disabled = false,
    help,
    ...rest
  }: Props = $props();

  const autoId = $props.id();
  const checkboxId = $derived(id ?? `checkbox-${autoId}`);
  const helpId = $derived(help ? `${checkboxId}-help` : undefined);
</script>

<div class="checkbox-field">
  <span class="checkbox-field__row">
    <input
      {...rest}
      id={checkboxId}
      type="checkbox"
      {disabled}
      bind:checked
      class="checkbox-field__control"
      aria-describedby={helpId}
    />
    <!-- biome-ignore lint/a11y/noLabelWithoutControl: label content is the dynamic `label` prop, associated via matching for/id -->
    <label class="checkbox-field__label" for={checkboxId}>{label}</label>
  </span>
  {#if help}
    <p class="checkbox-field__message" id={helpId}>{help}</p>
  {/if}
</div>

<style>
  .checkbox-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .checkbox-field__row {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  .checkbox-field__control {
    inline-size: 1.125rem;
    block-size: 1.125rem;
    accent-color: var(--color-accent);
  }

  .checkbox-field__control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox-field__label {
    font-size: var(--font-size-base);
    color: var(--color-text);
  }

  .checkbox-field__message {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    margin-inline-start: calc(1.125rem + var(--space-2));
  }
</style>

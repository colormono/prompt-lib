<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "type"> {
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
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    flex-shrink: 0;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    margin: 0;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .checkbox-field__control::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--color-text-on-brand);
    opacity: 0;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.2 5 8.7 9.5 3.5' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    mask-size: 0.75rem 0.75rem;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.2 5 8.7 9.5 3.5' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    -webkit-mask-size: 0.75rem 0.75rem;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
  }

  .checkbox-field__control:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
  }

  .checkbox-field__control:checked {
    border-color: var(--color-accent-solid);
    background-color: var(--color-accent-solid);
  }

  .checkbox-field__control:checked::after {
    opacity: 1;
  }

  .checkbox-field__control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox-field__label {
    font-size: var(--font-size-base);
    letter-spacing: var(--letter-spacing-body);
    color: var(--color-text);
    cursor: pointer;
  }

  .checkbox-field__control:disabled + .checkbox-field__label {
    cursor: not-allowed;
  }

  .checkbox-field__message {
    margin: 0;
    margin-inline-start: calc(1.125rem + var(--space-2));
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }
</style>

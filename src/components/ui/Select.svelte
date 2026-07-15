<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";

  interface SelectOption {
    value: string;
    label: string;
  }

  interface Props extends Omit<HTMLSelectAttributes, "value"> {
    label: string;
    value?: string;
    options: SelectOption[];
    id?: string;
    placeholder?: string;
    error?: string;
    help?: string;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    label,
    value = $bindable(""),
    options,
    id,
    placeholder,
    error,
    help,
    disabled = false,
    required = false,
    ...rest
  }: Props = $props();

  const autoId = $props.id();
  const selectId = $derived(id ?? `select-${autoId}`);
  const helpId = $derived(help ? `${selectId}-help` : undefined);
  const errorId = $derived(error ? `${selectId}-error` : undefined);
</script>

<div class="field">
  <!-- biome-ignore lint/a11y/noLabelWithoutControl: label content is the dynamic `label` prop, associated via matching for/id -->
  <label class="field__label" for={selectId}>
    {label}
    {#if required}<span class="field__required" aria-hidden="true">*</span
      >{/if}
  </label>
  <div class="field__control-wrap" class:field__control-wrap--disabled={disabled}>
    <select
      {...rest}
      id={selectId}
      {disabled}
      {required}
      bind:value
      class="field__control"
      class:field__control--error={!!error}
      aria-invalid={!!error}
      aria-describedby={errorId ?? helpId}
    >
      {#if placeholder}
        <option value="" disabled selected={value === ""}>{placeholder}</option>
      {/if}
      {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
  {#if error}
    <p class="field__message field__message--error" id={errorId}>{error}</p>
  {:else if help}
    <p class="field__message" id={helpId}>{help}</p>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field__label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.004em;
    color: var(--color-text);
  }

  .field__required {
    color: var(--color-danger);
    margin-inline-start: var(--space-1);
  }

  .field__control-wrap {
    position: relative;
  }

  .field__control-wrap::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: var(--space-3);
    inline-size: 0.75rem;
    block-size: 0.75rem;
    transform: translateY(-50%);
    background-color: var(--color-text-muted);
    pointer-events: none;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5 6 7.5 9 4.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5 6 7.5 9 4.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
  }

  .field__control-wrap--disabled::after {
    opacity: 0.5;
  }

  .field__control {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: var(--space-2) calc(var(--space-3) + 1.25rem) var(--space-2)
      var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-strong);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-base);
    font-family: inherit;
    letter-spacing: var(--letter-spacing-body);
    line-height: var(--line-height-normal);
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }

  .field__control:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
  }

  .field__control:focus {
    border-color: color-mix(in srgb, var(--color-ink) 28%, transparent);
  }

  .field__control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .field__control--error {
    border-color: var(--color-danger);
  }

  .field__message {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .field__message--error {
    color: var(--color-danger);
  }
</style>

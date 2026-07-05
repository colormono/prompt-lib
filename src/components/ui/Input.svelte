<script lang="ts">
  interface Props {
    label: string;
    value?: string;
    id?: string;
    type?: "text" | "email" | "password" | "search" | "url" | "number";
    placeholder?: string;
    error?: string;
    help?: string;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    label,
    value = $bindable(""),
    id,
    type = "text",
    placeholder,
    error,
    help,
    disabled = false,
    required = false,
    ...rest
  }: Props = $props();

  const autoId = $props.id();
  const inputId = $derived(id ?? `input-${autoId}`);
  const helpId = $derived(help ? `${inputId}-help` : undefined);
  const errorId = $derived(error ? `${inputId}-error` : undefined);
</script>

<div class="field">
  <!-- biome-ignore lint/a11y/noLabelWithoutControl: label content is the dynamic `label` prop, associated via matching for/id -->
  <label class="field__label" for={inputId}>
    {label}
    {#if required}<span class="field__required" aria-hidden="true">*</span
      >{/if}
  </label>
  <input
    {...rest}
    id={inputId}
    {type}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class="field__control"
    class:field__control--error={!!error}
    aria-invalid={!!error}
    aria-describedby={errorId ?? helpId}
  />
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
    color: var(--color-text);
  }

  .field__required {
    color: var(--color-danger);
    margin-inline-start: var(--space-1);
  }

  .field__control {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-strong);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-fast);
  }

  .field__control::placeholder {
    color: var(--color-text-muted);
  }

  .field__control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .field__control--error {
    border-color: var(--color-danger);
  }

  .field__message {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .field__message--error {
    color: var(--color-danger);
  }
</style>

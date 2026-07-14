<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "neutral" | "brand" | "success" | "warning" | "danger";
    children: Snippet;
  }

  let { variant = "neutral", children }: Props = $props();
</script>

<span class="badge badge--{variant}">
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2em 0.55em;
    border-radius: var(--radius-md);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    letter-spacing: 0;
  }

  /* Resource + role chips — ink on linen */
  .badge--neutral {
    background-color: var(--color-surface-raised);
    color: var(--color-text-secondary);
  }

  /* Prompt — ember on warm wash */
  .badge--brand {
    background-color: var(--color-accent-subtle);
    color: var(--color-accent);
  }

  /* Skill */
  .badge--success {
    background-color: var(--color-success-subtle);
    color: var(--color-success);
  }

  /* Tool */
  .badge--warning {
    background-color: var(--color-warning-subtle);
    color: var(--color-warning);
  }

  .badge--danger {
    background-color: var(--color-danger-subtle);
    color: var(--color-danger);
  }
</style>

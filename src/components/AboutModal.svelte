<script lang="ts">
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
  }

  let { open = $bindable(false) }: Props = $props();
</script>

<Modal bind:open title="About">
  <div class="about">
    <p>
      <strong>Colormo AI Prompt Manager</strong> is a personal catalog for the
      prompts, skills, tools, and resources used to get work done — one
      local-first library instead of scattered notes and chat histories.
    </p>
    <p>
      <a href="#style-guide">Design system style guide →</a>
    </p>
  </div>
</Modal>

<style>
  .about {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>

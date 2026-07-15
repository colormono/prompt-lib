<script lang="ts">
  import {
    DISCLAIMER_BODY,
    DISCLAIMER_TITLE,
    GITHUB_REPO_LABEL,
    GITHUB_REPO_URL,
  } from "../lib/disclaimer";
  import Modal from "./ui/Modal.svelte";

  interface Props {
    open: boolean;
  }

  let { open = $bindable(false) }: Props = $props();
</script>

<Modal bind:open title="About">
  <div class="about">
    <h3 class="about__title">{DISCLAIMER_TITLE}</h3>
    <p>{DISCLAIMER_BODY}</p>
    <p>
      <a
        class="about__repo"
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer">{GITHUB_REPO_LABEL}</a
      >
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
    max-width: 64ch;
    font-family: var(--font-family-editorial);
    font-size: 1.0625rem;
    line-height: var(--line-height-relaxed);
    color: var(--color-text);
  }

  .about__title {
    margin: 0;
    font-family: var(--font-family-base);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-title);
    line-height: var(--line-height-tight);
    text-wrap: balance;
  }

  .about p {
    margin: 0;
    text-wrap: pretty;
  }

  .about a {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .about a:hover {
    color: var(--color-accent-hover);
  }

  .about__repo {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    text-decoration: none;
  }

  .about__repo:hover {
    text-decoration: underline;
  }
</style>

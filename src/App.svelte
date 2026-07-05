<script lang="ts">
  import StyleGuide from "./components/dev/StyleGuide.svelte";

  const appTitle = "Colormo AI Prompt Manager";

  let hash = $state(window.location.hash);

  $effect(() => {
    const onHashChange = () => {
      hash = window.location.hash;
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  const showStyleGuide = $derived(hash === "#style-guide");
</script>

{#if showStyleGuide}
  <StyleGuide />
{:else}
  <main>
    <h1>{appTitle}</h1>
    <p data-testid="scaffold-marker">scaffold ready</p>
    <a class="dev-link" href="#style-guide">Design system style guide →</a>
  </main>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: var(--space-2);
    text-align: center;
  }

  .dev-link {
    margin-top: var(--space-4);
    font-size: var(--font-size-sm);
  }
</style>

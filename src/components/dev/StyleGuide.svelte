<script lang="ts">
  import { getInitialTheme, setTheme, type Theme } from "../../lib/theme";
  import Badge from "../ui/Badge.svelte";
  import Button from "../ui/Button.svelte";
  import Card from "../ui/Card.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import Input from "../ui/Input.svelte";
  import Modal from "../ui/Modal.svelte";
  import Select from "../ui/Select.svelte";
  import Textarea from "../ui/Textarea.svelte";

  let theme = $state<Theme>(getInitialTheme());

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    setTheme(theme);
  }

  const paletteSwatches = [
    { label: "parchment", cssVar: "--color-parchment" },
    { label: "bone", cssVar: "--color-bone" },
    { label: "linen", cssVar: "--color-linen" },
    { label: "stone", cssVar: "--color-stone" },
    { label: "mist", cssVar: "--color-mist" },
    { label: "driftwood", cssVar: "--color-driftwood" },
    { label: "ash", cssVar: "--color-ash" },
    { label: "ink", cssVar: "--color-ink" },
    { label: "ember", cssVar: "--color-ember" },
    { label: "amber", cssVar: "--color-amber" },
    { label: "forest", cssVar: "--color-forest" },
    { label: "verdant", cssVar: "--color-verdant" },
    { label: "crimson", cssVar: "--color-crimson" },
  ];

  const semanticSwatches = [
    { label: "success", cssVar: "--color-success" },
    { label: "success-subtle", cssVar: "--color-success-subtle" },
    { label: "warning", cssVar: "--color-warning" },
    { label: "warning-subtle", cssVar: "--color-warning-subtle" },
    { label: "danger", cssVar: "--color-danger" },
    { label: "danger-subtle", cssVar: "--color-danger-subtle" },
  ];

  const roleSwatches = [
    "bg",
    "bg-subtle",
    "surface",
    "surface-raised",
    "border",
    "border-strong",
    "text",
    "text-muted",
    "text-secondary",
    "accent",
    "accent-solid",
    "action",
    "success",
    "warning",
    "danger",
    "focus-ring",
  ].map((name) => ({ label: name, cssVar: `--color-${name}` }));

  const typeScale = ["xs", "sm", "base", "md", "lg", "xl"].map((step) => ({
    label: step,
    cssVar: `--font-size-${step}`,
  }));

  const spacingScale = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "8",
    "10",
    "12",
    "16",
  ].map((step) => ({ label: `space-${step}`, cssVar: `--space-${step}` }));

  const radiiScale = ["sm", "md", "lg"].map((step) => ({
    label: `radius-${step}`,
    cssVar: `--radius-${step}`,
  }));

  const shadowScale = ["sm", "md", "lg"].map((step) => ({
    label: `shadow-${step}`,
    cssVar: `--shadow-${step}`,
  }));

  const buttonVariants = [
    "primary",
    "secondary",
    "ghost",
    "action",
    "danger",
  ] as const;
  const buttonSizes = ["sm", "md", "lg"] as const;
  const badgeVariants = ["neutral", "brand", "success", "warning", "danger"] as const;

  const selectOptions = [
    { value: "prompt", label: "Prompt" },
    { value: "skill", label: "Skill" },
    { value: "tool", label: "Tool" },
    { value: "resource", label: "Resource" },
  ];

  let inputValue = $state("");
  let textareaValue = $state("");
  let selectValue = $state("");
  let checkboxChecked = $state(false);
  let modalOpen = $state(false);
</script>

<div class="style-guide">
  <header class="style-guide__header">
    <div>
      <h1>Design System Style Guide</h1>
      <p class="style-guide__subtitle">
        Internal reference for tokens and UI primitives. Not part of the
        shipped app shell — reach it at <code>#style-guide</code>.
      </p>
    </div>
    <Button variant="secondary" onclick={toggleTheme}>
      Switch to {theme === "light" ? "dark" : "light"} theme
    </Button>
  </header>

  <section class="style-guide__section">
    <h2>Colors — palette</h2>
    <div class="swatch-grid">
      {#each paletteSwatches as swatch (swatch.cssVar)}
        <div class="swatch">
          <span
            class="swatch__color"
            style="background-color: var({swatch.cssVar})"
          ></span>
          <span class="swatch__label">{swatch.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Colors — semantic</h2>
    <div class="swatch-grid">
      {#each semanticSwatches as swatch (swatch.cssVar)}
        <div class="swatch">
          <span
            class="swatch__color"
            style="background-color: var({swatch.cssVar})"
          ></span>
          <span class="swatch__label">{swatch.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Colors — semantic roles (theme-aware)</h2>
    <div class="swatch-grid">
      {#each roleSwatches as swatch (swatch.cssVar)}
        <div class="swatch">
          <span
            class="swatch__color swatch__color--bordered"
            style="background-color: var({swatch.cssVar})"
          ></span>
          <span class="swatch__label">{swatch.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Type scale</h2>
    <div class="type-scale">
      {#each typeScale as step (step.cssVar)}
        <p style="font-size: var({step.cssVar})">
          {step.label} — the quick brown fox
        </p>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Spacing</h2>
    <div class="spacing-scale">
      {#each spacingScale as step (step.cssVar)}
        <div class="spacing-row">
          <span class="spacing-row__label">{step.label}</span>
          <span
            class="spacing-row__bar"
            style="width: var({step.cssVar})"
          ></span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Radii</h2>
    <div class="swatch-grid">
      {#each radiiScale as step (step.cssVar)}
        <div class="swatch">
          <span
            class="swatch__color swatch__color--bordered"
            style="border-radius: var({step.cssVar})"
          ></span>
          <span class="swatch__label">{step.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Shadows</h2>
    <div class="swatch-grid">
      {#each shadowScale as step (step.cssVar)}
        <div class="swatch">
          <span
            class="swatch__color swatch__color--elevated"
            style="box-shadow: var({step.cssVar})"
          ></span>
          <span class="swatch__label">{step.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Button</h2>
    {#each buttonSizes as size (size)}
      <div class="row">
        {#each buttonVariants as variant (variant)}
          <Button {variant} {size}>{variant}</Button>
        {/each}
        <Button variant="primary" {size} disabled>disabled</Button>
      </div>
    {/each}
  </section>

  <section class="style-guide__section">
    <h2>Badge</h2>
    <div class="row">
      {#each badgeVariants as variant (variant)}
        <Badge {variant}>{variant}</Badge>
      {/each}
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Form primitives</h2>
    <div class="form-grid">
      <Input label="Title" placeholder="e.g. Corporate clairvoyant" bind:value={inputValue} />
      <Input
        label="Title (with error)"
        value="Untitled"
        error="Title is required"
      />
      <Textarea
        label="Description"
        placeholder="What does this asset do?"
        bind:value={textareaValue}
      />
      <Select
        label="Asset type"
        placeholder="Choose a type"
        options={selectOptions}
        bind:value={selectValue}
      />
      <Checkbox
        label="Favorite"
        help="Show this asset in the starred filter"
        bind:checked={checkboxChecked}
      />
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Card</h2>
    <div class="row">
      <Card>
        {#snippet header()}
          Card header
        {/snippet}
        <p>Card body content goes here.</p>
        {#snippet footer()}
          <Button variant="ghost" size="sm">Footer action</Button>
        {/snippet}
      </Card>
    </div>
  </section>

  <section class="style-guide__section">
    <h2>Modal</h2>
    <Button onclick={() => (modalOpen = true)}>Open modal</Button>
    <Modal bind:open={modalOpen} title="Example modal">
      <p>
        This dialog traps focus, closes on <kbd>Escape</kbd> or a backdrop click,
        and returns focus to the trigger button.
      </p>
      {#snippet footer()}
        <Button variant="secondary" onclick={() => (modalOpen = false)}
          >Cancel</Button
        >
        <Button onclick={() => (modalOpen = false)}>Confirm</Button>
      {/snippet}
    </Modal>
  </section>
</div>

<style>
  .style-guide {
    max-width: 64rem;
    margin: 0 auto;
    padding: var(--space-8) var(--space-4) var(--space-16);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .style-guide__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .style-guide__subtitle {
    color: var(--color-text-muted);
    margin-top: var(--space-1);
  }

  .style-guide__subtitle code {
    font-family: var(--font-family-mono);
    background-color: var(--color-bg-subtle);
    padding: 0 var(--space-1);
    border-radius: var(--radius-sm);
  }

  .style-guide__section h2 {
    margin-bottom: var(--space-3);
    font-size: var(--font-size-md);
  }

  .swatch-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    width: 5.5rem;
  }

  .swatch__color {
    inline-size: 3.5rem;
    block-size: 3.5rem;
    border-radius: var(--radius-md);
  }

  .swatch__color--bordered {
    border: 1px solid var(--color-border);
  }

  .swatch__color--elevated {
    background-color: var(--color-surface);
  }

  .swatch__label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    text-align: center;
    word-break: break-word;
  }

  .type-scale {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .spacing-scale {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .spacing-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .spacing-row__label {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    width: 5rem;
    flex-shrink: 0;
  }

  .spacing-row__bar {
    block-size: var(--space-3);
    background-color: var(--color-accent);
    border-radius: var(--radius-sm);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--space-4);
    max-width: 40rem;
  }
</style>

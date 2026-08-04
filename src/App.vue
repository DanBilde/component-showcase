<script setup lang="ts">
import BaseButton from './components/BaseButton.vue'
import BaseBadge from './components/BaseBadge.vue'
import BaseAvatar from './components/BaseAvatar.vue'
import BaseStat from './components/BaseStat.vue'
import BaseCard from './components/BaseCard.vue'
import TheShowcase from './landing/TheShowcase.vue'
import { useTheme } from './composables/useTheme'

const { theme, toggle } = useTheme()

// In production Storybook is served at /storybook/; in `npm run dev` it runs
// separately on :6006, so point there for a working local link.
const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006/' : '/storybook/'
const repoUrl = 'https://github.com/DanBilde/component-showcase'
const year = 2026

// Deep-link to a component's autodocs page. Stories are titled `Components/BaseX`,
// so Storybook's autodocs id is `components-basex--docs`.
const storyUrl = (component: string) =>
  `${storybookUrl}?path=/docs/components-${component.toLowerCase()}--docs`

const stats = [
  { value: '43', label: 'Components' },
  { value: '100%', label: 'TypeScript' },
  { value: 'A11y', label: 'Keyboard & ARIA' },
  { value: '0', label: 'Runtime deps' },
]

// `lead` is the representative component the category card deep-links into.
const categories = [
  { name: 'Form controls', count: 9, lead: 'BaseInput', blurb: 'Input, Textarea, Select, MultiSelect, Radio, Checkbox, Switch, Slider, ChipInput.' },
  { name: 'Overlays', count: 5, lead: 'BaseModal', blurb: 'Modal, Tooltip, Popover, Menu, Command palette.' },
  { name: 'Feedback', count: 6, lead: 'BaseProgress', blurb: 'Spinner, Progress, Skeleton, Notification, Toast, Alert banner.' },
  { name: 'Navigation', count: 5, lead: 'BaseTabs', blurb: 'Tabs, Breadcrumbs, Pagination, Stepper, Accordion.' },
  { name: 'Data display', count: 10, lead: 'BaseCard', blurb: 'Card, Stat, List, DescriptionList, Badge, Tag, Avatar, Timeline, Tree view.' },
  { name: 'Dates', count: 2, lead: 'BaseCalendar', blurb: 'Calendar and a composed Datepicker (input + popover).' },
]
</script>

<template>
  <div class="min-h-screen bg-canvas text-fg">
    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-border-muted bg-canvas/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold text-fg">
          <span class="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-sm text-brand-on">C</span>
          Component Showcase
        </a>
        <nav class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-pressed="theme === 'dark'"
            @click="toggle"
          >
            <!-- Sun (shown in dark mode → click for light) -->
            <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <!-- Moon (shown in light mode → click for dark) -->
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <BaseButton variant="ghost" size="sm" :href="storybookUrl">Components</BaseButton>
          <BaseButton variant="secondary" size="sm" :href="repoUrl" target="_blank" rel="noopener">GitHub ↗</BaseButton>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
      <div class="flex flex-col items-start gap-6">
        <BaseBadge variant="brand" appearance="subtle">Vue 3 · TypeScript · Tailwind v4</BaseBadge>
        <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          A hand-built Vue&nbsp;component library,
          <span class="bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
            documented in Storybook.
          </span>
        </h1>
        <p class="max-w-2xl text-lg text-fg-muted">
          43 accessible, presentational components — each written from scratch as a clean,
          generic building block. Props in, UI out. Keyboard and screen-reader support built in.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton size="lg" :href="storybookUrl">Browse components →</BaseButton>
          <BaseButton variant="secondary" size="lg" :href="repoUrl" target="_blank" rel="noopener">View source</BaseButton>
        </div>
        <div class="flex items-center gap-3 pt-2">
          <BaseAvatar src="/avatar.jpg" name="Mihai Bilde" size="md" />
          <div class="text-sm leading-tight">
            <div class="text-fg-subtle">Built by</div>
            <div class="font-medium text-fg">Mihai Bilde</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <BaseCard v-for="s in stats" :key="s.label" variant="filled" padding="md">
          <BaseStat :label="s.label" :value="s.value" />
        </BaseCard>
      </div>
    </section>

    <!-- Live showcase -->
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-fg">See them in action</h2>
        <p class="mt-1 text-fg-muted">A live sampler — every widget below is a real component from the library.</p>
      </div>
      <TheShowcase />
    </section>

    <!-- Categories -->
    <section class="border-t border-border-muted bg-surface-muted">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 class="mb-6 text-2xl font-semibold text-fg">Everything you need</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="c in categories"
            :key="c.name"
            :href="storyUrl(c.lead)"
            class="group block rounded-[var(--radius)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <BaseCard class="h-full transition group-hover:border-brand group-hover:shadow-md">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold text-fg group-hover:text-brand">{{ c.name }}</h3>
                <BaseBadge variant="neutral">{{ c.count }}</BaseBadge>
              </div>
              <p class="mt-1 text-sm text-fg-muted">{{ c.blurb }}</p>
              <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Open in Storybook
                <span class="transition group-hover:translate-x-0.5">→</span>
              </span>
            </BaseCard>
          </a>
        </div>
        <div class="mt-8">
          <BaseButton :href="storybookUrl">Explore the full docs →</BaseButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border-muted">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-3">
          <BaseAvatar src="/avatar.jpg" name="Mihai Bilde" size="sm" />
          <div class="text-sm text-fg-subtle">
            Built by <span class="font-medium text-fg-muted">Mihai Bilde</span> · written from
            scratch, free of any employer assets.
          </div>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <a :href="storybookUrl" class="text-fg-muted hover:text-fg">Storybook</a>
          <a :href="repoUrl" target="_blank" rel="noopener" class="text-fg-muted hover:text-fg">GitHub</a>
          <span class="text-fg-subtle">© {{ year }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

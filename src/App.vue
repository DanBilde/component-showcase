<script setup lang="ts">
import BaseButton from './components/BaseButton.vue'
import BaseBadge from './components/BaseBadge.vue'
import BaseAvatar from './components/BaseAvatar.vue'
import BaseStat from './components/BaseStat.vue'
import BaseCard from './components/BaseCard.vue'
import TheShowcase from './landing/TheShowcase.vue'

// In production Storybook is served at /storybook/; in `npm run dev` it runs
// separately on :6006, so point there for a working local link.
const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006/' : '/storybook/'
const repoUrl = 'https://github.com/DanBilde/component-showcase'
const year = 2026

const stats = [
  { value: '43', label: 'Components' },
  { value: '100%', label: 'TypeScript' },
  { value: 'A11y', label: 'Keyboard & ARIA' },
  { value: '0', label: 'Runtime deps' },
]

const categories = [
  { name: 'Form controls', count: 9, blurb: 'Input, Textarea, Select, MultiSelect, Radio, Checkbox, Switch, Slider, ChipInput.' },
  { name: 'Overlays', count: 5, blurb: 'Modal, Tooltip, Popover, Menu, Command palette.' },
  { name: 'Feedback', count: 6, blurb: 'Spinner, Progress, Skeleton, Notification, Toast, Alert banner.' },
  { name: 'Navigation', count: 5, blurb: 'Tabs, Breadcrumbs, Pagination, Stepper, Accordion.' },
  { name: 'Data display', count: 10, blurb: 'Card, Stat, List, DescriptionList, Badge, Tag, Avatar, Timeline, Tree view.' },
  { name: 'Dates', count: 2, blurb: 'Calendar and a composed Datepicker (input + popover).' },
]
</script>

<template>
  <div class="min-h-screen bg-white text-slate-800">
    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold text-slate-900">
          <span class="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-brand)] text-sm text-white">C</span>
          Component Showcase
        </a>
        <nav class="flex items-center gap-2">
          <BaseButton variant="ghost" size="sm" :href="storybookUrl">Components</BaseButton>
          <BaseButton variant="secondary" size="sm" :href="repoUrl" target="_blank" rel="noopener">GitHub ↗</BaseButton>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
      <div class="flex flex-col items-start gap-6">
        <BaseBadge variant="brand" appearance="subtle">Vue 3 · TypeScript · Tailwind v4</BaseBadge>
        <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          A hand-built Vue&nbsp;component library,
          <span class="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-hover)] bg-clip-text text-transparent">
            documented in Storybook.
          </span>
        </h1>
        <p class="max-w-2xl text-lg text-slate-600">
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
            <div class="text-slate-500">Built by</div>
            <div class="font-medium text-slate-900">Mihai Bilde</div>
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
        <h2 class="text-2xl font-semibold text-slate-900">See them in action</h2>
        <p class="mt-1 text-slate-600">A live sampler — every widget below is a real component from the library.</p>
      </div>
      <TheShowcase />
    </section>

    <!-- Categories -->
    <section class="border-t border-slate-100 bg-slate-50">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 class="mb-6 text-2xl font-semibold text-slate-900">Everything you need</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BaseCard v-for="c in categories" :key="c.name">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-semibold text-slate-900">{{ c.name }}</h3>
              <BaseBadge variant="neutral">{{ c.count }}</BaseBadge>
            </div>
            <p class="mt-1 text-sm text-slate-600">{{ c.blurb }}</p>
          </BaseCard>
        </div>
        <div class="mt-8">
          <BaseButton :href="storybookUrl">Explore the full docs →</BaseButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-100">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-3">
          <BaseAvatar src="/avatar.jpg" name="Mihai Bilde" size="sm" />
          <div class="text-sm text-slate-500">
            Built by <span class="font-medium text-slate-700">Mihai Bilde</span> · written from
            scratch, free of any employer assets.
          </div>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <a :href="storybookUrl" class="text-slate-600 hover:text-slate-900">Storybook</a>
          <a :href="repoUrl" target="_blank" rel="noopener" class="text-slate-600 hover:text-slate-900">GitHub</a>
          <span class="text-slate-400">© {{ year }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

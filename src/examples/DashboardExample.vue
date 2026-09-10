<script setup lang="ts">
/**
 * A composed example screen — not a library component.
 *
 * Its job is to show the Base* components working together on a realistic
 * page: an internal "Ops Console" launcher with KPIs, a tool grid, an
 * activity feed and a service-status panel. All data is dummy (see
 * `dashboardData.ts`) and the domain is invented.
 */
import { computed, ref } from 'vue'

import BaseAvatar from '../components/BaseAvatar.vue'
import BaseBadge from '../components/BaseBadge.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseCard from '../components/BaseCard.vue'
import BaseDivider from '../components/BaseDivider.vue'
import BaseProgress from '../components/BaseProgress.vue'
import BaseSegmentedControl from '../components/BaseSegmentedControl.vue'
import BaseStat from '../components/BaseStat.vue'
import BaseTimeline from '../components/BaseTimeline.vue'
import BaseToast from '../components/BaseToast.vue'

import { ACTIVITY, EXTERNAL_TOOLS, KPIS, RANGES, SERVICES, TOOLS, type Range } from './dashboardData'

const range = ref<Range>('7d')
const kpis = computed(() => KPIS[range.value])

// Greeting follows the real clock, so the example never looks stale.
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5) return 'Working late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

type Toast = { id: number; variant: 'info'; message: string }
const toasts = ref<Toast[]>([])
let toastId = 0

function openTool(title: string) {
  toasts.value.push({ id: ++toastId, variant: 'info', message: `Opening ${title}…` })
}
function dismissToast(id: string | number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Inline paths keep the example self-contained (no icon dependency).
const ICON_PATHS: Record<string, string> = {
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8',
  image: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M21 15l-5-5L5 21',
  chart: 'M3 3v18h18M7 16V10M12 16V6M17 16v-4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  card: 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8">
    <!-- Greeting + range filter -->
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex items-center gap-3">
        <BaseAvatar name="Mihai Bilde" size="lg" ring />
        <div>
          <h1 class="text-2xl font-semibold text-fg">{{ greeting }}, Mihai</h1>
          <p class="mt-0.5 text-sm text-fg-muted">
            {{ TOOLS.length }} tools at your disposal. Jump straight into the one you need.
          </p>
        </div>
      </div>
      <BaseSegmentedControl v-model="range" :options="RANGES" size="sm" aria-label="Reporting range" />
    </header>

    <!-- KPI row -->
    <section aria-label="Key metrics">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BaseCard v-for="kpi in kpis" :key="kpi.label" variant="outlined" padding="md">
          <BaseStat
            :label="kpi.label"
            :value="kpi.value"
            :delta="kpi.delta"
            delta-suffix="%"
            :delta-label="kpi.deltaLabel"
            :positive-is-good="kpi.positiveIsGood ?? true"
          />
        </BaseCard>
      </div>
    </section>

    <!-- Tool launcher -->
    <section aria-labelledby="tools-heading">
      <div class="mb-3 flex items-baseline justify-between">
        <h2 id="tools-heading" class="text-sm font-semibold tracking-wide text-fg-muted uppercase">
          Platform tools
        </h2>
        <span class="text-sm text-fg-subtle">{{ TOOLS.length }} tools</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="tool in TOOLS"
          :key="tool.title"
          type="button"
          class="rounded-xl text-left transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
          @click="openTool(tool.title)"
        >
          <BaseCard variant="outlined" padding="md" centered class="h-full">
            <template #icon>
              <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path :d="ICON_PATHS[tool.icon]" />
              </svg>
            </template>
            <template #header>
              <div class="flex items-center justify-center gap-2">
                <h3 class="font-semibold text-fg">{{ tool.title }}</h3>
                <BaseBadge v-if="tool.badge" variant="brand" size="sm">{{ tool.badge }}</BaseBadge>
              </div>
            </template>
            <p class="text-center">{{ tool.description }}</p>
          </BaseCard>
        </button>
      </div>
    </section>

    <!-- Activity + service status -->
    <section class="grid gap-4 lg:grid-cols-2" aria-label="Activity and status">
      <BaseCard variant="outlined" padding="md" title="Recent activity">
        <BaseTimeline :items="ACTIVITY" class="mt-2" />
      </BaseCard>

      <BaseCard variant="outlined" padding="md" title="Service status">
        <ul class="mt-2 flex flex-col gap-4">
          <li v-for="(svc, i) in SERVICES" :key="svc.name">
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-fg">{{ svc.name }}</span>
              <BaseBadge :variant="svc.variant" size="sm" dot>{{ svc.status }}</BaseBadge>
            </div>
            <BaseProgress
              :value="svc.uptime"
              :variant="svc.variant === 'warning' ? 'warning' : 'success'"
              size="sm"
              :label="`${svc.uptime}% uptime`"
            />
            <BaseDivider v-if="i < SERVICES.length - 1" spacing="none" class="mt-4" />
          </li>
        </ul>
      </BaseCard>
    </section>

    <!-- External links -->
    <section aria-labelledby="other-heading">
      <h2 id="other-heading" class="mb-3 text-sm font-semibold tracking-wide text-fg-muted uppercase">
        Other tools
      </h2>
      <div class="flex flex-wrap gap-2">
        <BaseButton v-for="label in EXTERNAL_TOOLS" :key="label" variant="secondary" size="sm">
          {{ label }}
          <template #iconRight>
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </template>
        </BaseButton>
      </div>
    </section>

    <BaseToast :toasts="toasts" position="bottom-right" @dismiss="dismissToast" />
  </div>
</template>

<script setup lang="ts">
type Variant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export interface TimelineItem {
  title: string
  description?: string
  /** Small meta line above the title (e.g. a time or date) */
  time?: string
  variant?: Variant
}

const props = withDefaults(
  defineProps<{
    items?: TimelineItem[]
  }>(),
  {
    items: () => [],
  },
)

const dotColor: Record<Variant, string> = {
  neutral: 'bg-surface-strong',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const isLast = (index: number) => index === props.items.length - 1
</script>

<template>
  <ol class="flex flex-col">
    <li v-for="(item, index) in items" :key="index" class="flex gap-3">
      <!-- Marker + connecting line (line flex-grows to fill the gap to the next dot) -->
      <div class="flex flex-col items-center">
        <slot name="marker" :item="item" :index="index">
          <span
            :class="[
              'mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-surface',
              dotColor[item.variant ?? 'neutral'],
            ]"
          />
        </slot>
        <span v-if="!isLast(index)" class="mt-1 w-px flex-1 bg-border" />
      </div>

      <div :class="['flex-1', isLast(index) ? '' : 'pb-6']">
        <div v-if="item.time" class="text-xs font-medium text-fg-subtle">{{ item.time }}</div>
        <div class="font-medium text-fg">{{ item.title }}</div>
        <div v-if="item.description" class="mt-0.5 text-sm text-fg-muted">
          {{ item.description }}
        </div>
        <slot name="content" :item="item" :index="index" />
      </div>
    </li>
  </ol>
</template>

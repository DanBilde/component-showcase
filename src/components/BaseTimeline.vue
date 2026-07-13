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
  neutral: 'bg-slate-300',
  brand: 'bg-[var(--color-brand)]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
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
              'mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white',
              dotColor[item.variant ?? 'neutral'],
            ]"
          />
        </slot>
        <span v-if="!isLast(index)" class="mt-1 w-px flex-1 bg-slate-200" />
      </div>

      <div :class="['flex-1', isLast(index) ? '' : 'pb-6']">
        <div v-if="item.time" class="text-xs font-medium text-slate-400">{{ item.time }}</div>
        <div class="font-medium text-slate-900">{{ item.title }}</div>
        <div v-if="item.description" class="mt-0.5 text-sm text-slate-600">
          {{ item.description }}
        </div>
        <slot name="content" :item="item" :index="index" />
      </div>
    </li>
  </ol>
</template>

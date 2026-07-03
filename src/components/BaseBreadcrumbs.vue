<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md'
type Value = string | number

export interface BreadcrumbItem {
  label: string
  href?: string
  /** Marks the current page (defaults to the last item) */
  current?: boolean
}

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    /** Separator character between crumbs (overridden by the `separator` slot) */
    separator?: string
    /** Collapse the middle into an ellipsis when there are more than this many items */
    maxItems?: number
    size?: Size
    ariaLabel?: string
  }>(),
  {
    separator: '/',
    size: 'md',
    ariaLabel: 'Breadcrumb',
  },
)

const emit = defineEmits<{ select: [item: BreadcrumbItem, event: MouseEvent] }>()

const isCurrent = (item: BreadcrumbItem, index: number) =>
  item.current ?? index === props.items.length - 1

type Entry = { ellipsis: true } | { ellipsis?: false; item: BreadcrumbItem; current: boolean }

// Collapse the middle to a single ellipsis once the trail exceeds maxItems.
const entries = computed<Entry[]>(() => {
  const { items, maxItems } = props
  const mapped = (item: BreadcrumbItem, index: number): Entry => ({
    item,
    current: isCurrent(item, index),
  })

  if (!maxItems || maxItems < 2 || items.length <= maxItems) {
    return items.map(mapped)
  }

  const tailCount = maxItems - 1
  const tailStart = items.length - tailCount
  return [
    mapped(items[0], 0),
    { ellipsis: true },
    ...items.slice(tailStart).map((item, i) => mapped(item, tailStart + i)),
  ]
})

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs gap-1.5',
  md: 'text-sm gap-2',
}

const linkClasses =
  'rounded text-slate-500 transition-colors hover:text-slate-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]'

function onSelect(item: BreadcrumbItem, event: MouseEvent) {
  emit('select', item, event)
}

// Stable keys for the v-for (ellipsis has no item).
const keyFor = (entry: Entry, index: number): Value =>
  entry.ellipsis ? `ellipsis-${index}` : entry.item.href ?? entry.item.label
</script>

<template>
  <nav :aria-label="ariaLabel">
    <ol :class="['flex flex-wrap items-center', sizeClasses[size]]">
      <li
        v-for="(entry, i) in entries"
        :key="keyFor(entry, i)"
        class="inline-flex items-center"
        :class="sizeClasses[size]"
      >
        <span v-if="entry.ellipsis" class="px-0.5 text-slate-400" aria-hidden="true">…</span>

        <span
          v-else-if="entry.current"
          class="font-medium text-slate-700"
          aria-current="page"
        >
          {{ entry.item.label }}
        </span>

        <a
          v-else-if="entry.item.href"
          :href="entry.item.href"
          :class="linkClasses"
          @click="onSelect(entry.item, $event)"
        >
          {{ entry.item.label }}
        </a>

        <button
          v-else
          type="button"
          :class="linkClasses"
          @click="onSelect(entry.item, $event)"
        >
          {{ entry.item.label }}
        </button>

        <span
          v-if="i < entries.length - 1"
          class="text-slate-400 select-none"
          aria-hidden="true"
        >
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

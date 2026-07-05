<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Entry = number | 'left-dots' | 'right-dots'

const props = withDefaults(
  defineProps<{
    /** v-model — current page (1-based) */
    modelValue?: number
    /** Total item count (with `pageSize`) — ignored if `pageCount` is set */
    total?: number
    pageSize?: number
    /** Explicit page count (overrides total / pageSize) */
    pageCount?: number
    /** Page numbers shown on each side of the current page */
    siblingCount?: number
    size?: Size
    /** Show jump-to-first / jump-to-last buttons */
    showEdges?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: 1,
    pageSize: 10,
    siblingCount: 1,
    size: 'md',
    showEdges: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const pageCount = computed(() => {
  if (props.pageCount != null) return Math.max(1, props.pageCount)
  if (props.total != null) return Math.max(1, Math.ceil(props.total / props.pageSize))
  return 1
})

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

// Build the page list with ellipsis markers where the range is truncated.
const entries = computed<Entry[]>(() => {
  const total = pageCount.value
  const current = Math.min(Math.max(props.modelValue, 1), total)
  const sibling = props.siblingCount

  // first + last + current + 2 ellipsis + siblings on both sides
  const totalToShow = sibling * 2 + 5
  if (totalToShow >= total) return range(1, total)

  const leftSibling = Math.max(current - sibling, 1)
  const rightSibling = Math.min(current + sibling, total)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < total - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, sibling * 2 + 3), 'right-dots', total]
  }
  if (showLeftDots && !showRightDots) {
    return [1, 'left-dots', ...range(total - (sibling * 2 + 2), total)]
  }
  return [1, 'left-dots', ...range(leftSibling, rightSibling), 'right-dots', total]
})

function goTo(page: number) {
  if (props.disabled) return
  const next = Math.min(Math.max(page, 1), pageCount.value)
  if (next === props.modelValue) return
  emit('update:modelValue', next)
  emit('change', next)
}

const atStart = computed(() => props.modelValue <= 1)
const atEnd = computed(() => props.modelValue >= pageCount.value)

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 min-w-8 text-sm',
  md: 'h-9 min-w-9 text-sm',
  lg: 'h-11 min-w-11 text-base',
}

const baseButton =
  'inline-flex items-center justify-center rounded-[var(--radius)] border px-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50'

function pageButtonClasses(active: boolean) {
  return [
    baseButton,
    sizeClasses[props.size],
    active
      ? 'border-[var(--color-brand)] bg-[var(--color-brand)] font-medium text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ]
}

const navButtonClasses = computed(() => [
  baseButton,
  sizeClasses[props.size],
  'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
])
</script>

<template>
  <nav aria-label="Pagination">
    <ul class="flex items-center gap-1">
      <li v-if="showEdges">
        <button
          type="button"
          :class="navButtonClasses"
          :disabled="disabled || atStart"
          aria-label="First page"
          @click="goTo(1)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 6l-6 6 6 6M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>

      <li>
        <button
          type="button"
          :class="navButtonClasses"
          :disabled="disabled || atStart"
          aria-label="Previous page"
          @click="goTo(modelValue - 1)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>

      <li v-for="entry in entries" :key="entry">
        <span
          v-if="entry === 'left-dots' || entry === 'right-dots'"
          :class="['inline-flex items-center justify-center text-slate-400', sizeClasses[size]]"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :class="pageButtonClasses(entry === modelValue)"
          :disabled="disabled"
          :aria-current="entry === modelValue ? 'page' : undefined"
          :aria-label="`Page ${entry}`"
          @click="goTo(entry)"
        >
          {{ entry }}
        </button>
      </li>

      <li>
        <button
          type="button"
          :class="navButtonClasses"
          :disabled="disabled || atEnd"
          aria-label="Next page"
          @click="goTo(modelValue + 1)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>

      <li v-if="showEdges">
        <button
          type="button"
          :class="navButtonClasses"
          :disabled="disabled || atEnd"
          aria-label="Last page"
          @click="goTo(pageCount)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 6l6 6-6 6M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

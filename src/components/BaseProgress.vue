<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

const props = withDefaults(
  defineProps<{
    /** Current value (ignored when indeterminate) */
    value?: number
    max?: number
    /** Animated bar for unknown-duration work */
    indeterminate?: boolean
    size?: Size
    variant?: Variant
    /** Optional label shown above the bar */
    label?: string
    /** Show the percentage on the right of the label row */
    showValue?: boolean
  }>(),
  {
    value: 0,
    max: 100,
    indeterminate: false,
    size: 'md',
    variant: 'brand',
    showValue: false,
  },
)

const pct = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const showHeader = computed(() => Boolean(props.label) || props.showValue)

const trackSize: Record<Size, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const variantColor: Record<Variant, string> = {
  brand: 'bg-[var(--color-brand)]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-slate-500',
}
</script>

<template>
  <div>
    <div
      v-if="showHeader"
      class="mb-1 flex items-center justify-between text-sm text-slate-600"
    >
      <span>{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="tabular-nums text-slate-500">
        {{ Math.round(pct) }}%
      </span>
    </div>

    <div
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-label="label || undefined"
      :class="['relative w-full overflow-hidden rounded-full bg-slate-200', trackSize[size]]"
    >
      <div
        v-if="!indeterminate"
        :class="['h-full rounded-full transition-[width] duration-300 ease-out', variantColor[variant]]"
        :style="{ width: pct + '%' }"
      />
      <div
        v-else
        :class="['bar-indeterminate h-full w-2/5 rounded-full', variantColor[variant]]"
      />
    </div>
  </div>
</template>

<style scoped>
.bar-indeterminate {
  animation: progress-indeterminate 1.2s infinite linear;
}

@keyframes progress-indeterminate {
  0% {
    margin-left: -40%;
  }
  100% {
    margin-left: 100%;
  }
}
</style>

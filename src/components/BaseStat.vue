<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Trend = 'up' | 'down' | 'neutral'

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    /** Change indicator; a number gets a sign, a string is shown as-is */
    delta?: string | number
    /** Appended to a numeric delta (e.g. "%") */
    deltaSuffix?: string
    /** Secondary text after the delta (e.g. "vs last month") */
    deltaLabel?: string
    /** Trend direction; auto-derived from a numeric delta when omitted */
    trend?: Trend
    /** Whether an "up" trend is good (green). Set false for metrics like churn. */
    positiveIsGood?: boolean
    size?: Size
  }>(),
  {
    positiveIsGood: true,
    size: 'md',
  },
)

const trend = computed<Trend>(() => {
  if (props.trend) return props.trend
  if (typeof props.delta === 'number') {
    return props.delta > 0 ? 'up' : props.delta < 0 ? 'down' : 'neutral'
  }
  return 'neutral'
})

const deltaColor = computed(() => {
  if (trend.value === 'neutral') return 'text-slate-500'
  const good = trend.value === 'up' ? props.positiveIsGood : !props.positiveIsGood
  return good ? 'text-green-600' : 'text-red-600'
})

const formattedDelta = computed(() => {
  if (props.delta == null) return ''
  if (typeof props.delta === 'number') {
    const sign = props.delta > 0 ? '+' : ''
    return `${sign}${props.delta}${props.deltaSuffix ?? ''}`
  }
  return String(props.delta)
})

const valueSize: Record<Size, string> = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
}

const hasDelta = computed(() => props.delta != null || Boolean(props.deltaLabel))
</script>

<template>
  <div>
    <div class="flex items-start justify-between gap-2">
      <span v-if="label" class="text-sm font-medium text-slate-500">{{ label }}</span>
      <span v-if="$slots.icon" class="shrink-0 text-slate-400">
        <slot name="icon" />
      </span>
    </div>

    <div :class="['mt-1 font-semibold tracking-tight text-slate-900', valueSize[size]]">
      <slot name="value">{{ value }}</slot>
    </div>

    <div v-if="hasDelta" class="mt-1 flex items-center gap-1.5 text-sm">
      <span :class="['inline-flex items-center gap-0.5 font-medium', deltaColor]">
        <svg
          v-if="trend !== 'neutral'"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            :d="trend === 'up' ? 'M12 19V5M6 11l6-6 6 6' : 'M12 5v14M6 13l6 6 6-6'"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ formattedDelta }}
      </span>
      <span v-if="deltaLabel" class="text-slate-400">{{ deltaLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Variant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
type Appearance = 'subtle' | 'solid'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    appearance?: Appearance
    size?: Size
    /** Show a status dot (leading when there's content, standalone otherwise) */
    dot?: boolean
  }>(),
  {
    variant: 'neutral',
    appearance: 'subtle',
    size: 'md',
    dot: false,
  },
)

const slots = useSlots()
const hasContent = computed(() => Boolean(slots.default))

const subtleClasses: Record<Variant, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-red-100 text-red-800',
}

const solidClasses: Record<Variant, string> = {
  neutral: 'bg-slate-600 text-white',
  brand: 'bg-[var(--color-brand)] text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  danger: 'bg-red-600 text-white',
}

const strongColor: Record<Variant, string> = {
  neutral: 'bg-slate-500',
  brand: 'bg-[var(--color-brand)]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-[11px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-0.5 gap-1.5',
}

const dotSize: Record<Size, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
}

const badgeClasses = computed(() => [
  'inline-flex items-center whitespace-nowrap rounded-full font-medium',
  props.appearance === 'solid'
    ? solidClasses[props.variant]
    : subtleClasses[props.variant],
  sizeClasses[props.size],
])

const dotColor = computed(() =>
  props.appearance === 'solid' ? 'bg-white' : strongColor[props.variant],
)
</script>

<template>
  <span
    v-if="dot && !hasContent"
    :class="['inline-block shrink-0 rounded-full', dotSize[size], strongColor[variant]]"
  />
  <span v-else :class="badgeClasses">
    <span
      v-if="dot"
      :class="['shrink-0 rounded-full', dotSize[size], dotColor]"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>

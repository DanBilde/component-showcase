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
  neutral: 'bg-surface-sunken text-fg-muted',
  brand: 'bg-brand-soft text-brand-fg',
  success: 'bg-success-soft text-success-fg',
  warning: 'bg-warning-soft text-warning-fg',
  danger: 'bg-danger-soft text-danger-fg',
}

const solidClasses: Record<Variant, string> = {
  neutral: 'bg-inverse text-inverse-fg',
  brand: 'bg-brand text-brand-on',
  success: 'bg-success text-success-on',
  warning: 'bg-warning text-warning-on',
  danger: 'bg-danger text-danger-on',
}

const strongColor: Record<Variant, string> = {
  neutral: 'bg-fg-subtle',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
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

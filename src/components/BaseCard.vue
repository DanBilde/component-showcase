<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Variant = 'outlined' | 'elevated' | 'filled'
type Padding = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    padding?: Padding
    /** Convenience header (or use the `header` slot) */
    title?: string
    subtitle?: string
    /** Center the icon, header, and body — the "feature card" layout */
    centered?: boolean
  }>(),
  {
    variant: 'outlined',
    padding: 'md',
    centered: false,
  },
)

const slots = useSlots()

const variantClasses: Record<Variant, string> = {
  outlined: 'border border-border bg-surface',
  elevated: 'bg-surface shadow-md',
  filled: 'border border-border-muted bg-surface-muted',
}

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

const cardClasses = computed(() => [
  'rounded-[var(--radius)] overflow-hidden',
  variantClasses[props.variant],
  paddingClasses[props.padding],
  props.centered ? 'text-center' : '',
])

const hasHeader = computed(() => Boolean(slots.header) || Boolean(props.title) || Boolean(props.subtitle))
</script>

<template>
  <div :class="cardClasses">
    <div
      v-if="$slots.icon"
      :class="[
        'mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken text-brand',
        centered ? 'mx-auto' : '',
      ]"
    >
      <slot name="icon" />
    </div>

    <div v-if="hasHeader" :class="$slots.default ? 'mb-2' : ''">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-fg">{{ title }}</h3>
        <p v-if="subtitle" class="mt-1 text-sm text-fg-subtle">{{ subtitle }}</p>
      </slot>
    </div>

    <div v-if="$slots.default" class="text-sm text-fg-muted">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="mt-4 border-t border-border-muted pt-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

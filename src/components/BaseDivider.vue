<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Orientation = 'horizontal' | 'vertical'
type LabelPosition = 'left' | 'center' | 'right'
type Variant = 'solid' | 'dashed'
type Spacing = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    orientation?: Orientation
    /** Text label (horizontal only; or use the default slot) */
    label?: string
    labelPosition?: LabelPosition
    variant?: Variant
    spacing?: Spacing
  }>(),
  {
    orientation: 'horizontal',
    labelPosition: 'center',
    variant: 'solid',
    spacing: 'md',
  },
)

const slots = useSlots()
const hasLabel = computed(
  () => props.orientation === 'horizontal' && (Boolean(props.label) || Boolean(slots.default)),
)

const lineClasses = computed(() => [
  'border-slate-200',
  props.variant === 'dashed' ? 'border-dashed' : 'border-solid',
])

const spacingClasses = computed(() => {
  if (props.orientation === 'vertical') {
    return { none: 'mx-0', sm: 'mx-2', md: 'mx-3', lg: 'mx-4' }[props.spacing]
  }
  return { none: 'my-0', sm: 'my-2', md: 'my-4', lg: 'my-6' }[props.spacing]
})
</script>

<template>
  <!-- Vertical: a self-stretching line for use between inline items -->
  <div
    v-if="orientation === 'vertical'"
    role="separator"
    aria-orientation="vertical"
    :class="['inline-block min-h-[1em] w-px self-stretch border-l', lineClasses, spacingClasses]"
  />

  <!-- Horizontal with a label -->
  <div
    v-else-if="hasLabel"
    role="separator"
    aria-orientation="horizontal"
    :class="['flex items-center gap-3 text-sm text-slate-500', spacingClasses]"
  >
    <span v-if="labelPosition !== 'left'" :class="['flex-1 border-t', lineClasses]" />
    <span><slot>{{ label }}</slot></span>
    <span v-if="labelPosition !== 'right'" :class="['flex-1 border-t', lineClasses]" />
  </div>

  <!-- Plain horizontal rule -->
  <div
    v-else
    role="separator"
    aria-orientation="horizontal"
    :class="['border-t', lineClasses, spacingClasses]"
  />
</template>

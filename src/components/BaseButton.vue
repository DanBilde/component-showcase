<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
    /** Render as an anchor when provided */
    href?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

const tag = computed(() => (props.href ? 'a' : 'button'))

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent',
  secondary:
    'bg-white text-[var(--color-brand)] border border-[var(--color-brand)] hover:bg-slate-50',
  ghost:
    'bg-transparent text-[var(--color-brand)] border border-transparent hover:bg-slate-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-base px-4 py-2 gap-2',
  lg: 'text-lg px-5 py-2.5 gap-2',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-[var(--radius)]',
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :href="href"
    :type="href ? undefined : type"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    @click="$emit('click', $event)"
  >
    <slot name="iconLeft" />
    <slot />
    <slot name="iconRight" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Fully rounded ("pill") shape */
    pill?: boolean
    /** Show a close button that emits `remove` */
    removable?: boolean
  }>(),
  {
    variant: 'neutral',
    size: 'md',
    pill: false,
    removable: false,
  },
)

defineEmits<{ remove: [] }>()

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-red-100 text-red-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
}

const classes = computed(() => [
  'inline-flex items-center font-medium whitespace-nowrap',
  props.pill ? 'rounded-full' : 'rounded-md',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="classes">
    <slot name="icon" />
    <slot />
    <button
      v-if="removable"
      type="button"
      class="-mr-0.5 inline-flex items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
      aria-label="Remove"
      @click="$emit('remove')"
    >
      <svg
        :width="size === 'sm' ? 12 : 14"
        :height="size === 'sm' ? 12 : 14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Color = 'brand' | 'neutral' | 'white' | 'current'

const props = withDefaults(
  defineProps<{
    size?: Size
    color?: Color
    /** Accessible label announced to screen readers */
    label?: string
  }>(),
  {
    size: 'md',
    color: 'brand',
    label: 'Loading',
  },
)

const sizeClasses: Record<Size, string> = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
}

const colorClasses: Record<Color, string> = {
  brand: 'text-[var(--color-brand)]',
  neutral: 'text-slate-500',
  white: 'text-white',
  current: '',
}
</script>

<template>
  <span role="status" class="inline-flex">
    <svg
      :class="['animate-spin', sizeClasses[props.size], colorClasses[props.color]]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

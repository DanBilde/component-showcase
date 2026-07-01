<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Shape = 'circle' | 'square'
type Status = 'online' | 'away' | 'busy' | 'offline'

const props = withDefaults(
  defineProps<{
    /** Image URL; falls back to initials or an icon if missing or it fails to load */
    src?: string
    /** Used to derive initials and the accessible label */
    name?: string
    /** Overrides the image alt text (defaults to `name`) */
    alt?: string
    size?: Size
    shape?: Shape
    /** Presence indicator dot in the corner */
    status?: Status
    /** White ring around the avatar (useful when overlapping) */
    ring?: boolean
  }>(),
  {
    size: 'md',
    shape: 'circle',
    ring: false,
  },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
const showImage = computed(() => Boolean(props.src) && !failed.value)

const initials = computed(() => {
  if (!props.name) return ''
  const parts = props.name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
})

// Deterministic soft color per name so avatars stay visually distinct.
const palette = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]
const fallbackColor = computed(() => {
  if (!props.name) return 'bg-slate-100 text-slate-500'
  let sum = 0
  for (const ch of props.name) sum += ch.charCodeAt(0)
  return palette[sum % palette.length]
})

const sizeClasses: Record<Size, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const shapeClasses: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}

const statusColor: Record<Status, string> = {
  online: 'bg-green-500',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
  offline: 'bg-slate-400',
}

const dotSize: Record<Size, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
}
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <span
      :class="[
        'flex items-center justify-center overflow-hidden font-medium select-none',
        sizeClasses[size],
        shapeClasses[shape],
        showImage ? '' : fallbackColor,
        ring ? 'ring-2 ring-white' : '',
      ]"
      :role="showImage ? undefined : 'img'"
      :aria-label="showImage ? undefined : name || 'avatar'"
    >
      <img
        v-if="showImage"
        :src="src"
        :alt="alt ?? name ?? ''"
        class="h-full w-full object-cover"
        @error="failed = true"
      />
      <slot v-else>
        <span v-if="initials">{{ initials }}</span>
        <svg v-else class="h-2/3 w-2/3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"
          />
        </svg>
      </slot>
    </span>

    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
        dotSize[size],
        statusColor[status],
      ]"
    >
      <span class="sr-only">{{ status }}</span>
    </span>
  </span>
</template>

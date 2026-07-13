<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'info' | 'success' | 'warning' | 'error'
type Appearance = 'subtle' | 'solid'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    appearance?: Appearance
    /** Show a close button that emits `dismiss` */
    dismissible?: boolean
    /** Show the leading variant icon */
    icon?: boolean
    /** Center the content instead of left-aligning */
    center?: boolean
  }>(),
  {
    variant: 'info',
    appearance: 'subtle',
    dismissible: false,
    icon: true,
    center: false,
  },
)

defineEmits<{ dismiss: [] }>()

const role = computed(() =>
  props.variant === 'error' || props.variant === 'warning' ? 'alert' : 'status',
)

const subtle: Record<Variant, string> = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-amber-50 text-amber-900',
  error: 'bg-red-50 text-red-800',
}

const solid: Record<Variant, string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
}

const containerClasses = computed(() =>
  props.appearance === 'solid' ? solid[props.variant] : subtle[props.variant],
)
</script>

<template>
  <div
    :role="role"
    :class="['flex w-full items-center gap-3 px-4 py-3 text-sm', containerClasses]"
  >
    <span v-if="icon" class="shrink-0" aria-hidden="true">
      <slot name="icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="variant === 'success'">
            <circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" />
          </template>
          <template v-else-if="variant === 'warning'">
            <path d="M12 3L2 20h20L12 3z" /><path d="M12 10v4" /><path d="M12 17h.01" />
          </template>
          <template v-else-if="variant === 'error'">
            <circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />
          </template>
          <template v-else>
            <circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" />
          </template>
        </svg>
      </slot>
    </span>

    <div :class="['min-w-0 flex-1', center ? 'text-center' : '']">
      <slot />
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="-mr-1 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

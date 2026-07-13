<script setup lang="ts">
import { computed, ref } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — current rating */
    modelValue?: number
    /** Number of stars */
    max?: number
    readonly?: boolean
    /** Allow half-star selection */
    allowHalf?: boolean
    size?: Size
    /** Show the numeric value beside the stars */
    showValue?: boolean
    /** Accessible label */
    label?: string
  }>(),
  {
    modelValue: 0,
    max: 5,
    readonly: false,
    allowHalf: false,
    size: 'md',
    showValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const hoverValue = ref<number | null>(null)
const displayValue = computed(() => hoverValue.value ?? props.modelValue)
const step = computed(() => (props.allowHalf ? 0.5 : 1))

// Fill fraction (0–1) for the star at 0-based index.
const fill = (index: number) => Math.min(1, Math.max(0, displayValue.value - index))

function set(value: number) {
  if (props.readonly) return
  const clamped = Math.min(props.max, Math.max(0, value))
  if (clamped === props.modelValue) return
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

function valueFromEvent(event: MouseEvent, index: number) {
  if (!props.allowHalf) return index + 1
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  return event.clientX - rect.left < rect.width / 2 ? index + 0.5 : index + 1
}

function onMove(event: MouseEvent, index: number) {
  if (props.readonly) return
  hoverValue.value = valueFromEvent(event, index)
}

function onClick(event: MouseEvent, index: number) {
  set(valueFromEvent(event, index))
}

function onKeydown(event: KeyboardEvent) {
  if (props.readonly) return
  const key = event.key
  if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(key)) {
    event.preventDefault()
  }
  if (key === 'ArrowRight' || key === 'ArrowUp') set(props.modelValue + step.value)
  else if (key === 'ArrowLeft' || key === 'ArrowDown') set(props.modelValue - step.value)
  else if (key === 'Home') set(0)
  else if (key === 'End') set(props.max)
}

const ariaLabel = computed(
  () => props.label ?? `Rating: ${props.modelValue} of ${props.max}`,
)

const sizeClasses: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const starPath =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <div
      :class="[
        'inline-flex rounded',
        readonly
          ? ''
          : 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
      ]"
      :role="readonly ? 'img' : 'slider'"
      :tabindex="readonly ? undefined : 0"
      :aria-label="ariaLabel"
      :aria-readonly="readonly || undefined"
      :aria-valuemin="readonly ? undefined : 0"
      :aria-valuemax="readonly ? undefined : max"
      :aria-valuenow="readonly ? undefined : modelValue"
      @mouseleave="hoverValue = null"
      @keydown="onKeydown"
    >
      <span
        v-for="i in max"
        :key="i"
        class="relative inline-block"
        @mousemove="onMove($event, i - 1)"
        @click="onClick($event, i - 1)"
      >
        <svg :class="[sizeClasses[size], 'text-slate-300']" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path :d="starPath" />
        </svg>
        <span class="absolute inset-0 overflow-hidden" :style="{ width: `${fill(i - 1) * 100}%` }">
          <svg :class="[sizeClasses[size], 'text-amber-400']" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path :d="starPath" />
          </svg>
        </span>
      </span>
    </div>

    <span v-if="showValue" class="text-sm tabular-nums text-slate-600">
      {{ modelValue }}
    </span>
  </div>
</template>

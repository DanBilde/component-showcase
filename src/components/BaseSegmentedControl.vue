<script setup lang="ts">
import { useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Value = string | number

export interface SegmentOption {
  label: string
  value: Value
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model — selected value */
    modelValue?: Value
    options: SegmentOption[]
    size?: Size
    /** Stretch segments to fill the container width */
    fullWidth?: boolean
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Value]
  change: [value: Value]
}>()

function select(option: SegmentOption) {
  if (props.disabled || option.disabled) return
  if (option.value === props.modelValue) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()

  const enabled = props.options
    .map((o, i) => ({ o, i }))
    .filter((x) => !x.o.disabled)
    .map((x) => x.i)
  if (!enabled.length) return

  const pos = enabled.indexOf(index)
  let target = index
  if (event.key === 'ArrowRight') target = enabled[(pos + 1) % enabled.length]
  else if (event.key === 'ArrowLeft') target = enabled[(pos - 1 + enabled.length) % enabled.length]
  else if (event.key === 'Home') target = enabled[0]
  else if (event.key === 'End') target = enabled[enabled.length - 1]

  const option = props.options[target]
  select(option)
  document.getElementById(`${optionId}-${target}`)?.focus()
}

// Id base for focus targeting within this instance.
const optionId = useId()

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

function segmentClasses(option: SegmentOption) {
  const active = option.value === props.modelValue
  return [
    'rounded-[calc(var(--radius)-2px)] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand)]',
    sizeClasses[props.size],
    props.fullWidth ? 'flex-1' : '',
    option.disabled || props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    active
      ? 'bg-white text-slate-900 shadow-sm'
      : 'text-slate-600 hover:text-slate-900',
  ]
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="ariaLabel"
    :class="[
      'inline-flex gap-1 rounded-[var(--radius)] bg-slate-100 p-1',
      fullWidth ? 'flex w-full' : '',
    ]"
  >
    <button
      v-for="(option, index) in options"
      :id="`${optionId}-${index}`"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="option.value === modelValue ? 0 : -1"
      :disabled="disabled || option.disabled"
      :class="segmentClasses(option)"
      @click="select(option)"
      @keydown="onKeydown($event, index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

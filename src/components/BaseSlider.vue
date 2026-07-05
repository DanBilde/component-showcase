<script setup lang="ts">
import { computed, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: number
    min?: number
    max?: number
    step?: number
    size?: Size
    label?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    /** Show the current value on the right of the label row */
    showValue?: boolean
    id?: string
    name?: string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    disabled: false,
    required: false,
    showValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const uid = useId()
const fieldId = computed(() => props.id ?? uid)
const describedBy = computed(() => {
  if (props.error) return `${fieldId.value}-error`
  if (props.hint) return `${fieldId.value}-hint`
  return undefined
})

const pct = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / range) * 100))
})

const sizeVars: Record<Size, { track: string; thumb: string }> = {
  sm: { track: '4px', thumb: '14px' },
  md: { track: '6px', thumb: '18px' },
  lg: { track: '8px', thumb: '22px' },
}

// Custom properties drive the scoped thumb/track CSS; the gradient paints the fill.
const inputStyle = computed<Record<string, string>>(() => ({
  '--track': sizeVars[props.size].track,
  '--thumb': sizeVars[props.size].thumb,
  '--fill': props.error ? '#ef4444' : 'var(--color-brand)',
  background: `linear-gradient(to right, var(--fill) ${pct.value}%, rgb(226 232 240) ${pct.value}%)`,
}))

function onInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div v-if="label || showValue" class="flex items-center justify-between gap-2">
      <label v-if="label" :for="fieldId" class="text-sm font-medium text-slate-700">
        {{ label }}
        <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
      </label>
      <span v-else />
      <span v-if="showValue" class="text-sm tabular-nums text-slate-600">{{ modelValue }}</span>
    </div>

    <input
      :id="fieldId"
      type="range"
      class="slider w-full"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :name="name"
      :disabled="disabled"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :style="inputStyle"
      @input="onInput"
    />

    <p v-if="error" :id="`${fieldId}-error`" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" :id="`${fieldId}-hint`" class="text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>

<style scoped>
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: var(--track);
  border-radius: 9999px;
  cursor: pointer;
  outline: none;
}
.slider:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* WebKit / Blink */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--thumb);
  height: var(--thumb);
  margin-top: calc((var(--track) - var(--thumb)) / 2);
  border-radius: 9999px;
  background: #fff;
  border: 2px solid var(--fill);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: box-shadow 0.15s ease;
}
.slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--fill) 25%, transparent);
}

/* Firefox */
.slider::-moz-range-thumb {
  width: var(--thumb);
  height: var(--thumb);
  border-radius: 9999px;
  background: #fff;
  border: 2px solid var(--fill);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
}
.slider::-moz-range-track {
  background: transparent;
}
.slider:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--fill) 25%, transparent);
}
</style>

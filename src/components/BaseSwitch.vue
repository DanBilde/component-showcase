<script setup lang="ts">
import { computed, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — on/off state */
    modelValue?: boolean
    size?: Size
    /** Label rendered beside the switch */
    label?: string
    /** Helper text shown below (hidden when `error` is set) */
    hint?: string
    /** Error message; when set, switches the control to its error state */
    error?: string
    disabled?: boolean
    required?: boolean
    name?: string
  }>(),
  {
    modelValue: false,
    size: 'md',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const uid = useId()
const describedBy = computed(() => {
  if (props.error) return `${uid}-error`
  if (props.hint) return `${uid}-hint`
  return undefined
})

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const trackSize: Record<Size, string> = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
}
const knobSize: Record<Size, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}
const knobTranslate: Record<Size, string> = {
  sm: 'translate-x-3',
  md: 'translate-x-4',
  lg: 'translate-x-5',
}
const textSize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const trackClasses = computed(() => [
  'inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-brand)] peer-focus-visible:ring-offset-2',
  'peer-disabled:opacity-50',
  props.modelValue
    ? 'bg-[var(--color-brand)]'
    : props.error
      ? 'bg-red-300'
      : 'bg-slate-300',
  trackSize[props.size],
])

const knobClasses = computed(() => [
  'pointer-events-none rounded-full bg-white shadow transition-transform',
  knobSize[props.size],
  props.modelValue ? knobTranslate[props.size] : 'translate-x-0',
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :class="[
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
    >
      <input
        v-model="model"
        type="checkbox"
        role="switch"
        class="peer sr-only"
        :name="name"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
      />

      <span :class="trackClasses" aria-hidden="true">
        <span :class="knobClasses" />
      </span>

      <span
        v-if="label"
        :class="[textSize[size], disabled ? 'text-slate-400' : 'text-slate-700']"
      >
        {{ label }}
        <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
      </span>
    </label>

    <p v-if="error" :id="`${uid}-error`" class="text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${uid}-hint`" class="text-sm text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>

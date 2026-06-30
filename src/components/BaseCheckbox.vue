<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — checked state */
    modelValue?: boolean
    /** Tri-state "mixed" visual (e.g. a select-all parent) */
    indeterminate?: boolean
    size?: Size
    /** Label rendered beside the box */
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
    indeterminate: false,
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

// `indeterminate` is a DOM property, not an attribute — sync it for screen readers.
const inputEl = ref<HTMLInputElement | null>(null)
watchEffect(() => {
  if (inputEl.value) inputEl.value.indeterminate = props.indeterminate
})

const marked = computed(() => props.modelValue || props.indeterminate)

const controlSize: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}
const iconSize: Record<Size, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}
const textSize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const controlClasses = computed(() => [
  'flex shrink-0 items-center justify-center rounded border-2 text-white transition-colors',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-brand)] peer-focus-visible:ring-offset-1',
  'peer-disabled:opacity-50',
  marked.value
    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]'
    : props.error
      ? 'border-red-400 bg-white'
      : 'border-slate-300 bg-white peer-hover:border-slate-400',
  controlSize[props.size],
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
        ref="inputEl"
        v-model="model"
        type="checkbox"
        class="peer sr-only"
        :name="name"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
      />

      <span :class="controlClasses" aria-hidden="true">
        <svg
          v-if="indeterminate"
          :class="iconSize[size]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 12h12" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <svg
          v-else-if="modelValue"
          :class="iconSize[size]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
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

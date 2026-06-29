<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: string | number
    type?: InputType
    size?: Size
    /** Visible label rendered above the field */
    label?: string
    placeholder?: string
    /** Helper text shown below the field (hidden when `error` is set) */
    hint?: string
    /** Error message; when set, switches the field to its error state */
    error?: string
    disabled?: boolean
    required?: boolean
    /** Explicit id; auto-generated when omitted so the label stays linked */
    id?: string
    name?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'md',
    disabled: false,
    required: false,
  },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const slots = useSlots()
const uid = useId()
const inputId = computed(() => props.id ?? uid)

const describedBy = computed(() => {
  if (props.error) return `${inputId.value}-error`
  if (props.hint) return `${inputId.value}-hint`
  return undefined
})

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5',
  md: 'text-base py-2',
  lg: 'text-lg py-2.5',
}

// Horizontal padding widens to make room for prefix / suffix slots.
const paddingClasses = computed(() => {
  const left = slots.prefix ? 'pl-10' : 'pl-3'
  const right = slots.suffix ? 'pr-10' : 'pr-3'
  return `${left} ${right}`
})

const stateClasses = computed(() =>
  props.error
    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-slate-300 focus-visible:border-[var(--color-brand)] focus-visible:ring-[var(--color-brand)]',
)

const inputClasses = computed(() => [
  'w-full rounded-[var(--radius)] border bg-white text-slate-900 placeholder:text-slate-400',
  'transition-colors focus:outline-none focus-visible:ring-2',
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  sizeClasses[props.size],
  paddingClasses.value,
  stateClasses.value,
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-slate-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>

    <div class="relative flex items-center">
      <span
        v-if="$slots.prefix"
        class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
      >
        <slot name="prefix" />
      </span>

      <input
        :id="inputId"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <span
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-3 flex items-center text-slate-400"
      >
        <slot name="suffix" />
      </span>
    </div>

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="text-sm text-red-600"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${inputId}-hint`"
      class="text-sm text-slate-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

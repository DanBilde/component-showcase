<script lang="ts">
// Module-level counter: guarantees a unique radio `name` per instance even across
// the separate Vue app mounts Storybook uses on one Docs page — where `useId`
// (which resets per app) would collide and merge the groups into one.
let radioGroupSeq = 0

type Value = string | number

export interface RadioOption {
  label: string
  value: Value
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Orientation = 'vertical' | 'horizontal'

const props = withDefaults(
  defineProps<{
    /** v-model — the selected option's value */
    modelValue?: Value | null
    options: RadioOption[]
    size?: Size
    orientation?: Orientation
    /** Group label rendered as the fieldset legend */
    label?: string
    /** Helper text shown below the group (hidden when `error` is set) */
    hint?: string
    /** Error message; when set, switches the group to its error state */
    error?: string
    disabled?: boolean
    required?: boolean
    /** Shared radio `name`; auto-generated when omitted */
    name?: string
  }>(),
  {
    modelValue: null,
    size: 'md',
    orientation: 'vertical',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Value]
  change: [value: Value]
}>()

const uid = useId()
const autoName = `radiogroup-${(radioGroupSeq += 1)}`
const groupName = computed(() => props.name ?? autoName)

const describedBy = computed(() => {
  if (props.error) return `${uid}-error`
  if (props.hint) return `${uid}-hint`
  return undefined
})

// Writable computed drives native radio v-model, so the checked state always
// reflects modelValue (including a preselected initial value).
const selected = computed({
  get: () => props.modelValue,
  set: (value: Value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const controlSize: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const textSize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const optionsWrapper = computed(() =>
  props.orientation === 'horizontal'
    ? 'flex flex-wrap gap-x-5 gap-y-2'
    : 'flex flex-col gap-2',
)

const controlClasses = computed(() => [
  'shrink-0 rounded-full border-2 border-slate-300 bg-white transition-all',
  'peer-hover:border-slate-400',
  'peer-checked:border-[var(--color-brand)] peer-checked:bg-[var(--color-brand)] peer-checked:shadow-[inset_0_0_0_2px_#fff]',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-brand)] peer-focus-visible:ring-offset-1',
  'peer-disabled:opacity-50',
  props.error ? 'border-red-400' : '',
  controlSize[props.size],
])
</script>

<template>
  <fieldset
    class="m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0"
    :aria-invalid="error ? true : undefined"
    :aria-describedby="describedBy"
  >
    <legend v-if="label" class="mb-0.5 p-0 text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </legend>

    <div :class="optionsWrapper">
      <label
        v-for="opt in options"
        :key="opt.value"
        :class="[
          'inline-flex items-center gap-2',
          disabled || opt.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        <input
          v-model="selected"
          type="radio"
          class="peer sr-only"
          :name="groupName"
          :value="opt.value"
          :disabled="disabled || opt.disabled"
          :required="required"
          :aria-describedby="describedBy"
        />
        <span :class="controlClasses" aria-hidden="true" />
        <span
          :class="[
            textSize[size],
            disabled || opt.disabled ? 'text-slate-400' : 'text-slate-700',
          ]"
        >
          {{ opt.label }}
        </span>
      </label>
    </div>

    <p v-if="error" :id="`${uid}-error`" class="text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${uid}-hint`" class="text-sm text-slate-500">
      {{ hint }}
    </p>
  </fieldset>
</template>

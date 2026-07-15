<script setup lang="ts">
import { computed, useId } from 'vue'
import BasePopover from './BasePopover.vue'
import BaseCalendar from './BaseCalendar.vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — selected date as an ISO `YYYY-MM-DD` string */
    modelValue?: string | null
    min?: string
    max?: string
    weekStartsOn?: 0 | 1
    size?: Size
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    modelValue: null,
    weekStartsOn: 1,
    size: 'md',
    placeholder: 'Select a date',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const uid = useId()
const fieldId = computed(() => props.id ?? uid)
const describedBy = computed(() => {
  if (props.error) return `${fieldId.value}-error`
  if (props.hint) return `${fieldId.value}-hint`
  return undefined
})

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const display = computed(() => {
  if (!props.modelValue) return ''
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return `${MONTHS_SHORT[m - 1]} ${d}, ${y}`
})

function onSelect(value: string, close: () => void) {
  emit('update:modelValue', value)
  emit('change', value)
  close()
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5',
  md: 'text-base py-2',
  lg: 'text-lg py-2.5',
}

const triggerClasses = computed(() => [
  'flex w-full items-center justify-between gap-2 rounded-[var(--radius)] border bg-white px-3 text-left',
  'transition-colors focus:outline-none focus-visible:ring-2',
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  sizeClasses[props.size],
  props.error
    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-slate-300 focus-visible:border-[var(--color-brand)] focus-visible:ring-[var(--color-brand)]',
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="fieldId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>

    <BasePopover block :disabled="disabled" placement="bottom-start">
      <template #trigger="{ open }">
        <button
          :id="fieldId"
          type="button"
          :disabled="disabled"
          aria-haspopup="dialog"
          :aria-expanded="open"
          :aria-invalid="error ? true : undefined"
          :aria-describedby="describedBy"
          :class="triggerClasses"
        >
          <span :class="display ? 'text-slate-900' : 'text-slate-400'">
            {{ display || placeholder }}
          </span>
          <svg class="shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </template>

      <template #default="{ close }">
        <BaseCalendar
          :model-value="modelValue"
          :min="min"
          :max="max"
          :week-starts-on="weekStartsOn"
          :bordered="false"
          @update:model-value="(v) => onSelect(v, close)"
        />
      </template>
    </BasePopover>

    <p v-if="error" :id="`${fieldId}-error`" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" :id="`${fieldId}-hint`" class="text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>

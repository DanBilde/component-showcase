<script setup lang="ts">
import { computed, ref, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — array of chip strings */
    modelValue?: string[]
    size?: Size
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    /** Maximum number of chips */
    max?: number
    /** Allow the same chip value more than once */
    allowDuplicates?: boolean
    id?: string
    name?: string
  }>(),
  {
    modelValue: () => [],
    size: 'md',
    disabled: false,
    required: false,
    allowDuplicates: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const uid = useId()
const fieldId = computed(() => props.id ?? uid)
const describedBy = computed(() => {
  if (props.error) return `${fieldId.value}-error`
  if (props.hint) return `${fieldId.value}-hint`
  return undefined
})

const inputEl = ref<HTMLInputElement | null>(null)
const inputText = ref('')

function commit(next: string[]) {
  emit('update:modelValue', next)
  emit('change', next)
}

function addChip(raw: string) {
  const value = raw.trim()
  if (!value || props.disabled) return
  if (props.max != null && props.modelValue.length >= props.max) return
  if (!props.allowDuplicates && props.modelValue.includes(value)) {
    inputText.value = ''
    return
  }
  commit([...props.modelValue, value])
  inputText.value = ''
}

function removeChip(index: number) {
  if (props.disabled) return
  commit(props.modelValue.filter((_, i) => i !== index))
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addChip(inputText.value)
  } else if (event.key === 'Backspace' && inputText.value === '' && props.modelValue.length) {
    removeChip(props.modelValue.length - 1)
  }
}

const atMax = computed(() => props.max != null && props.modelValue.length >= props.max)

const sizeText: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
const minHeight: Record<Size, string> = {
  sm: 'min-h-9',
  md: 'min-h-10',
  lg: 'min-h-11',
}

const containerClasses = computed(() => [
  'flex flex-wrap items-center gap-1.5 rounded-[var(--radius)] border px-2 py-1 transition-colors',
  minHeight[props.size],
  props.disabled ? 'cursor-not-allowed bg-surface-muted' : 'cursor-text bg-surface',
  props.error
    ? 'border-danger focus-within:ring-2 focus-within:ring-danger'
    : 'border-border-control focus-within:border-brand focus-within:ring-2 focus-within:ring-brand',
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="fieldId" class="text-sm font-medium text-fg-muted">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <div :class="containerClasses" @click="inputEl?.focus()">
      <span
        v-for="(chip, i) in modelValue"
        :key="i"
        class="inline-flex items-center gap-1 rounded bg-surface-sunken px-2 py-0.5 text-sm text-fg-muted"
      >
        {{ chip }}
        <button
          v-if="!disabled"
          type="button"
          class="-mr-0.5 flex items-center rounded text-fg-subtle transition-colors hover:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
          :aria-label="`Remove ${chip}`"
          @click.stop="removeChip(i)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </button>
      </span>

      <input
        :id="fieldId"
        ref="inputEl"
        v-model="inputText"
        type="text"
        :name="name"
        :placeholder="modelValue.length ? '' : placeholder"
        :disabled="disabled || atMax"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        class="min-w-[6rem] flex-1 border-0 bg-transparent px-1 py-1 text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed"
        :class="sizeText[size]"
        @keydown="onKeydown"
        @blur="addChip(inputText)"
      />
    </div>

    <p v-if="error" :id="`${fieldId}-error`" class="text-sm text-danger">{{ error }}</p>
    <p v-else-if="hint" :id="`${fieldId}-hint`" class="text-sm text-fg-subtle">{{ hint }}</p>
  </div>
</template>

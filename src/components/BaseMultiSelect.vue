<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { SelectOption } from './BaseSelect.vue'

type Size = 'sm' | 'md' | 'lg'
type Value = string | number

const props = withDefaults(
  defineProps<{
    /** v-model — the array of selected values */
    modelValue?: Value[]
    options: SelectOption[]
    size?: Size
    /** Visible label rendered above the field */
    label?: string
    /** Shown on the trigger when nothing is selected */
    placeholder?: string
    /** Helper text shown below the field (hidden when `error` is set) */
    hint?: string
    /** Error message; when set, switches the field to its error state */
    error?: string
    disabled?: boolean
    required?: boolean
    /** Explicit id; auto-generated when omitted so the label stays linked */
    id?: string
  }>(),
  {
    modelValue: () => [],
    size: 'md',
    placeholder: 'Select…',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Value[]]
  change: [value: Value[]]
}>()

const uid = useId()
const baseId = computed(() => props.id ?? uid)
const labelId = computed(() => `${baseId.value}-label`)
const listboxId = computed(() => `${baseId.value}-listbox`)
const optionId = (index: number) => `${baseId.value}-opt-${index}`

const describedBy = computed(() => {
  if (props.error) return `${baseId.value}-error`
  if (props.hint) return `${baseId.value}-hint`
  return undefined
})

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const selectedSet = computed(() => new Set(props.modelValue))
const isSelected = (value: Value) => selectedSet.value.has(value)

// Selected values resolved to { label, value } for the chips in the trigger.
const selectedChips = computed(() =>
  props.modelValue.map((v) => ({
    value: v,
    label: props.options.find((o) => o.value === v)?.label ?? String(v),
  })),
)

const ariaLabelledby = computed(() =>
  props.label ? `${labelId.value} ${baseId.value}` : undefined,
)

// ---- open / close ----------------------------------------------------------
function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  const firstSelected = props.options.findIndex((o) => isSelected(o.value))
  activeIndex.value = firstSelected >= 0 ? firstSelected : firstEnabled()
}

function closeMenu(refocus = true) {
  if (!isOpen.value) return
  isOpen.value = false
  activeIndex.value = -1
  if (refocus) nextTick(() => trigger.value?.focus())
}

function toggle() {
  isOpen.value ? closeMenu() : open()
}

// Toggle membership; the menu stays open for multiple picks.
function toggleIndex(index: number) {
  const opt = props.options[index]
  if (!opt || opt.disabled) return
  const next = isSelected(opt.value)
    ? props.modelValue.filter((v) => v !== opt.value)
    : [...props.modelValue, opt.value]
  emit('update:modelValue', next)
  emit('change', next)
}

function removeValue(value: Value) {
  if (props.disabled) return
  const next = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', next)
  emit('change', next)
}

// ---- active-option movement ------------------------------------------------
function firstEnabled() {
  return props.options.findIndex((o) => !o.disabled)
}

function moveActive(direction: 1 | -1) {
  const { options } = props
  let i = activeIndex.value
  for (let step = 0; step < options.length; step++) {
    i += direction
    if (i < 0 || i >= options.length) return // no wrap
    if (!options[i].disabled) {
      activeIndex.value = i
      return
    }
  }
}

function setActiveEdge(edge: 'first' | 'last') {
  const range =
    edge === 'first'
      ? props.options.map((_, i) => i)
      : props.options.map((_, i) => i).reverse()
  const found = range.find((i) => !props.options[i].disabled)
  if (found !== undefined) activeIndex.value = found
}

// ---- type-ahead ------------------------------------------------------------
let typed = ''
let typedTimer: ReturnType<typeof setTimeout> | undefined

function typeahead(char: string) {
  typed += char.toLowerCase()
  clearTimeout(typedTimer)
  typedTimer = setTimeout(() => (typed = ''), 500)

  const match = props.options.findIndex(
    (o) => !o.disabled && o.label.toLowerCase().startsWith(typed),
  )
  if (match >= 0) {
    activeIndex.value = match
    if (!isOpen.value) open()
  }
}

// ---- keyboard --------------------------------------------------------------
function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  const { key } = event

  // Backspace removes the last selected chip, whether the menu is open or not.
  if (key === 'Backspace' && props.modelValue.length) {
    event.preventDefault()
    removeValue(props.modelValue[props.modelValue.length - 1])
    return
  }

  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      event.preventDefault()
      open()
      return
    }
  } else {
    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        return
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        return
      case 'Home':
        event.preventDefault()
        setActiveEdge('first')
        return
      case 'End':
        event.preventDefault()
        setActiveEdge('last')
        return
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex.value >= 0) toggleIndex(activeIndex.value)
        return
      case 'Escape':
        event.preventDefault()
        closeMenu()
        return
      case 'Tab':
        closeMenu(false)
        return
    }
  }

  if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    typeahead(key)
  }
}

// ---- outside click + active scrolling --------------------------------------
function onPointerDown(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) closeMenu(false)
}

watch(isOpen, (openNow) => {
  if (typeof document === 'undefined') return
  if (openNow) document.addEventListener('pointerdown', onPointerDown)
  else document.removeEventListener('pointerdown', onPointerDown)
})

watch(activeIndex, (i) => {
  if (!isOpen.value || i < 0) return
  nextTick(() => {
    document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
  })
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('pointerdown', onPointerDown)
  clearTimeout(typedTimer)
})

// ---- classes ---------------------------------------------------------------
// A min-height per size keeps the field from jumping when the first chip appears;
// it only grows when chips wrap to a new row.
const sizeClasses: Record<Size, string> = {
  sm: 'min-h-9 text-sm',
  md: 'min-h-10 text-base',
  lg: 'min-h-11 text-lg',
}

const stateClasses = computed(() =>
  props.error
    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-slate-300 focus-visible:border-[var(--color-brand)] focus-visible:ring-[var(--color-brand)]',
)

const triggerClasses = computed(() => [
  'flex w-full items-center justify-between gap-2 rounded-[var(--radius)] border px-3 py-1 text-left',
  'transition-colors focus:outline-none focus-visible:ring-2',
  props.disabled
    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
    : 'cursor-pointer bg-white',
  sizeClasses[props.size],
  stateClasses.value,
])

function optionClasses(index: number, opt: SelectOption) {
  return [
    'flex items-center gap-2.5 px-3 py-2 text-sm',
    opt.disabled
      ? 'cursor-not-allowed text-slate-400'
      : 'cursor-pointer text-slate-900',
    index === activeIndex.value && !opt.disabled ? 'bg-slate-100' : '',
  ]
}
</script>

<template>
  <div ref="root" class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :id="labelId"
      :for="baseId"
      class="text-sm font-medium text-slate-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <div
        :id="baseId"
        ref="trigger"
        role="combobox"
        aria-haspopup="listbox"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-labelledby="ariaLabelledby"
        :aria-activedescendant="
          isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
        "
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-disabled="disabled || undefined"
        :class="triggerClasses"
        @click="toggle"
        @keydown="onKeydown"
      >
        <span class="flex flex-1 flex-wrap items-center gap-1.5">
          <template v-if="selectedChips.length">
            <span
              v-for="chip in selectedChips"
              :key="chip.value"
              class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-700"
            >
              {{ chip.label }}
              <button
                v-if="!disabled"
                type="button"
                class="-mr-0.5 flex items-center rounded text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand)]"
                :aria-label="`Remove ${chip.label}`"
                @click.stop="removeValue(chip.value)"
                @keydown.stop
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </span>
          </template>
          <span v-else class="text-slate-400">{{ placeholder }}</span>
        </span>

        <svg
          :class="[
            'shrink-0 text-slate-400 transition-transform',
            isOpen ? 'rotate-180' : '',
          ]"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <ul
        v-if="isOpen"
        :id="listboxId"
        role="listbox"
        aria-multiselectable="true"
        :aria-labelledby="label ? labelId : undefined"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius)] border border-slate-200 bg-white py-1 shadow-lg"
      >
        <li
          v-for="(opt, i) in options"
          :id="optionId(i)"
          :key="opt.value"
          role="option"
          :aria-selected="isSelected(opt.value)"
          :aria-disabled="opt.disabled || undefined"
          :class="optionClasses(i, opt)"
          @click="toggleIndex(i)"
          @mousemove="activeIndex = i"
        >
          <span
            :class="[
              'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
              isSelected(opt.value)
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                : 'border-slate-300 bg-white',
            ]"
            aria-hidden="true"
          >
            <svg
              v-if="isSelected(opt.value)"
              width="12"
              height="12"
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
          <span>{{ opt.label }}</span>
        </li>
      </ul>
    </div>

    <p v-if="error" :id="`${baseId}-error`" class="text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${baseId}-hint`" class="text-sm text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>

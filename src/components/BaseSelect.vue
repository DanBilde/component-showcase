<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

type Size = 'sm' | 'md' | 'lg'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model — the selected option's value */
    modelValue?: string | number | null
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
    modelValue: null,
    size: 'md',
    placeholder: 'Select…',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
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
const trigger = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const selectedIndex = computed(() =>
  props.options.findIndex((o) => o.value === props.modelValue),
)
const selectedOption = computed(() => props.options[selectedIndex.value] ?? null)
const selectedLabel = computed(() => selectedOption.value?.label ?? props.placeholder)

const ariaLabelledby = computed(() =>
  props.label ? `${labelId.value} ${baseId.value}` : undefined,
)

// ---- open / close ----------------------------------------------------------
function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : firstEnabled()
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

function selectIndex(index: number) {
  const opt = props.options[index]
  if (!opt || opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  closeMenu()
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
        if (activeIndex.value >= 0) selectIndex(activeIndex.value)
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
const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5',
  md: 'text-base py-2',
  lg: 'text-lg py-2.5',
}

const stateClasses = computed(() =>
  props.error
    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
    : 'border-slate-300 focus-visible:border-[var(--color-brand)] focus-visible:ring-[var(--color-brand)]',
)

const triggerClasses = computed(() => [
  'flex w-full items-center justify-between gap-2 rounded-[var(--radius)] border bg-white px-3 text-left',
  'transition-colors focus:outline-none focus-visible:ring-2',
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  sizeClasses[props.size],
  stateClasses.value,
])

function optionClasses(index: number, opt: SelectOption) {
  return [
    'flex items-center justify-between gap-2 px-3 py-2 text-sm',
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
      <button
        :id="baseId"
        ref="trigger"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-labelledby="ariaLabelledby"
        :aria-activedescendant="
          isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
        "
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :disabled="disabled"
        :class="triggerClasses"
        @click="toggle"
        @keydown="onKeydown"
      >
        <span :class="selectedOption ? 'text-slate-900' : 'text-slate-400'">
          {{ selectedLabel }}
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
      </button>

      <ul
        v-if="isOpen"
        :id="listboxId"
        role="listbox"
        :aria-labelledby="label ? labelId : undefined"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius)] border border-slate-200 bg-white py-1 shadow-lg"
      >
        <li
          v-for="(opt, i) in options"
          :id="optionId(i)"
          :key="opt.value"
          role="option"
          :aria-selected="opt.value === modelValue"
          :aria-disabled="opt.disabled || undefined"
          :class="optionClasses(i, opt)"
          @click="selectIndex(i)"
          @mousemove="activeIndex = i"
        >
          <span>{{ opt.label }}</span>
          <svg
            v-if="opt.value === modelValue"
            class="shrink-0 text-[var(--color-brand)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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

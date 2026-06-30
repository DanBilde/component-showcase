<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'underline' | 'pills'
type Value = string | number

export interface TabItem {
  label: string
  value: Value
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model — the active tab's value. Omit for uncontrolled use. */
    modelValue?: Value
    tabs: TabItem[]
    variant?: Variant
    size?: Size
    /** Accessible name for the tab list */
    ariaLabel?: string
    /** Explicit id prefix; auto-generated when omitted */
    id?: string
  }>(),
  {
    variant: 'underline',
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Value]
  change: [value: Value]
}>()

const uid = useId()
const baseId = computed(() => props.id ?? uid)
const tabId = (value: Value) => `${baseId.value}-tab-${value}`
const panelId = (value: Value) => `${baseId.value}-panel-${value}`

// Works controlled (v-model) or uncontrolled (internal fallback to first enabled tab).
const internalValue = ref<Value | undefined>(
  props.modelValue ?? props.tabs.find((t) => !t.disabled)?.value,
)
const activeValue = computed(() => props.modelValue ?? internalValue.value)

function select(value: Value) {
  internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End']
  if (!navKeys.includes(event.key)) return
  event.preventDefault()

  const enabled = props.tabs
    .map((t, i) => ({ t, i }))
    .filter((x) => !x.t.disabled)
    .map((x) => x.i)
  if (!enabled.length) return

  const pos = enabled.indexOf(index)
  let target = index
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      target = enabled[(pos + 1) % enabled.length]
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      target = enabled[(pos - 1 + enabled.length) % enabled.length]
      break
    case 'Home':
      target = enabled[0]
      break
    case 'End':
      target = enabled[enabled.length - 1]
      break
  }

  const value = props.tabs[target].value
  select(value)
  nextTick(() => document.getElementById(tabId(value))?.focus())
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
}

const tablistClasses = computed(() => [
  'flex gap-1',
  props.variant === 'underline' ? 'border-b border-slate-200' : '',
])

function tabClasses(tab: TabItem) {
  const isActive = tab.value === activeValue.value
  const classes = [
    'font-medium transition-colors focus:outline-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
    sizeClasses[props.size],
    tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
  ]

  if (props.variant === 'pills') {
    classes.push('rounded-[var(--radius)]')
    classes.push(
      isActive
        ? 'bg-[var(--color-brand)] text-white'
        : `text-slate-600${tab.disabled ? '' : ' hover:bg-slate-100'}`,
    )
  } else {
    classes.push('-mb-px border-b-2')
    classes.push(
      isActive
        ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
        : `border-transparent text-slate-500${
            tab.disabled ? '' : ' hover:border-slate-300 hover:text-slate-800'
          }`,
    )
  }

  return classes
}
</script>

<template>
  <div>
    <div role="tablist" :aria-label="ariaLabel" :class="tablistClasses">
      <button
        v-for="(tab, i) in tabs"
        :id="tabId(tab.value)"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="tab.value === activeValue"
        :aria-controls="panelId(tab.value)"
        :tabindex="tab.value === activeValue ? 0 : -1"
        :disabled="tab.disabled"
        :class="tabClasses(tab)"
        @click="select(tab.value)"
        @keydown="onKeydown($event, i)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in tabs"
      v-show="tab.value === activeValue"
      :id="panelId(tab.value)"
      :key="tab.value"
      role="tabpanel"
      :aria-labelledby="tabId(tab.value)"
      tabindex="0"
      class="pt-4 focus:outline-none"
    >
      <slot :name="tab.value" />
    </div>
  </div>
</template>

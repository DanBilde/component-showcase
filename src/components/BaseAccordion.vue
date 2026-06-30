<script setup lang="ts">
import { computed, useId } from 'vue'

type Value = string | number

export interface AccordionItem {
  title: string
  value: Value
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[]
    /** v-model — array of open item values */
    modelValue?: Value[]
    /** Allow more than one panel open at a time */
    multiple?: boolean
    /** Heading level wrapping each header button (for document outline) */
    headingLevel?: number
    id?: string
  }>(),
  {
    modelValue: () => [],
    multiple: false,
    headingLevel: 3,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Value[]]
  change: [value: Value[]]
}>()

const uid = useId()
const baseId = computed(() => props.id ?? uid)
const headerId = (value: Value) => `${baseId.value}-header-${value}`
const panelId = (value: Value) => `${baseId.value}-panel-${value}`
const headingTag = computed(() => `h${props.headingLevel}`)

const openSet = computed(() => new Set(props.modelValue))
const isOpen = (value: Value) => openSet.value.has(value)

function toggle(item: AccordionItem) {
  if (item.disabled) return
  let next: Value[]
  if (isOpen(item.value)) {
    next = props.modelValue.filter((v) => v !== item.value)
  } else {
    next = props.multiple ? [...props.modelValue, item.value] : [item.value]
  }
  emit('update:modelValue', next)
  emit('change', next)
}

// Optional roving focus between headers (WAI-ARIA accordion keyboard support).
function onHeaderKeydown(event: KeyboardEvent, index: number) {
  const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()

  const enabled = props.items
    .map((it, i) => ({ it, i }))
    .filter((x) => !x.it.disabled)
    .map((x) => x.i)
  if (!enabled.length) return

  const pos = enabled.indexOf(index)
  let target = index
  switch (event.key) {
    case 'ArrowDown':
      target = enabled[(pos + 1) % enabled.length]
      break
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
  document.getElementById(headerId(props.items[target].value))?.focus()
}
</script>

<template>
  <div
    class="divide-y divide-slate-200 overflow-hidden rounded-[var(--radius)] border border-slate-200"
  >
    <div v-for="(item, i) in items" :key="item.value">
      <component :is="headingTag" class="m-0">
        <button
          :id="headerId(item.value)"
          type="button"
          class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          :aria-expanded="isOpen(item.value)"
          :aria-controls="panelId(item.value)"
          :disabled="item.disabled"
          @click="toggle(item)"
          @keydown="onHeaderKeydown($event, i)"
        >
          <span>{{ item.title }}</span>
          <svg
            :class="[
              'shrink-0 text-slate-400 transition-transform duration-200',
              isOpen(item.value) ? 'rotate-180' : '',
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
      </component>

      <!-- grid 0fr -> 1fr animates height with pure CSS -->
      <div
        :id="panelId(item.value)"
        role="region"
        :aria-labelledby="headerId(item.value)"
        class="grid transition-[grid-template-rows] duration-200 ease-out"
        :style="{ gridTemplateRows: isOpen(item.value) ? '1fr' : '0fr' }"
      >
        <div class="overflow-hidden">
          <div :inert="!isOpen(item.value)" class="px-4 pb-4 text-sm text-slate-600">
            <slot :name="item.value" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

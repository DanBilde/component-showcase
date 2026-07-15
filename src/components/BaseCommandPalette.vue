<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

export interface CommandItem {
  value: string | number
  label: string
  description?: string
  group?: string
  keywords?: string[]
  shortcut?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model — open state */
    modelValue?: boolean
    items: CommandItem[]
    placeholder?: string
    emptyText?: string
  }>(),
  {
    modelValue: false,
    placeholder: 'Type a command or search…',
    emptyText: 'No results found.',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [item: CommandItem]
}>()

const uid = useId()
const listId = `${uid}-list`
const optionId = (index: number) => `${uid}-opt-${index}`

const inputEl = ref<HTMLInputElement | null>(null)
const query = ref('')
const activeIndex = ref(0)

// Flat list of items matching the query (used for keyboard navigation).
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter((item) => {
    const haystack = [item.label, item.description, ...(item.keywords ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

// Group the flat results for display, keeping each item's flat index.
const groups = computed(() => {
  const map = new Map<string, { item: CommandItem; index: number }[]>()
  results.value.forEach((item, index) => {
    const key = item.group ?? ''
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push({ item, index })
  })
  return [...map.entries()].map(([name, items]) => ({ name, items }))
})

function close() {
  emit('update:modelValue', false)
}

function selectItem(item: CommandItem) {
  if (item.disabled) return
  emit('select', item)
  close()
}

function move(delta: number) {
  const len = results.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
  nextTick(() =>
    document.getElementById(optionId(activeIndex.value))?.scrollIntoView({ block: 'nearest' }),
  )
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = 0
      break
    case 'End':
      event.preventDefault()
      activeIndex.value = Math.max(0, results.value.length - 1)
      break
    case 'Enter': {
      event.preventDefault()
      const item = results.value[activeIndex.value]
      if (item) selectItem(item)
      break
    }
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

// Reset active index whenever the query narrows the list.
watch(query, () => (activeIndex.value = 0))

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      query.value = ''
      activeIndex.value = 0
      document.body.style.overflow = 'hidden'
      nextTick(() => inputEl.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

function optionClasses(index: number, item: CommandItem) {
  return [
    'flex cursor-pointer items-center gap-3 rounded-[calc(var(--radius)-2px)] px-3 py-2 text-sm',
    item.disabled ? 'cursor-not-allowed opacity-50' : '',
    index === activeIndex.value && !item.disabled ? 'bg-slate-100' : '',
  ]
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      >
        <div class="absolute inset-0 bg-slate-900/40" @click="close" />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          class="relative w-full max-w-lg overflow-hidden rounded-[var(--radius)] bg-white shadow-xl"
        >
          <div class="flex items-center gap-2 border-b border-slate-200 px-4">
            <svg class="shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              role="combobox"
              aria-expanded="true"
              :aria-controls="listId"
              :aria-activedescendant="results.length ? optionId(activeIndex) : undefined"
              :placeholder="placeholder"
              class="w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              @keydown="onKeydown"
            />
          </div>

          <ul :id="listId" role="listbox" class="max-h-80 overflow-y-auto p-2">
            <template v-if="results.length">
              <template v-for="group in groups" :key="group.name">
                <li
                  v-if="group.name"
                  class="px-2 pb-1 pt-2 text-xs font-medium text-slate-400"
                  role="presentation"
                >
                  {{ group.name }}
                </li>
                <li
                  v-for="entry in group.items"
                  :id="optionId(entry.index)"
                  :key="entry.index"
                  role="option"
                  :aria-selected="entry.index === activeIndex"
                  :aria-disabled="entry.item.disabled || undefined"
                  :class="optionClasses(entry.index, entry.item)"
                  @click="selectItem(entry.item)"
                  @mousemove="activeIndex = entry.index"
                >
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-slate-900">{{ entry.item.label }}</div>
                    <div v-if="entry.item.description" class="truncate text-xs text-slate-500">
                      {{ entry.item.description }}
                    </div>
                  </div>
                  <span v-if="entry.item.shortcut" class="shrink-0 text-xs text-slate-400">
                    {{ entry.item.shortcut }}
                  </span>
                </li>
              </template>
            </template>
            <li v-else class="px-3 py-8 text-center text-sm text-slate-400">{{ emptyText }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

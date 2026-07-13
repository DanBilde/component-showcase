<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

type Placement = 'bottom-start' | 'bottom-end'

export interface MenuItem {
  label?: string
  value?: string | number
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    placement?: Placement
    disabled?: boolean
  }>(),
  {
    placement: 'bottom-start',
    disabled: false,
  },
)

const emit = defineEmits<{ select: [item: MenuItem] }>()

const uid = useId()
const itemId = (index: number) => `${uid}-item-${index}`

const root = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)

const enabledIndexes = () =>
  props.items.map((it, i) => ({ it, i })).filter((x) => !x.it.disabled && !x.it.divider).map((x) => x.i)

function focusItem(index: number) {
  nextTick(() => document.getElementById(itemId(index))?.focus())
}

function openMenu() {
  if (props.disabled) return
  open.value = true
  const first = enabledIndexes()[0] ?? -1
  activeIndex.value = first
  if (first >= 0) focusItem(first)
}

function closeMenu(returnFocus = true) {
  if (!open.value) return
  open.value = false
  activeIndex.value = -1
  if (returnFocus) {
    nextTick(() =>
      (triggerRef.value?.querySelector('button, a, [tabindex]') as HTMLElement | null)?.focus(),
    )
  }
}

function toggle() {
  open.value ? closeMenu(false) : openMenu()
}

function selectItem(index: number) {
  const item = props.items[index]
  if (!item || item.disabled || item.divider) return
  emit('select', item)
  closeMenu()
}

function move(direction: 1 | -1) {
  const en = enabledIndexes()
  if (!en.length) return
  const pos = en.indexOf(activeIndex.value)
  const target =
    direction === 1 ? en[(pos + 1) % en.length] : en[(pos - 1 + en.length) % en.length]
  activeIndex.value = target
  focusItem(target)
}

function onItemKeydown(event: KeyboardEvent, index: number) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home': {
      event.preventDefault()
      const first = enabledIndexes()[0]
      if (first != null) {
        activeIndex.value = first
        focusItem(first)
      }
      break
    }
    case 'End': {
      event.preventDefault()
      const en = enabledIndexes()
      const last = en[en.length - 1]
      if (last != null) {
        activeIndex.value = last
        focusItem(last)
      }
      break
    }
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectItem(index)
      break
    case 'Escape':
      event.preventDefault()
      closeMenu()
      break
    case 'Tab':
      closeMenu(false)
      break
  }
}

function onPointerDown(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) closeMenu(false)
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) document.addEventListener('pointerdown', onPointerDown)
  else document.removeEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('pointerdown', onPointerDown)
})

const placementClasses: Record<Placement, string> = {
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
}

function itemClasses(item: MenuItem, index: number) {
  return [
    'flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm transition-colors focus:outline-none',
    item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    item.danger ? 'text-red-600' : 'text-slate-700',
    index === activeIndex.value && !item.disabled ? (item.danger ? 'bg-red-50' : 'bg-slate-100') : '',
  ]
}
</script>

<template>
  <div ref="root" class="relative inline-block">
    <div
      ref="triggerRef"
      class="inline-flex"
      @click="toggle"
      @keydown.down.prevent="!open && openMenu()"
    >
      <slot name="trigger" :open="open" />
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="open"
        role="menu"
        :class="[
          'absolute z-30 min-w-[12rem] origin-top rounded-[var(--radius)] border border-slate-200 bg-white p-1 shadow-lg',
          placementClasses[placement],
        ]"
      >
        <template v-for="(item, i) in items" :key="i">
          <li v-if="item.divider" role="separator" class="my-1 border-t border-slate-100" />
          <li v-else role="none">
            <button
              :id="itemId(i)"
              type="button"
              role="menuitem"
              tabindex="-1"
              :disabled="item.disabled"
              :class="itemClasses(item, i)"
              @click="selectItem(i)"
              @keydown="onItemKeydown($event, i)"
              @mousemove="activeIndex = i"
            >
              {{ item.label }}
            </button>
          </li>
        </template>
      </ul>
    </Transition>
  </div>
</template>

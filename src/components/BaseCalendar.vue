<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model — selected date as an ISO `YYYY-MM-DD` string */
    modelValue?: string | null
    /** Earliest selectable date (`YYYY-MM-DD`) */
    min?: string
    /** Latest selectable date (`YYYY-MM-DD`) */
    max?: string
    /** 0 = Sunday, 1 = Monday */
    weekStartsOn?: 0 | 1
  }>(),
  {
    modelValue: null,
    weekStartsOn: 1,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const uid = useId()
const cellId = (iso: string) => `${uid}-${iso}`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const today = toISO(new Date())

const initial = props.modelValue ? parseISO(props.modelValue) : new Date()
const viewYear = ref(initial.getFullYear())
const viewMonth = ref(initial.getMonth())
const focusedDate = ref(props.modelValue ?? today)

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    const d = parseISO(v)
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
    focusedDate.value = v
  },
)

const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, i) => WEEKDAYS[(i + props.weekStartsOn) % 7]),
)

const monthLabel = computed(() => `${MONTHS[viewMonth.value]} ${viewYear.value}`)

const isDisabled = (iso: string) =>
  (props.min != null && iso < props.min) || (props.max != null && iso > props.max)

interface Cell {
  iso: string
  day: number
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
}

// 6 weeks × 7 days covering the view month.
const weeks = computed<Cell[][]>(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const offset = (firstDay - props.weekStartsOn + 7) % 7
  const start = new Date(viewYear.value, viewMonth.value, 1 - offset)

  const cells: Cell[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = toISO(d)
    return {
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() === viewMonth.value,
      isToday: iso === today,
      isSelected: iso === props.modelValue,
      disabled: isDisabled(iso),
    }
  })

  return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
})

function goToMonth(delta: number) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  // Keep a sensible focus target within the new month.
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const day = Math.min(parseISO(focusedDate.value).getDate(), daysInMonth)
  focusedDate.value = toISO(new Date(viewYear.value, viewMonth.value, day))
}

function ensureVisible(iso: string) {
  const d = parseISO(iso)
  if (d.getFullYear() !== viewYear.value || d.getMonth() !== viewMonth.value) {
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
  }
}

function select(iso: string) {
  if (isDisabled(iso)) return
  focusedDate.value = iso
  ensureVisible(iso)
  emit('update:modelValue', iso)
  emit('change', iso)
}

function moveFocus(deltaDays: number) {
  const d = parseISO(focusedDate.value)
  d.setDate(d.getDate() + deltaDays)
  const iso = toISO(d)
  focusedDate.value = iso
  ensureVisible(iso)
  nextTick(() => document.getElementById(cellId(iso))?.focus())
}

function onKeydown(event: KeyboardEvent) {
  const deltas: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  }
  if (event.key in deltas) {
    event.preventDefault()
    moveFocus(deltas[event.key])
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select(focusedDate.value)
  } else if (event.key === 'PageUp') {
    event.preventDefault()
    goToMonth(-1)
    nextTick(() => document.getElementById(cellId(focusedDate.value))?.focus())
  } else if (event.key === 'PageDown') {
    event.preventDefault()
    goToMonth(1)
    nextTick(() => document.getElementById(cellId(focusedDate.value))?.focus())
  } else if (event.key === 'Home') {
    event.preventDefault()
    const d = parseISO(focusedDate.value)
    const back = (d.getDay() - props.weekStartsOn + 7) % 7
    moveFocus(-back)
  } else if (event.key === 'End') {
    event.preventDefault()
    const d = parseISO(focusedDate.value)
    const back = (d.getDay() - props.weekStartsOn + 7) % 7
    moveFocus(6 - back)
  }
}

function cellClasses(cell: Cell) {
  return [
    'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]',
    cell.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
    cell.isSelected
      ? 'bg-[var(--color-brand)] font-medium text-white'
      : cell.isToday
        ? 'font-semibold text-[var(--color-brand)] ring-1 ring-[var(--color-brand)]'
        : cell.inMonth
          ? 'text-slate-900 hover:bg-slate-100'
          : 'text-slate-400 hover:bg-slate-100',
  ]
}

const navButton =
  'flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]'
</script>

<template>
  <div class="inline-block rounded-[var(--radius)] border border-slate-200 bg-white p-3">
    <div class="mb-2 flex items-center justify-between">
      <button type="button" :class="navButton" aria-label="Previous month" @click="goToMonth(-1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div aria-live="polite" class="text-sm font-medium text-slate-900">{{ monthLabel }}</div>
      <button type="button" :class="navButton" aria-label="Next month" @click="goToMonth(1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div role="grid" :aria-label="monthLabel" @keydown="onKeydown">
      <div role="row" class="grid grid-cols-7">
        <span
          v-for="wd in weekdays"
          :key="wd"
          role="columnheader"
          class="flex h-8 items-center justify-center text-xs font-medium text-slate-400"
        >
          {{ wd }}
        </span>
      </div>

      <div v-for="(week, w) in weeks" :key="w" role="row" class="grid grid-cols-7">
        <div v-for="cell in week" :key="cell.iso" role="gridcell" class="flex justify-center">
          <button
            :id="cellId(cell.iso)"
            type="button"
            :tabindex="cell.iso === focusedDate ? 0 : -1"
            :aria-selected="cell.isSelected"
            :aria-current="cell.isToday ? 'date' : undefined"
            :aria-disabled="cell.disabled || undefined"
            :class="cellClasses(cell)"
            @click="select(cell.iso)"
          >
            {{ cell.day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

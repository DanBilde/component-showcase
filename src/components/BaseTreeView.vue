<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

export interface TreeNode {
  label: string
  value?: string | number
  children?: TreeNode[]
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    nodes: TreeNode[]
    /** v-model — selected node value */
    modelValue?: string | number | null
    /** Expand all nodes on first render */
    defaultExpandAll?: boolean
  }>(),
  {
    modelValue: null,
    defaultExpandAll: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  select: [node: TreeNode]
}>()

const uid = useId()
const rowId = (id: string) => `${uid}-${id}`

interface FlatNode {
  node: TreeNode
  id: string
  level: number
  hasChildren: boolean
  expanded: boolean
  parentId: string | null
}

const expanded = ref<Set<string>>(new Set())

// Seed expanded state.
function collectAll(nodes: TreeNode[], parent: string, acc: Set<string>) {
  nodes.forEach((node, i) => {
    const id = parent ? `${parent}-${i}` : `${i}`
    if (node.children?.length) {
      acc.add(id)
      collectAll(node.children, id, acc)
    }
  })
}
if (props.defaultExpandAll) collectAll(props.nodes, '', expanded.value)

const activeId = ref<string | null>(null)

// Flatten into the currently-visible rows (respecting expanded state).
const visible = computed<FlatNode[]>(() => {
  const out: FlatNode[] = []
  const walk = (nodes: TreeNode[], level: number, parent: string, parentId: string | null) => {
    nodes.forEach((node, i) => {
      const id = parent ? `${parent}-${i}` : `${i}`
      const hasChildren = Boolean(node.children?.length)
      const isExpanded = expanded.value.has(id)
      out.push({ node, id, level, hasChildren, expanded: isExpanded, parentId })
      if (hasChildren && isExpanded) walk(node.children!, level + 1, id, id)
    })
  }
  walk(props.nodes, 0, '', null)
  return out
})

// Ensure a valid focus target exists.
watch(
  visible,
  (rows) => {
    if (!rows.length) {
      activeId.value = null
    } else if (!rows.some((r) => r.id === activeId.value)) {
      activeId.value = rows[0].id
    }
  },
  { immediate: true },
)

function focusRow(id: string) {
  nextTick(() => document.getElementById(rowId(id))?.focus())
}

function setActive(id: string) {
  activeId.value = id
  focusRow(id)
}

function toggle(row: FlatNode) {
  if (!row.hasChildren) return
  const next = new Set(expanded.value)
  next.has(row.id) ? next.delete(row.id) : next.add(row.id)
  expanded.value = next
}

function activate(row: FlatNode) {
  if (row.node.disabled) return
  if (row.hasChildren) {
    toggle(row)
  } else {
    emit('update:modelValue', row.node.value ?? row.node.label)
    emit('select', row.node)
  }
}

function indexOfActive(rows: FlatNode[]) {
  return rows.findIndex((r) => r.id === activeId.value)
}

function onKeydown(event: KeyboardEvent, row: FlatNode) {
  const rows = visible.value
  const i = indexOfActive(rows)
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (i < rows.length - 1) setActive(rows[i + 1].id)
      break
    case 'ArrowUp':
      event.preventDefault()
      if (i > 0) setActive(rows[i - 1].id)
      break
    case 'ArrowRight':
      event.preventDefault()
      if (row.hasChildren && !row.expanded) toggle(row)
      else if (row.hasChildren && row.expanded && i < rows.length - 1) setActive(rows[i + 1].id)
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (row.hasChildren && row.expanded) toggle(row)
      else if (row.parentId) setActive(row.parentId)
      break
    case 'Home':
      event.preventDefault()
      if (rows.length) setActive(rows[0].id)
      break
    case 'End':
      event.preventDefault()
      if (rows.length) setActive(rows[rows.length - 1].id)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      activate(row)
      break
  }
}

const isSelected = (row: FlatNode) =>
  props.modelValue != null && (row.node.value ?? row.node.label) === props.modelValue

function rowClasses(row: FlatNode) {
  return [
    'flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
    row.node.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    isSelected(row) ? 'bg-[var(--color-brand)] font-medium text-white' : 'text-slate-700 hover:bg-slate-100',
  ]
}
</script>

<template>
  <ul role="tree" class="select-none">
    <li
      v-for="row in visible"
      :key="row.id"
      role="treeitem"
      :aria-level="row.level + 1"
      :aria-expanded="row.hasChildren ? row.expanded : undefined"
      :aria-selected="isSelected(row)"
      :aria-disabled="row.node.disabled || undefined"
    >
      <button
        :id="rowId(row.id)"
        type="button"
        :tabindex="row.id === activeId ? 0 : -1"
        :class="rowClasses(row)"
        :style="{ paddingLeft: `${row.level * 1.25 + 0.5}rem` }"
        @click="setActive(row.id); activate(row)"
        @keydown="onKeydown($event, row)"
      >
        <svg
          v-if="row.hasChildren"
          :class="['shrink-0 transition-transform', row.expanded ? 'rotate-90' : '']"
          width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-else class="w-4 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ row.node.label }}</span>
      </button>
    </li>
  </ul>
</template>

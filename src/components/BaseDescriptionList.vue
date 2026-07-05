<script setup lang="ts">
import { computed } from 'vue'

type Layout = 'inline' | 'stacked'
type Size = 'sm' | 'md' | 'lg'

export interface DescriptionItem {
  term: string
  description?: string | number
}

const props = withDefaults(
  defineProps<{
    items?: DescriptionItem[]
    /** inline = term/value in two columns; stacked = term above value */
    layout?: Layout
    /** Divider lines between rows */
    divided?: boolean
    size?: Size
  }>(),
  {
    items: () => [],
    layout: 'inline',
    divided: false,
    size: 'md',
  },
)

const descSize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const rowPadding: Record<Size, string> = {
  sm: 'py-2',
  md: 'py-2.5',
  lg: 'py-3',
}

const listClasses = computed(() => [
  'flex flex-col',
  props.divided ? 'divide-y divide-slate-200' : 'gap-3',
])

const rowClasses = computed(() => [
  props.layout === 'inline' ? 'flex gap-4' : '',
  props.divided ? rowPadding[props.size] : '',
])

const termClasses = computed(() => [
  'text-sm font-medium text-slate-500',
  props.layout === 'inline' ? 'w-1/3 shrink-0' : '',
])

const descClasses = computed(() => [
  'text-slate-900',
  descSize[props.size],
  props.layout === 'inline' ? 'flex-1' : 'mt-0.5',
])
</script>

<template>
  <dl :class="listClasses">
    <div v-for="(item, index) in items" :key="item.term" :class="rowClasses">
      <dt :class="termClasses">{{ item.term }}</dt>
      <dd :class="descClasses">
        <slot name="value" :item="item" :index="index">{{ item.description }}</slot>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
type Variant = 'plain' | 'divided' | 'bordered'
type Size = 'sm' | 'md' | 'lg'

export interface ListItem {
  label?: string
  description?: string
  value?: string | number
  disabled?: boolean
  href?: string
}

const props = withDefaults(
  defineProps<{
    items?: ListItem[]
    variant?: Variant
    /** Rows become hoverable buttons/links that emit `select` */
    interactive?: boolean
    size?: Size
  }>(),
  {
    items: () => [],
    variant: 'divided',
    interactive: false,
    size: 'md',
  },
)

const emit = defineEmits<{ select: [item: ListItem, index: number] }>()

const containerClasses: Record<Variant, string> = {
  plain: '',
  divided: 'divide-y divide-slate-200',
  bordered: 'divide-y divide-slate-200 rounded-[var(--radius)] border border-slate-200 overflow-hidden',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-4 py-4 text-lg',
}

function rowTag(item: ListItem) {
  if (!props.interactive) return 'div'
  return item.href ? 'a' : 'button'
}

function rowClasses(item: ListItem) {
  return [
    'flex w-full items-center gap-3 text-left',
    sizeClasses[props.size],
    props.interactive && !item.disabled
      ? 'cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-brand)]'
      : '',
    item.disabled ? 'opacity-50' : '',
  ]
}

function onSelect(item: ListItem, index: number) {
  if (!props.interactive || item.disabled) return
  emit('select', item, index)
}
</script>

<template>
  <ul :class="containerClasses[variant]">
    <li v-for="(item, index) in items" :key="item.value ?? item.label ?? index">
      <component
        :is="rowTag(item)"
        :class="rowClasses(item)"
        :href="interactive && item.href ? item.href : undefined"
        :type="rowTag(item) === 'button' ? 'button' : undefined"
        :disabled="rowTag(item) === 'button' && item.disabled ? true : undefined"
        :aria-disabled="item.disabled || undefined"
        @click="onSelect(item, index)"
      >
        <span v-if="$slots.leading" class="shrink-0">
          <slot name="leading" :item="item" :index="index" />
        </span>

        <div class="min-w-0 flex-1">
          <slot name="item" :item="item" :index="index">
            <div class="font-medium text-slate-900">{{ item.label }}</div>
            <div v-if="item.description" class="text-sm text-slate-500">
              {{ item.description }}
            </div>
          </slot>
        </div>

        <span v-if="$slots.trailing" class="shrink-0">
          <slot name="trailing" :item="item" :index="index" />
        </span>
      </component>
    </li>
  </ul>
</template>

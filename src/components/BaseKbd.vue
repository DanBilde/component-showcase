<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** A single key or a combo; when omitted, uses the default slot */
    keys?: string | string[]
    size?: Size
    /** Character shown between combo keys */
    separator?: string
  }>(),
  {
    size: 'md',
    separator: '+',
  },
)

const keyList = computed(() => {
  if (props.keys == null) return null
  return Array.isArray(props.keys) ? props.keys : [props.keys]
})

const sizeClasses: Record<Size, string> = {
  sm: 'h-5 min-w-5 px-1 text-xs',
  md: 'h-6 min-w-6 px-1.5 text-xs',
  lg: 'h-7 min-w-7 px-2 text-sm',
}

const kbdClasses = computed(() => [
  'inline-flex items-center justify-center rounded border border-slate-300 bg-slate-50 font-medium text-slate-600 shadow-[inset_0_-1px_0_rgb(0_0_0/0.08)]',
  sizeClasses[props.size],
])
</script>

<template>
  <span v-if="keyList" class="inline-flex items-center gap-1 align-middle">
    <template v-for="(k, i) in keyList" :key="i">
      <kbd :class="kbdClasses">{{ k }}</kbd>
      <span
        v-if="i < keyList.length - 1"
        class="text-xs text-slate-400"
        aria-hidden="true"
      >
        {{ separator }}
      </span>
    </template>
  </span>
  <kbd v-else :class="[kbdClasses, 'align-middle']"><slot /></kbd>
</template>

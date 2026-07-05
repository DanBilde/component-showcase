<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    size?: Size
  }>(),
  {
    size: 'md',
  },
)

const iconWrap: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}
const titleSize: Record<Size, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
}
const padding: Record<Size, string> = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
}
</script>

<template>
  <div :class="['flex flex-col items-center px-4 text-center', padding[size]]">
    <div
      v-if="$slots.icon"
      :class="[
        'flex items-center justify-center rounded-full bg-slate-100 text-slate-400',
        iconWrap[size],
      ]"
    >
      <slot name="icon" />
    </div>

    <h3 v-if="title" :class="['mt-4 font-semibold text-slate-900', titleSize[size]]">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-1 max-w-sm text-sm text-slate-500">
      {{ description }}
    </p>

    <div v-if="$slots.default" class="mt-3 text-sm text-slate-600">
      <slot />
    </div>

    <div v-if="$slots.actions" class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

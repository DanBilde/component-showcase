<script setup lang="ts">
import { computed } from 'vue'

type Shape = 'text' | 'rect' | 'circle'
type Animation = 'pulse' | 'shimmer' | 'none'

const props = withDefaults(
  defineProps<{
    shape?: Shape
    /** CSS width (number → px). Used by rect; sets the diameter for circle. */
    width?: string | number
    /** CSS height (number → px). Used by rect. */
    height?: string | number
    /** Number of lines for the `text` shape */
    lines?: number
    animation?: Animation
  }>(),
  {
    shape: 'text',
    lines: 3,
    animation: 'pulse',
  },
)

const norm = (v?: string | number) =>
  v == null ? undefined : typeof v === 'number' ? `${v}px` : v

const blockClasses = computed(() => {
  if (props.animation === 'shimmer') return 'skeleton-shimmer'
  return props.animation === 'pulse' ? 'bg-slate-200 animate-pulse' : 'bg-slate-200'
})

const circleSize = computed(() => norm(props.width) ?? norm(props.height) ?? '3rem')
const rectStyle = computed(() => ({
  width: norm(props.width) ?? '100%',
  height: norm(props.height) ?? '6rem',
}))
</script>

<template>
  <div
    v-if="shape === 'text'"
    role="status"
    aria-label="Loading"
    aria-busy="true"
    class="flex w-full flex-col gap-2"
  >
    <span
      v-for="n in lines"
      :key="n"
      :class="['h-4 rounded', blockClasses]"
      :style="{ width: n === lines && lines > 1 ? '60%' : '100%' }"
    />
  </div>

  <div
    v-else-if="shape === 'circle'"
    role="status"
    aria-label="Loading"
    aria-busy="true"
    :class="['rounded-full', blockClasses]"
    :style="{ width: circleSize, height: circleSize }"
  />

  <div
    v-else
    role="status"
    aria-label="Loading"
    aria-busy="true"
    :class="['rounded-md', blockClasses]"
    :style="rectStyle"
  />
</template>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 37%, #e2e8f0 63%);
  background-size: 400% 100%;
  animation: skeleton-wave 1.4s ease infinite;
}

@keyframes skeleton-wave {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>

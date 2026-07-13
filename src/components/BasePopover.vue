<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

const props = withDefaults(
  defineProps<{
    placement?: Placement
    disabled?: boolean
  }>(),
  {
    placement: 'bottom-start',
    disabled: false,
  },
)

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function close() {
  open.value = false
}

function onPointerDown(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
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
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
}
</script>

<template>
  <div ref="root" class="relative inline-block" @keydown.escape="close">
    <div class="inline-flex" @click="toggle">
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
      <div
        v-if="open"
        role="dialog"
        :class="[
          'absolute z-30 min-w-[12rem] origin-top rounded-[var(--radius)] border border-slate-200 bg-white p-3 shadow-lg',
          placementClasses[placement],
        ]"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

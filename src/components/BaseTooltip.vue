<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, useSlots } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    /** Tooltip text (or use the `content` slot for richer markup) */
    content?: string
    placement?: Placement
    /** Delay in ms before the tooltip appears on hover/focus */
    openDelay?: number
    disabled?: boolean
    id?: string
  }>(),
  {
    placement: 'top',
    openDelay: 0,
    disabled: false,
  },
)

const slots = useSlots()
const uid = useId()
const tooltipId = computed(() => props.id ?? uid)
const hasContent = computed(() => Boolean(props.content) || Boolean(slots.content))

const visible = ref(false)
let openTimer: ReturnType<typeof setTimeout> | undefined

function show() {
  if (props.disabled || !hasContent.value) return
  clearTimeout(openTimer)
  if (props.openDelay > 0) {
    openTimer = setTimeout(() => (visible.value = true), props.openDelay)
  } else {
    visible.value = true
  }
}

function hide() {
  clearTimeout(openTimer)
  visible.value = false
}

onBeforeUnmount(() => clearTimeout(openTimer))

// Position the panel relative to the trigger wrapper.
const panelPlacement: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowPlacement: Record<Placement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-1',
}
</script>

<template>
  <span
    class="relative inline-flex"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown.escape="hide"
  >
    <slot />

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <span
        v-if="visible"
        :id="tooltipId"
        role="tooltip"
        :class="[
          'pointer-events-none absolute z-20 max-w-xs rounded bg-slate-900 px-2 py-1 text-xs text-white shadow-md',
          panelPlacement[placement],
        ]"
      >
        <slot name="content">{{ content }}</slot>
        <span
          :class="['absolute h-2 w-2 rotate-45 bg-slate-900', arrowPlacement[placement]]"
          aria-hidden="true"
        />
      </span>
    </Transition>
  </span>
</template>

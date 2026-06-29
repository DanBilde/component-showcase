<script setup lang="ts">
import { computed, onBeforeUnmount, useId, useSlots, watch } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model — controls whether the modal is open */
    modelValue?: boolean
    /** Heading shown in the header (also used as the accessible label) */
    title?: string
    size?: Size
    /** Close when the backdrop is clicked */
    closeOnBackdrop?: boolean
    /** Close when Escape is pressed */
    closeOnEsc?: boolean
    /** Hide the header's close (×) button */
    hideClose?: boolean
  }>(),
  {
    modelValue: false,
    size: 'md',
    closeOnBackdrop: true,
    closeOnEsc: true,
    hideClose: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const slots = useSlots()
const titleId = useId()

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

const showHeader = computed(
  () => Boolean(props.title) || !props.hideClose || Boolean(slots.header),
)

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onBackdrop() {
  if (props.closeOnBackdrop) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEsc) close()
}

// Toggle the global Escape listener and lock body scroll only while open.
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-slate-900/50" @click="onBackdrop" />

        <div
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :class="[
            'relative flex max-h-[85vh] w-full flex-col rounded-[var(--radius)] bg-white shadow-xl',
            sizeClasses[size],
          ]"
        >
          <header
            v-if="showHeader"
            class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"
          >
            <slot name="header">
              <h2
                v-if="title"
                :id="titleId"
                class="text-lg font-semibold text-slate-900"
              >
                {{ title }}
              </h2>
              <span v-else />
            </slot>

            <button
              v-if="!hideClose"
              type="button"
              class="-mr-1 inline-flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
              aria-label="Close"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </header>

          <div class="overflow-y-auto px-5 py-4 text-slate-700">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

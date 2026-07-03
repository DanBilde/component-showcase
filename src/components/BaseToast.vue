<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

type Variant = 'info' | 'success' | 'warning' | 'error'
type Position =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'
type Id = string | number

export interface Toast {
  id: Id
  variant?: Variant
  title?: string
  message?: string
  /** Per-toast auto-dismiss override (ms); falls back to the `duration` prop */
  duration?: number
  /** Show a close button (default true) */
  dismissible?: boolean
}

const props = withDefaults(
  defineProps<{
    toasts?: Toast[]
    position?: Position
    /** Default auto-dismiss delay in ms (0 disables) */
    duration?: number
  }>(),
  {
    toasts: () => [],
    position: 'bottom-right',
    duration: 4000,
  },
)

const emit = defineEmits<{ dismiss: [id: Id] }>()

// The container owns the timers so the TransitionGroup can animate removals.
const timers = new Map<Id, ReturnType<typeof setTimeout> | null>()

function syncTimers() {
  const ids = new Set(props.toasts.map((t) => t.id))
  for (const t of props.toasts) {
    if (timers.has(t.id)) continue
    const d = t.duration ?? props.duration
    timers.set(t.id, d > 0 ? setTimeout(() => emit('dismiss', t.id), d) : null)
  }
  for (const [id, timer] of timers) {
    if (!ids.has(id)) {
      if (timer) clearTimeout(timer)
      timers.delete(id)
    }
  }
}

watch(() => props.toasts.map((t) => t.id), syncTimers, { immediate: true })
onBeforeUnmount(() => timers.forEach((t) => t && clearTimeout(t)))

function close(id: Id) {
  const t = timers.get(id)
  if (t) clearTimeout(t)
  emit('dismiss', id)
}

const positionClasses: Record<Position, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

const variantClasses: Record<Variant, { container: string; icon: string; title: string; text: string }> = {
  info: { container: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', title: 'text-blue-900', text: 'text-blue-800' },
  success: { container: 'bg-green-50 border-green-200', icon: 'text-green-600', title: 'text-green-900', text: 'text-green-800' },
  warning: { container: 'bg-amber-50 border-amber-200', icon: 'text-amber-600', title: 'text-amber-900', text: 'text-amber-800' },
  error: { container: 'bg-red-50 border-red-200', icon: 'text-red-600', title: 'text-red-900', text: 'text-red-800' },
}

const styleFor = (v: Variant = 'info') => variantClasses[v]
const roleFor = (v: Variant = 'info') => (v === 'error' || v === 'warning' ? 'alert' : 'status')
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      :class="[
        'pointer-events-none fixed z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2',
        positionClasses[position],
      ]"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto w-full"
      >
        <div
          :role="roleFor(t.variant)"
          :class="['flex gap-3 rounded-[var(--radius)] border p-4 shadow-lg', styleFor(t.variant).container]"
        >
          <span :class="['mt-0.5 shrink-0', styleFor(t.variant).icon]" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="t.variant === 'success'">
                <circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" />
              </template>
              <template v-else-if="t.variant === 'warning'">
                <path d="M12 3L2 20h20L12 3z" /><path d="M12 10v4" /><path d="M12 17h.01" />
              </template>
              <template v-else-if="t.variant === 'error'">
                <circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />
              </template>
              <template v-else>
                <circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" />
              </template>
            </svg>
          </span>

          <div class="min-w-0 flex-1">
            <p v-if="t.title" :class="['font-medium', styleFor(t.variant).title]">{{ t.title }}</p>
            <div v-if="t.message" :class="['text-sm', styleFor(t.variant).text, t.title ? 'mt-0.5' : '']">
              {{ t.message }}
            </div>
          </div>

          <button
            v-if="t.dismissible !== false"
            type="button"
            :class="['-mr-1 -mt-1 shrink-0 self-start rounded p-1 opacity-60 transition-opacity hover:opacity-100', styleFor(t.variant).icon]"
            aria-label="Dismiss"
            @click="close(t.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
/* Take the leaving toast out of flow so the rest slide up smoothly. */
.toast-leave-active {
  position: absolute;
  width: 100%;
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>


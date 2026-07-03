<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type Variant = "info" | "success" | "warning" | "error";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    /** Optional bold heading above the message */
    title?: string;
    /** Show a close button that emits `dismiss` */
    dismissible?: boolean;
    /** Show the leading variant icon */
    icon?: boolean;
    /**
     * Auto-dismiss delay in ms. Only applies when NOT dismissible
     * (dismissible notifications wait for the user). Set 0 to disable.
     */
    duration?: number;
  }>(),
  {
    variant: "info",
    dismissible: false,
    icon: true,
    duration: 3000,
  },
);

const emit = defineEmits<{ dismiss: [] }>();

const visible = ref(true);
let timer: ReturnType<typeof setTimeout> | undefined;

function dismiss() {
  clearTimeout(timer);
  visible.value = false; // triggers the leave transition
}

// Emit only after the fade-out finishes, so a parent's `v-if` removal
// doesn't yank the element before the transition can play.
function onAfterLeave() {
  emit("dismiss");
}

// Non-dismissible notifications disappear on their own after `duration`.
function startTimer() {
  clearTimeout(timer);
  if (!props.dismissible && props.duration > 0) {
    timer = setTimeout(dismiss, props.duration);
  }
}

onMounted(startTimer);
watch(() => [props.dismissible, props.duration], startTimer);
onBeforeUnmount(() => clearTimeout(timer));

// error/warning interrupt (assertive); info/success are polite.
const role = computed(() =>
  props.variant === "error" || props.variant === "warning" ? "alert" : "status",
);

const variantClasses: Record<
  Variant,
  { container: string; icon: string; title: string; text: string }
> = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-900",
    text: "text-blue-800",
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-600",
    title: "text-green-900",
    text: "text-green-800",
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-900",
    text: "text-amber-800",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-600",
    title: "text-red-900",
    text: "text-red-800",
  },
};

const styles = computed(() => variantClasses[props.variant]);
</script>

<template>
  <Transition
    appear
    enter-active-class="transition duration-[2000ms] ease-out"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-[500ms] ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-1 scale-95"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="visible"
      :role="role"
      :class="[
        'flex gap-3 rounded-[var(--radius)] border p-4',
        styles.container,
      ]"
    >
      <span
        v-if="icon"
        :class="['mt-0.5 shrink-0', styles.icon]"
        aria-hidden="true"
      >
        <slot name="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <template v-if="variant === 'success'">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l3 3 5-6" />
            </template>
            <template v-else-if="variant === 'warning'">
              <path d="M12 3L2 20h20L12 3z" />
              <path d="M12 10v4" />
              <path d="M12 17h.01" />
            </template>
            <template v-else-if="variant === 'error'">
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </template>
            <template v-else>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </template>
          </svg>
        </slot>
      </span>

      <div class="min-w-0 flex-1">
        <p v-if="title" :class="['font-medium', styles.title]">{{ title }}</p>
        <div :class="['text-sm', styles.text, title ? 'mt-0.5' : '']">
          <slot />
        </div>
        <div v-if="$slots.actions" class="mt-3 flex flex-wrap gap-2">
          <slot name="actions" />
        </div>
      </div>

      <button
        v-if="dismissible"
        type="button"
        :class="[
          '-mr-1 -mt-1 shrink-0 self-start rounded p-1 opacity-60 transition-opacity hover:opacity-100',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
          styles.icon,
        ]"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

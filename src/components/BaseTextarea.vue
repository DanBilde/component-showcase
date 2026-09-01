<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Resize = 'none' | 'vertical' | 'both'

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: string
    size?: Size
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    required?: boolean
    id?: string
    name?: string
    /** Initial visible rows */
    rows?: number
    /** Auto-resize height to fit content (disables manual resize) */
    autoGrow?: boolean
    maxlength?: number
    /** Show a character counter (needs `maxlength`) */
    showCount?: boolean
    resize?: Resize
  }>(),
  {
    modelValue: '',
    size: 'md',
    disabled: false,
    required: false,
    rows: 3,
    autoGrow: false,
    showCount: false,
    resize: 'vertical',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const uid = useId()
const fieldId = computed(() => props.id ?? uid)
const describedBy = computed(() => {
  if (props.error) return `${fieldId.value}-error`
  if (props.hint) return `${fieldId.value}-hint`
  return undefined
})

const textareaEl = ref<HTMLTextAreaElement | null>(null)

function grow() {
  const el = textareaEl.value
  if (!el || !props.autoGrow) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  grow()
}

onMounted(grow)
watch(() => props.modelValue, () => nextTick(grow))

const showFooter = computed(
  () => Boolean(props.error) || Boolean(props.hint) || (props.showCount && props.maxlength != null),
)

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5',
  md: 'text-base py-2',
  lg: 'text-lg py-2.5',
}

const resizeClasses: Record<Resize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  both: 'resize',
}

const stateClasses = computed(() =>
  props.error
    ? 'border-danger focus-visible:border-danger focus-visible:ring-danger'
    : 'border-border-control focus-visible:border-brand focus-visible:ring-brand',
)

const textareaClasses = computed(() => [
  'w-full rounded-[var(--radius)] border bg-surface px-3 text-fg placeholder:text-fg-subtle',
  'transition-colors focus:outline-none focus-visible:ring-2',
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-subtle',
  sizeClasses[props.size],
  props.autoGrow ? 'resize-none overflow-hidden' : resizeClasses[props.resize],
  stateClasses.value,
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="fieldId"
      class="text-sm font-medium text-fg-muted"
    >
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <textarea
      :id="fieldId"
      ref="textareaEl"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="maxlength"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :class="textareaClasses"
      @input="onInput"
    />

    <div v-if="showFooter" class="flex justify-between gap-2 text-sm">
      <p v-if="error" :id="`${fieldId}-error`" class="text-danger">{{ error }}</p>
      <p v-else-if="hint" :id="`${fieldId}-hint`" class="text-fg-subtle">{{ hint }}</p>
      <span v-else />

      <span
        v-if="showCount && maxlength != null"
        class="shrink-0 tabular-nums text-fg-subtle"
      >
        {{ (modelValue ?? '').length }} / {{ maxlength }}
      </span>
    </div>
  </div>
</template>

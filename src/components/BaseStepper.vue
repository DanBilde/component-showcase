<script setup lang="ts">
export interface StepItem {
  label: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    steps: StepItem[]
    /** v-model — active step index (0-based) */
    modelValue?: number
    /** Allow clicking a step to navigate to it */
    clickable?: boolean
  }>(),
  {
    modelValue: 0,
    clickable: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
}>()

function go(index: number) {
  if (!props.clickable || index === props.modelValue) return
  emit('update:modelValue', index)
  emit('change', index)
}

function circleClasses(index: number) {
  const completed = index < props.modelValue
  const active = index === props.modelValue
  return [
    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
    completed
      ? 'border-brand bg-brand text-brand-on'
      : active
        ? 'border-brand bg-surface text-brand'
        : 'border-border-strong bg-surface text-fg-subtle',
    props.clickable ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand' : '',
  ]
}
</script>

<template>
  <ol class="flex items-start">
    <template v-for="(step, i) in steps" :key="i">
      <li class="flex flex-col items-center text-center">
        <component
          :is="clickable ? 'button' : 'div'"
          :type="clickable ? 'button' : undefined"
          :class="circleClasses(i)"
          :aria-current="i === modelValue ? 'step' : undefined"
          @click="go(i)"
        >
          <svg
            v-if="i < modelValue"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </component>

        <div class="mt-2 max-w-[10rem] px-1">
          <div
            :class="[
              'text-sm font-medium',
              i <= modelValue ? 'text-fg' : 'text-fg-subtle',
            ]"
          >
            {{ step.label }}
          </div>
          <div v-if="step.description" class="mt-0.5 text-xs text-fg-subtle">
            {{ step.description }}
          </div>
        </div>
      </li>

      <li
        v-if="i < steps.length - 1"
        class="mt-4 h-0.5 flex-1 rounded"
        :class="i < modelValue ? 'bg-brand' : 'bg-surface-strong'"
        aria-hidden="true"
      />
    </template>
  </ol>
</template>

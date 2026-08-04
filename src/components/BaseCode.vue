<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Code content (or use the default slot) */
    code?: string
    /** Render as a multi-line block instead of inline */
    block?: boolean
    /** Language label shown in the block header */
    language?: string
    /** Show a copy-to-clipboard button (block only) */
    copyable?: boolean
  }>(),
  {
    block: false,
    copyable: false,
  },
)

const codeEl = ref<HTMLElement | null>(null)
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  const text = codeEl.value?.textContent ?? props.code ?? ''
  try {
    await navigator.clipboard?.writeText(text)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard unavailable — ignore
  }
}
</script>

<template>
  <code
    v-if="!block"
    class="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
  >
    <slot>{{ code }}</slot>
  </code>

  <div v-else class="overflow-hidden rounded-[var(--radius)]">
    <div
      v-if="language || copyable"
      class="flex items-center justify-between bg-inverse px-4 py-1.5"
    >
      <span class="font-mono text-xs text-fg-subtle">{{ language }}</span>
      <button
        v-if="copyable"
        type="button"
        class="rounded text-xs text-fg-subtle transition-colors hover:text-inverse-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-subtle"
        @click="copy"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <pre class="overflow-x-auto bg-inverse p-4 text-sm leading-relaxed"><code ref="codeEl" class="font-mono text-inverse-fg"><slot>{{ code }}</slot></code></pre>
  </div>
</template>

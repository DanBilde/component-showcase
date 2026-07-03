import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseToast, { type Toast } from './BaseToast.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseToast',
  component: BaseToast,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
    },
    duration: { control: 'number' },
  },
  args: {
    position: 'bottom-right',
    duration: 4000,
  },
  render: (args) => ({
    components: { BaseToast, BaseButton },
    setup: () => {
      const toasts = ref<Toast[]>([])
      let seq = 0
      const samples: Record<string, Omit<Toast, 'id'>> = {
        info: { variant: 'info', title: 'Heads up', message: 'A new version is available.' },
        success: { variant: 'success', title: 'Saved', message: 'Your changes were saved.' },
        warning: { variant: 'warning', title: 'Careful', message: 'Your trial ends soon.' },
        error: { variant: 'error', title: 'Oops', message: 'Something went wrong.' },
      }
      function push(kind: keyof typeof samples) {
        toasts.value.push({ id: ++seq, ...samples[kind] })
      }
      function dismiss(id: Toast['id']) {
        toasts.value = toasts.value.filter((t) => t.id !== id)
      }
      return { args, toasts, push, dismiss }
    },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px">
        <BaseButton size="sm" @click="push('info')">Info</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="push('success')">Success</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="push('warning')">Warning</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="push('error')">Error</BaseButton>
      </div>
      <BaseToast v-bind="args" :toasts="toasts" @dismiss="dismiss" />
    `,
  }),
} satisfies Meta<typeof BaseToast>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TopCenter: Story = { args: { position: 'top-center' } }

export const Persistent: Story = {
  args: { duration: 0 },
}

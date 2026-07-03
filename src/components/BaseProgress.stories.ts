import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onUnmounted, ref } from 'vue'
import BaseProgress from './BaseProgress.vue'

const meta = {
  title: 'Components/BaseProgress',
  component: BaseProgress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    variant: {
      control: 'select',
      options: ['brand', 'success', 'warning', 'danger', 'neutral'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    showValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    value: 60,
    max: 100,
    variant: 'brand',
    size: 'md',
    showValue: false,
    indeterminate: false,
  },
  render: (args) => ({
    components: { BaseProgress },
    setup: () => ({ args }),
    template: '<div style="max-width:360px"><BaseProgress v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Uploading…', showValue: true, value: 45 },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Processing…' },
}

export const Variants: Story = {
  render: (args) => ({
    components: { BaseProgress },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:360px">
        <BaseProgress v-bind="args" variant="brand" :value="70" />
        <BaseProgress v-bind="args" variant="success" :value="100" />
        <BaseProgress v-bind="args" variant="warning" :value="55" />
        <BaseProgress v-bind="args" variant="danger" :value="30" />
        <BaseProgress v-bind="args" variant="neutral" :value="45" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseProgress },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:360px">
        <BaseProgress v-bind="args" size="sm" :value="60" />
        <BaseProgress v-bind="args" size="md" :value="60" />
        <BaseProgress v-bind="args" size="lg" :value="60" />
      </div>
    `,
  }),
}

// Live demo: value climbs to 100, then loops.
export const Animated: Story = {
  render: (args) => ({
    components: { BaseProgress },
    setup: () => {
      const value = ref(0)
      const id = setInterval(() => {
        value.value = value.value >= 100 ? 0 : value.value + 5
      }, 400)
      onUnmounted(() => clearInterval(id))
      return { args, value }
    },
    template:
      '<div style="max-width:360px"><BaseProgress v-bind="args" :value="value" label="Downloading…" show-value /></div>',
  }),
}

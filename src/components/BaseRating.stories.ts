import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import BaseRating from './BaseRating.vue'

const meta = {
  title: 'Components/BaseRating',
  component: BaseRating,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: { type: 'number', min: 0, step: 0.5 } },
    max: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    readonly: { control: 'boolean' },
    allowHalf: { control: 'boolean' },
    showValue: { control: 'boolean' },
  },
  args: {
    modelValue: 3,
    max: 5,
    size: 'md',
    readonly: false,
    allowHalf: false,
    showValue: false,
  },
  render: (args) => ({
    components: { BaseRating },
    setup: () => {
      const value = ref(args.modelValue ?? 0)
      watch(() => args.modelValue, (v) => (value.value = v ?? 0))
      return { args, value }
    },
    template: '<BaseRating v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof BaseRating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const HalfSteps: Story = {
  args: { allowHalf: true, modelValue: 3.5, showValue: true },
}

export const ReadOnly: Story = {
  args: { readonly: true, allowHalf: true, modelValue: 4.5, showValue: true },
}

export const TenStars: Story = {
  args: { max: 10, modelValue: 7 },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseRating },
    setup: () => {
      const sm = ref(3)
      const md = ref(3)
      const lg = ref(3)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start">
        <BaseRating v-model="sm" size="sm" />
        <BaseRating v-model="md" size="md" />
        <BaseRating v-model="lg" size="lg" />
      </div>
    `,
  }),
}

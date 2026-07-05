import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import BaseSlider from './BaseSlider.vue'

const meta = {
  title: 'Components/BaseSlider',
  component: BaseSlider,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    modelValue: 50,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    label: 'Volume',
    showValue: true,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseSlider },
    setup: () => {
      const value = ref(args.modelValue ?? 0)
      watch(() => args.modelValue, (v) => (value.value = v ?? 0))
      return { args, value }
    },
    template: '<div style="max-width:360px"><BaseSlider v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Steps: Story = {
  args: { step: 10, label: 'Rating', modelValue: 30 },
}

export const CustomRange: Story = {
  args: { min: -20, max: 40, modelValue: 21, label: 'Temperature (°C)' },
}

export const WithHint: Story = {
  args: { hint: 'Drag to adjust the volume.' },
}

export const WithError: Story = {
  args: { error: 'Please choose a lower value.', modelValue: 90 },
}

export const Disabled: Story = {
  args: { disabled: true, modelValue: 40 },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSlider },
    setup: () => {
      const sm = ref(30)
      const md = ref(50)
      const lg = ref(70)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:360px">
        <BaseSlider v-model="sm" size="sm" label="Small" show-value />
        <BaseSlider v-model="md" size="md" label="Medium" show-value />
        <BaseSlider v-model="lg" size="lg" label="Large" show-value />
      </div>
    `,
  }),
}

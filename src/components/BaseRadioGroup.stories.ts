import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseRadioGroup from './BaseRadioGroup.vue'

type Value = string | number

const plans = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
]

const meta = {
  title: 'Components/BaseRadioGroup',
  component: BaseRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Plan',
    size: 'md',
    orientation: 'vertical',
    options: plans,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseRadioGroup },
    setup: () => {
      const value = ref<Value | null>(null)
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseRadioGroup v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Preselected: Story = {
  render: (args) => ({
    components: { BaseRadioGroup },
    setup: () => {
      const value = ref<Value | null>('pro')
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseRadioGroup v-bind="args" v-model="value" /></div>',
  }),
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
}

export const WithHint: Story = {
  args: { hint: 'You can change your plan at any time.' },
}

export const WithError: Story = {
  args: { error: 'Please choose a plan.', required: true },
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Pro', value: 'pro' },
      { label: 'Enterprise (contact sales)', value: 'enterprise', disabled: true },
    ],
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { BaseRadioGroup },
    setup: () => {
      const value = ref<Value | null>('starter')
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseRadioGroup v-bind="args" v-model="value" :disabled="true" /></div>',
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseRadioGroup },
    setup: () => {
      const sm = ref<Value | null>('starter')
      const md = ref<Value | null>('starter')
      const lg = ref<Value | null>('starter')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:320px">
        <BaseRadioGroup v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseRadioGroup v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseRadioGroup v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseSegmentedControl from './BaseSegmentedControl.vue'

const view = [
  { label: 'List', value: 'list' },
  { label: 'Board', value: 'board' },
  { label: 'Calendar', value: 'calendar' },
]

const meta = {
  title: 'Components/BaseSegmentedControl',
  component: BaseSegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    options: view,
    size: 'md',
    fullWidth: false,
    disabled: false,
    ariaLabel: 'View mode',
  },
  render: (args) => ({
    components: { BaseSegmentedControl },
    setup: () => {
      const value = ref('list')
      return { args, value }
    },
    template: '<BaseSegmentedControl v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof BaseSegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoOptions: Story = {
  args: {
    options: [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' },
    ],
  },
  render: (args) => ({
    components: { BaseSegmentedControl },
    setup: () => {
      const value = ref('monthly')
      return { args, value }
    },
    template: '<BaseSegmentedControl v-bind="args" v-model="value" />',
  }),
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => ({
    components: { BaseSegmentedControl },
    setup: () => {
      const value = ref('board')
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseSegmentedControl v-bind="args" v-model="value" /></div>',
  }),
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived (soon)', value: 'archived', disabled: true },
    ],
  },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSegmentedControl },
    setup: () => {
      const sm = ref('list')
      const md = ref('list')
      const lg = ref('list')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start">
        <BaseSegmentedControl v-bind="args" v-model="sm" size="sm" />
        <BaseSegmentedControl v-bind="args" v-model="md" size="md" />
        <BaseSegmentedControl v-bind="args" v-model="lg" size="lg" />
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTag from './BaseTag.vue'

const meta = {
  title: 'Components/BaseTag',
  component: BaseTag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    pill: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
  args: {
    variant: 'neutral',
    size: 'md',
    pill: false,
    removable: false,
  },
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: '<BaseTag v-bind="args">Label</BaseTag>',
  }),
} satisfies Meta<typeof BaseTag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Brand: Story = { args: { variant: 'brand' } }

export const Pill: Story = { args: { variant: 'brand', pill: true } }

export const Removable: Story = { args: { variant: 'brand', removable: true } }

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px">
        <BaseTag v-bind="args" size="sm">Small</BaseTag>
        <BaseTag v-bind="args" size="md">Medium</BaseTag>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px">
        <BaseTag v-bind="args" variant="neutral">Neutral</BaseTag>
        <BaseTag v-bind="args" variant="brand">Brand</BaseTag>
        <BaseTag v-bind="args" variant="success">Success</BaseTag>
        <BaseTag v-bind="args" variant="warning">Warning</BaseTag>
        <BaseTag v-bind="args" variant="danger">Danger</BaseTag>
      </div>
    `,
  }),
}

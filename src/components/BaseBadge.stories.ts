import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseBadge from './BaseBadge.vue'

const meta = {
  title: 'Components/BaseBadge',
  component: BaseBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger'],
    },
    appearance: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
  },
  args: {
    variant: 'neutral',
    appearance: 'subtle',
    size: 'md',
    dot: false,
  },
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: '<BaseBadge v-bind="args">Badge</BaseBadge>',
  }),
} satisfies Meta<typeof BaseBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Solid: Story = { args: { appearance: 'solid', variant: 'brand' } }

export const WithDot: Story = {
  args: { variant: 'success', dot: true },
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: '<BaseBadge v-bind="args">Active</BaseBadge>',
  }),
}

export const Counts: Story = {
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:10px">
        <BaseBadge v-bind="args" appearance="solid" variant="brand">3</BaseBadge>
        <BaseBadge v-bind="args" appearance="solid" variant="danger">12</BaseBadge>
        <BaseBadge v-bind="args" appearance="solid" variant="neutral">99+</BaseBadge>
      </div>
    `,
  }),
}

export const StatusDots: Story = {
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:8px">
        <span style="display:inline-flex; align-items:center; gap:8px"><BaseBadge v-bind="args" variant="success" dot /> Online</span>
        <span style="display:inline-flex; align-items:center; gap:8px"><BaseBadge v-bind="args" variant="warning" dot /> Away</span>
        <span style="display:inline-flex; align-items:center; gap:8px"><BaseBadge v-bind="args" variant="danger" dot /> Offline</span>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:10px">
        <BaseBadge v-bind="args" size="sm">Small</BaseBadge>
        <BaseBadge v-bind="args" size="md">Medium</BaseBadge>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: (args) => ({
    components: { BaseBadge },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:10px">
        <div style="display:flex; flex-wrap:wrap; gap:8px">
          <BaseBadge v-bind="args" appearance="subtle" variant="neutral">Neutral</BaseBadge>
          <BaseBadge v-bind="args" appearance="subtle" variant="brand">Brand</BaseBadge>
          <BaseBadge v-bind="args" appearance="subtle" variant="success">Success</BaseBadge>
          <BaseBadge v-bind="args" appearance="subtle" variant="warning">Warning</BaseBadge>
          <BaseBadge v-bind="args" appearance="subtle" variant="danger">Danger</BaseBadge>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px">
          <BaseBadge v-bind="args" appearance="solid" variant="neutral">Neutral</BaseBadge>
          <BaseBadge v-bind="args" appearance="solid" variant="brand">Brand</BaseBadge>
          <BaseBadge v-bind="args" appearance="solid" variant="success">Success</BaseBadge>
          <BaseBadge v-bind="args" appearance="solid" variant="warning">Warning</BaseBadge>
          <BaseBadge v-bind="args" appearance="solid" variant="danger">Danger</BaseBadge>
        </div>
      </div>
    `,
  }),
}

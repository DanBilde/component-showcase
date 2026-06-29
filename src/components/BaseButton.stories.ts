import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: (args) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: '<BaseButton v-bind="args">Button</BaseButton>',
  }),
} satisfies Meta<typeof BaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Disabled: Story = { args: { disabled: true } }

export const AsLink: Story = {
  args: { href: 'https://example.com', variant: 'secondary' },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px">
        <BaseButton v-bind="args" size="sm">Small</BaseButton>
        <BaseButton v-bind="args" size="md">Medium</BaseButton>
        <BaseButton v-bind="args" size="lg">Large</BaseButton>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:12px">
        <BaseButton v-bind="args" variant="primary">Primary</BaseButton>
        <BaseButton v-bind="args" variant="secondary">Secondary</BaseButton>
        <BaseButton v-bind="args" variant="ghost">Ghost</BaseButton>
      </div>
    `,
  }),
}

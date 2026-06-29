import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppButton from './AppButton.vue'

const meta = {
  title: 'Components/AppButton',
  component: AppButton,
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
    components: { AppButton },
    setup: () => ({ args }),
    template: '<AppButton v-bind="args">Button</AppButton>',
  }),
} satisfies Meta<typeof AppButton>

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
    components: { AppButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px">
        <AppButton v-bind="args" size="sm">Small</AppButton>
        <AppButton v-bind="args" size="md">Medium</AppButton>
        <AppButton v-bind="args" size="lg">Large</AppButton>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: (args) => ({
    components: { AppButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:12px">
        <AppButton v-bind="args" variant="primary">Primary</AppButton>
        <AppButton v-bind="args" variant="secondary">Secondary</AppButton>
        <AppButton v-bind="args" variant="ghost">Ghost</AppButton>
      </div>
    `,
  }),
}

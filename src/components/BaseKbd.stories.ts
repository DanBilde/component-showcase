import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseKbd from './BaseKbd.vue'

const meta = {
  title: 'Components/BaseKbd',
  component: BaseKbd,
  tags: ['autodocs'],
  argTypes: {
    keys: { control: 'object' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    separator: { control: 'text' },
  },
  args: {
    keys: ['⌘', 'K'],
    size: 'md',
    separator: '+',
  },
  render: (args) => ({
    components: { BaseKbd },
    setup: () => ({ args }),
    template: '<BaseKbd v-bind="args" />',
  }),
} satisfies Meta<typeof BaseKbd>

export default meta
type Story = StoryObj<typeof meta>

export const Combo: Story = {}

export const SingleKey: Story = {
  render: () => ({
    components: { BaseKbd },
    template: '<BaseKbd>Esc</BaseKbd>',
  }),
}

export const CtrlCombo: Story = {
  args: { keys: ['Ctrl', 'Shift', 'P'] },
}

export const SpaceSeparator: Story = {
  args: { keys: ['⌘', 'K'], separator: ' ' },
}

export const InText: Story = {
  render: (args) => ({
    components: { BaseKbd },
    setup: () => ({ args }),
    template: `
      <p style="color:#334155">
        Press <BaseKbd :keys="['⌘','K']" /> to open the command palette, or <BaseKbd>/</BaseKbd> to search.
      </p>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseKbd },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:16px">
        <BaseKbd :keys="['⌘','K']" size="sm" />
        <BaseKbd :keys="['⌘','K']" size="md" />
        <BaseKbd :keys="['⌘','K']" size="lg" />
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSpinner from './BaseSpinner.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseSpinner',
  component: BaseSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['brand', 'neutral', 'white', 'current'] },
    label: { control: 'text' },
  },
  args: {
    size: 'md',
    color: 'brand',
    label: 'Loading',
  },
  render: (args) => ({
    components: { BaseSpinner },
    setup: () => ({ args }),
    template: '<BaseSpinner v-bind="args" />',
  }),
} satisfies Meta<typeof BaseSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSpinner },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:16px">
        <BaseSpinner v-bind="args" size="xs" />
        <BaseSpinner v-bind="args" size="sm" />
        <BaseSpinner v-bind="args" size="md" />
        <BaseSpinner v-bind="args" size="lg" />
        <BaseSpinner v-bind="args" size="xl" />
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: (args) => ({
    components: { BaseSpinner },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:20px">
        <BaseSpinner v-bind="args" color="brand" />
        <BaseSpinner v-bind="args" color="neutral" />
        <span style="background:#1f2d3d; padding:10px; border-radius:8px; display:inline-flex">
          <BaseSpinner v-bind="args" color="white" />
        </span>
      </div>
    `,
  }),
}

export const InButton: Story = {
  render: (args) => ({
    components: { BaseSpinner, BaseButton },
    setup: () => ({ args }),
    // color="current" makes the spinner inherit the button's text color.
    template: `
      <div style="display:flex; align-items:center; gap:12px">
        <BaseButton disabled>
          <template #iconLeft><BaseSpinner size="sm" color="current" label="Saving" /></template>
          Saving…
        </BaseButton>
        <BaseButton variant="secondary" disabled>
          <template #iconLeft><BaseSpinner size="sm" color="current" label="Loading" /></template>
          Loading
        </BaseButton>
      </div>
    `,
  }),
}

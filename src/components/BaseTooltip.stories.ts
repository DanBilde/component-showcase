import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTooltip from './BaseTooltip.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseTooltip',
  component: BaseTooltip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    openDelay: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    content: 'Saves your changes',
    placement: 'top',
    openDelay: 0,
    disabled: false,
  },
  render: (args) => ({
    components: { BaseTooltip, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; justify-content:center; padding:56px">
        <BaseTooltip v-bind="args"><BaseButton>Hover or focus me</BaseButton></BaseTooltip>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Placements: Story = {
  render: (args) => ({
    components: { BaseTooltip, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:grid; grid-template-columns:repeat(2, max-content); gap:24px; justify-content:center; padding:64px">
        <BaseTooltip v-bind="args" placement="top" content="Top tooltip"><BaseButton variant="secondary">Top</BaseButton></BaseTooltip>
        <BaseTooltip v-bind="args" placement="right" content="Right tooltip"><BaseButton variant="secondary">Right</BaseButton></BaseTooltip>
        <BaseTooltip v-bind="args" placement="bottom" content="Bottom tooltip"><BaseButton variant="secondary">Bottom</BaseButton></BaseTooltip>
        <BaseTooltip v-bind="args" placement="left" content="Left tooltip"><BaseButton variant="secondary">Left</BaseButton></BaseTooltip>
      </div>
    `,
  }),
}

export const WithDelay: Story = {
  args: { openDelay: 400, content: 'Appears after 400ms' },
}

export const OnIconButton: Story = {
  args: { content: 'Settings' },
  render: (args) => ({
    components: { BaseTooltip, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; justify-content:center; padding:56px">
        <BaseTooltip v-bind="args">
          <BaseButton variant="ghost" aria-label="Settings">⚙️</BaseButton>
        </BaseTooltip>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true, content: 'You will not see this' },
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BasePopover from './BasePopover.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BasePopover',
  component: BasePopover,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    placement: 'bottom-start',
    disabled: false,
  },
  render: (args) => ({
    components: { BasePopover, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:40px">
        <BasePopover v-bind="args">
          <template #trigger><BaseButton variant="secondary">Open popover</BaseButton></template>
          <div style="font-size:14px; color:#334155">
            <p style="margin:0 0 6px; font-weight:600; color:#0f172a">Popover title</p>
            <p style="margin:0">Any content can go here — text, forms, actions.</p>
          </div>
        </BasePopover>
      </div>
    `,
  }),
} satisfies Meta<typeof BasePopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AlignEnd: Story = { args: { placement: 'bottom-end' } }

export const Top: Story = {
  args: { placement: 'top-start' },
  render: (args) => ({
    components: { BasePopover, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:120px 40px 40px">
        <BasePopover v-bind="args">
          <template #trigger><BaseButton variant="secondary">Open above</BaseButton></template>
          <p style="margin:0; font-size:14px; color:#334155">This popover opens above the trigger.</p>
        </BasePopover>
      </div>
    `,
  }),
}

export const WithCloseAction: Story = {
  render: (args) => ({
    components: { BasePopover, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:40px">
        <BasePopover v-bind="args">
          <template #trigger><BaseButton>Delete item</BaseButton></template>
          <template #default="{ close }">
            <p style="margin:0 0 10px; font-size:14px; color:#334155">Delete this item?</p>
            <div style="display:flex; gap:8px; justify-content:flex-end">
              <BaseButton size="sm" variant="ghost" @click="close">Cancel</BaseButton>
              <BaseButton size="sm" @click="close">Delete</BaseButton>
            </div>
          </template>
        </BasePopover>
      </div>
    `,
  }),
}

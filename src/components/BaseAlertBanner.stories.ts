import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseAlertBanner from './BaseAlertBanner.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseAlertBanner',
  component: BaseAlertBanner,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    appearance: { control: 'inline-radio', options: ['subtle', 'solid'] },
    dismissible: { control: 'boolean' },
    icon: { control: 'boolean' },
    center: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    appearance: 'subtle',
    dismissible: false,
    icon: true,
    center: false,
  },
  render: (args) => ({
    components: { BaseAlertBanner },
    setup: () => ({ args }),
    template: '<BaseAlertBanner v-bind="args">A new version of the app is available.</BaseAlertBanner>',
  }),
} satisfies Meta<typeof BaseAlertBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Subtle: Story = {}

export const Solid: Story = {
  args: { appearance: 'solid', variant: 'success' },
  render: (args) => ({
    components: { BaseAlertBanner },
    setup: () => ({ args }),
    template: '<BaseAlertBanner v-bind="args">Your changes have been published.</BaseAlertBanner>',
  }),
}

export const Centered: Story = {
  args: { center: true, appearance: 'solid', variant: 'info', icon: false },
  render: (args) => ({
    components: { BaseAlertBanner },
    setup: () => ({ args }),
    template: '<BaseAlertBanner v-bind="args">🎉 Free shipping on all orders this week!</BaseAlertBanner>',
  }),
}

export const WithAction: Story = {
  args: { variant: 'warning' },
  render: (args) => ({
    components: { BaseAlertBanner, BaseButton },
    setup: () => ({ args }),
    template: `
      <BaseAlertBanner v-bind="args">
        Your subscription expires in 3 days.
        <template #actions>
          <BaseButton size="sm">Renew</BaseButton>
        </template>
      </BaseAlertBanner>
    `,
  }),
}

export const Dismissible: Story = {
  args: { dismissible: true, variant: 'error' },
  render: (args) => ({
    components: { BaseAlertBanner, BaseButton },
    setup: () => {
      const show = ref(true)
      return { args, show }
    },
    template: `
      <div>
        <BaseAlertBanner v-if="show" v-bind="args" @dismiss="show = false">
          We're experiencing degraded performance. Some features may be slow.
        </BaseAlertBanner>
        <div v-else style="padding:12px">
          <BaseButton size="sm" variant="secondary" @click="show = true">Show banner</BaseButton>
        </div>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { BaseAlertBanner },
    template: `
      <div style="display:flex; flex-direction:column; gap:8px">
        <BaseAlertBanner variant="info">Informational message.</BaseAlertBanner>
        <BaseAlertBanner variant="success">Everything worked.</BaseAlertBanner>
        <BaseAlertBanner variant="warning">Heads up, check this.</BaseAlertBanner>
        <BaseAlertBanner variant="error">Something went wrong.</BaseAlertBanner>
      </div>
    `,
  }),
}

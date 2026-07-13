import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseTimeline from './BaseTimeline.vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'

const order = [
  { time: '09:00', title: 'Order placed', description: 'Your order #1234 was received.', variant: 'brand' as const },
  { time: '11:30', title: 'Payment confirmed', description: 'We received your payment.', variant: 'success' as const },
  { time: '14:00', title: 'Shipped', description: 'Your package left the warehouse.', variant: 'neutral' as const },
  { time: 'Pending', title: 'Delivered', description: 'Estimated tomorrow by 5pm.', variant: 'neutral' as const },
]

const meta = {
  title: 'Components/BaseTimeline',
  component: BaseTimeline,
  tags: ['autodocs'],
  args: {
    items: order,
  },
  render: (args) => ({
    components: { BaseTimeline },
    setup: () => ({ args }),
    template: '<div style="max-width:420px"><BaseTimeline v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  args: {
    items: [
      { time: 'Mon', title: 'Info event', variant: 'brand' },
      { time: 'Tue', title: 'Completed', variant: 'success' },
      { time: 'Wed', title: 'Needs attention', variant: 'warning' },
      { time: 'Thu', title: 'Failed', variant: 'danger' },
      { time: 'Fri', title: 'Idle', variant: 'neutral' },
    ],
  },
}

export const TitleOnly: Story = {
  args: {
    items: [
      { title: 'Created the project' },
      { title: 'Invited the team' },
      { title: 'Shipped v1.0' },
    ],
  },
}

export const CustomMarkers: Story = {
  render: (args) => ({
    components: { BaseTimeline },
    setup: () => ({ args }),
    template: `
      <div style="max-width:420px">
        <BaseTimeline v-bind="args">
          <template #marker="{ item }">
            <span
              class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white"
              :class="item.variant === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-[var(--color-brand)]'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path v-if="item.variant === 'success'" d="M5 13l4 4L19 7" />
                <circle v-else cx="12" cy="12" r="9" stroke-width="2" />
              </svg>
            </span>
          </template>
        </BaseTimeline>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: (args) => ({
    components: { BaseTimeline, BaseCard, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="max-width:420px">
        <BaseCard title="Order status">
          <BaseTimeline v-bind="args" />
          <template #footer>
            <BaseButton size="sm" variant="secondary">Track package</BaseButton>
          </template>
        </BaseCard>
      </div>
    `,
  }),
}

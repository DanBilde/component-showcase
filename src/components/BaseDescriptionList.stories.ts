import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseDescriptionList from './BaseDescriptionList.vue'
import BaseBadge from './BaseBadge.vue'
import BaseCard from './BaseCard.vue'

const profile = [
  { term: 'Name', description: 'Ada Lovelace' },
  { term: 'Email', description: 'ada@example.com' },
  { term: 'Plan', description: 'Pro' },
  { term: 'Member since', description: 'March 2021' },
]

const meta = {
  title: 'Components/BaseDescriptionList',
  component: BaseDescriptionList,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'inline-radio', options: ['inline', 'stacked'] },
    divided: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    layout: 'inline',
    divided: false,
    size: 'md',
    items: profile,
  },
  render: (args) => ({
    components: { BaseDescriptionList },
    setup: () => ({ args }),
    template: '<div style="max-width:420px"><BaseDescriptionList v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseDescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Inline: Story = {}

export const Stacked: Story = { args: { layout: 'stacked' } }

export const Divided: Story = { args: { divided: true } }

export const WithCustomValue: Story = {
  args: { divided: true },
  render: (args) => ({
    components: { BaseDescriptionList, BaseBadge },
    setup: () => {
      const items = [
        { term: 'Name', description: 'Ada Lovelace' },
        { term: 'Email', description: 'ada@example.com' },
        { term: 'Status', description: 'active' },
      ]
      return { args, items }
    },
    template: `
      <div style="max-width:420px">
        <BaseDescriptionList v-bind="args" :items="items">
          <template #value="{ item }">
            <BaseBadge v-if="item.term === 'Status'" variant="success" dot>Active</BaseBadge>
            <span v-else>{{ item.description }}</span>
          </template>
        </BaseDescriptionList>
      </div>
    `,
  }),
}

export const OrderSummaryInCard: Story = {
  render: (args) => ({
    components: { BaseDescriptionList, BaseCard },
    setup: () => {
      const items = [
        { term: 'Subtotal', description: '$120.00' },
        { term: 'Shipping', description: '$8.00' },
        { term: 'Tax', description: '$10.24' },
        { term: 'Total', description: '$138.24' },
      ]
      return { args, items }
    },
    template: `
      <div style="max-width:360px">
        <BaseCard title="Order summary">
          <BaseDescriptionList :items="items" divided />
        </BaseCard>
      </div>
    `,
  }),
}

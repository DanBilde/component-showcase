import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseStat from './BaseStat.vue'
import BaseCard from './BaseCard.vue'

const meta = {
  title: 'Components/BaseStat',
  component: BaseStat,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    delta: { control: 'text' },
    deltaSuffix: { control: 'text' },
    deltaLabel: { control: 'text' },
    trend: { control: 'inline-radio', options: ['up', 'down', 'neutral'] },
    positiveIsGood: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Revenue',
    value: '$48,120',
    delta: 12.5,
    deltaSuffix: '%',
    deltaLabel: 'vs last month',
    positiveIsGood: true,
    size: 'md',
  },
  render: (args) => ({
    components: { BaseStat },
    setup: () => ({ args }),
    template: '<div style="max-width:260px"><BaseStat v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseStat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Negative: Story = {
  args: { label: 'Active users', value: '8,204', delta: -3.2 },
}

// "up" is bad here (higher churn), so the color inverts to red.
export const InvertedColor: Story = {
  args: { label: 'Churn rate', value: '4.7%', delta: 0.8, positiveIsGood: false },
}

export const NoDelta: Story = {
  args: { label: 'Total projects', value: '128', delta: undefined, deltaLabel: undefined },
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { BaseStat },
    setup: () => ({ args }),
    template: `
      <div style="max-width:260px">
        <BaseStat v-bind="args">
          <template #icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" />
            </svg>
          </template>
        </BaseStat>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: (args) => ({
    components: { BaseStat, BaseCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width:260px">
        <BaseCard variant="elevated">
          <BaseStat v-bind="args" />
        </BaseCard>
      </div>
    `,
  }),
}

export const Dashboard: Story = {
  render: (args) => ({
    components: { BaseStat, BaseCard },
    setup: () => {
      const stats = [
        { label: 'Revenue', value: '$48,120', delta: 12.5, deltaSuffix: '%', deltaLabel: 'vs last month' },
        { label: 'New customers', value: '312', delta: 8.1, deltaSuffix: '%', deltaLabel: 'vs last month' },
        { label: 'Refunds', value: '$1,240', delta: 2.4, deltaSuffix: '%', deltaLabel: 'vs last month', positiveIsGood: false },
        { label: 'Churn rate', value: '4.7%', delta: -0.5, deltaSuffix: '%', deltaLabel: 'vs last month', positiveIsGood: false },
      ]
      return { args, stats }
    },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px">
        <BaseCard v-for="s in stats" :key="s.label" variant="elevated">
          <BaseStat v-bind="s" />
        </BaseCard>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseStat },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:32px">
        <BaseStat v-bind="args" size="sm" />
        <BaseStat v-bind="args" size="md" />
        <BaseStat v-bind="args" size="lg" />
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseEmptyState from './BaseEmptyState.vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'

const inboxIcon = `
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
`

const meta = {
  title: 'Components/BaseEmptyState',
  component: BaseEmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    title: 'No messages yet',
    description: 'Start a conversation and your messages will appear here.',
    size: 'md',
  },
  render: (args) => ({
    components: { BaseEmptyState, BaseButton },
    setup: () => ({ args, inboxIcon }),
    template: `
      <div style="max-width:440px">
        <BaseEmptyState v-bind="args">
          <template #icon><span v-html="inboxIcon" /></template>
          <template #actions><BaseButton>New message</BaseButton></template>
        </BaseEmptyState>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoIcon: Story = {
  render: (args) => ({
    components: { BaseEmptyState, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="max-width:440px">
        <BaseEmptyState v-bind="args">
          <template #actions><BaseButton>New message</BaseButton></template>
        </BaseEmptyState>
      </div>
    `,
  }),
}

export const WithoutAction: Story = {
  args: { title: 'No results found', description: 'Try adjusting your search or filters.' },
  render: (args) => ({
    components: { BaseEmptyState },
    setup: () => ({ args, inboxIcon }),
    template: `
      <div style="max-width:440px">
        <BaseEmptyState v-bind="args">
          <template #icon><span v-html="inboxIcon" /></template>
        </BaseEmptyState>
      </div>
    `,
  }),
}

export const TwoActions: Story = {
  render: (args) => ({
    components: { BaseEmptyState, BaseButton },
    setup: () => ({ args, inboxIcon }),
    template: `
      <div style="max-width:440px">
        <BaseEmptyState v-bind="args">
          <template #icon><span v-html="inboxIcon" /></template>
          <template #actions>
            <BaseButton>New message</BaseButton>
            <BaseButton variant="secondary">Import</BaseButton>
          </template>
        </BaseEmptyState>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: (args) => ({
    components: { BaseEmptyState, BaseButton, BaseCard },
    setup: () => ({ args, inboxIcon }),
    template: `
      <div style="max-width:440px">
        <BaseCard padding="none">
          <BaseEmptyState v-bind="args">
            <template #icon><span v-html="inboxIcon" /></template>
            <template #actions><BaseButton>New message</BaseButton></template>
          </BaseEmptyState>
        </BaseCard>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseEmptyState },
    setup: () => ({ args, inboxIcon }),
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:440px">
        <BaseEmptyState v-bind="args" size="sm" title="Small"><template #icon><span v-html="inboxIcon" /></template></BaseEmptyState>
        <BaseEmptyState v-bind="args" size="md" title="Medium"><template #icon><span v-html="inboxIcon" /></template></BaseEmptyState>
        <BaseEmptyState v-bind="args" size="lg" title="Large"><template #icon><span v-html="inboxIcon" /></template></BaseEmptyState>
      </div>
    `,
  }),
}

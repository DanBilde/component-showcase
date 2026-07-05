import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseList from './BaseList.vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseBadge from './BaseBadge.vue'

const settings = [
  { label: 'Profile', description: 'Manage your personal information' },
  { label: 'Notifications', description: 'Configure how you receive alerts' },
  { label: 'Billing', description: 'Update your plan and payment method' },
  { label: 'Security', description: 'Password and two-factor authentication' },
]

const meta = {
  title: 'Components/BaseList',
  component: BaseList,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'divided', 'bordered'] },
    interactive: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'divided',
    interactive: false,
    size: 'md',
    items: settings,
  },
  render: (args) => ({
    components: { BaseList },
    setup: () => ({ args }),
    template: '<div style="max-width:420px"><BaseList v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Bordered: Story = { args: { variant: 'bordered' } }

export const Interactive: Story = {
  args: { variant: 'bordered', interactive: true },
  render: (args) => ({
    components: { BaseList },
    setup: () => {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <div style="max-width:420px">
        <BaseList v-bind="args" @select="(item) => (selected = item.label)" />
        <p style="margin-top:12px; font-size:14px; color:#64748b">Selected: {{ selected || '—' }}</p>
      </div>
    `,
  }),
}

export const WithLeadingAndTrailing: Story = {
  args: { variant: 'bordered', interactive: true },
  render: (args) => ({
    components: { BaseList, BaseAvatar, BaseBadge },
    setup: () => {
      const people = [
        { label: 'Ada Lovelace', description: 'ada@example.com', value: 1 },
        { label: 'Grace Hopper', description: 'grace@example.com', value: 2 },
        { label: 'Alan Turing', description: 'alan@example.com', value: 3 },
      ]
      return { args, people }
    },
    template: `
      <div style="max-width:420px">
        <BaseList v-bind="args" :items="people">
          <template #leading="{ item }">
            <BaseAvatar :name="item.label" size="sm" />
          </template>
          <template #trailing>
            <BaseBadge variant="success" dot>Active</BaseBadge>
          </template>
        </BaseList>
      </div>
    `,
  }),
}

export const CustomItem: Story = {
  render: (args) => ({
    components: { BaseList },
    setup: () => {
      const files = [
        { label: 'report.pdf', value: '2.4 MB' },
        { label: 'photo.jpg', value: '1.1 MB' },
        { label: 'notes.txt', value: '12 KB' },
      ]
      return { args, files }
    },
    template: `
      <div style="max-width:420px">
        <BaseList variant="bordered" :items="files">
          <template #item="{ item }">
            <div style="display:flex; justify-content:space-between; gap:8px">
              <span style="font-weight:500; color:#0f172a">{{ item.label }}</span>
              <span style="color:#94a3b8; font-variant-numeric:tabular-nums">{{ item.value }}</span>
            </div>
          </template>
        </BaseList>
      </div>
    `,
  }),
}

export const WithDisabledRow: Story = {
  args: {
    variant: 'bordered',
    interactive: true,
    items: [
      { label: 'Profile', description: 'Manage your personal information' },
      { label: 'Team (upgrade required)', description: 'Invite and manage members', disabled: true },
      { label: 'Billing', description: 'Update your plan and payment method' },
    ],
  },
}

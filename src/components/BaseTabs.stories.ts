import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseTabs from './BaseTabs.vue'

const tabs = [
  { label: 'Account', value: 'account' },
  { label: 'Password', value: 'password' },
  { label: 'Notifications', value: 'notifications' },
]

const panels = `
  <template #account><p>Manage your account details, name, and email address.</p></template>
  <template #password><p>Update your password and review recent sign-in activity.</p></template>
  <template #notifications><p>Choose which emails and push notifications you receive.</p></template>
`

const meta = {
  title: 'Components/BaseTabs',
  component: BaseTabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['underline', 'pills'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    variant: 'underline',
    size: 'md',
    ariaLabel: 'Account settings',
    tabs,
  },
  render: (args) => ({
    components: { BaseTabs },
    setup: () => {
      const active = ref<string | number>('account')
      return { args, active }
    },
    template: `<div style="max-width:480px"><BaseTabs v-bind="args" v-model="active">${panels}</BaseTabs></div>`,
  }),
} satisfies Meta<typeof BaseTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pills: Story = { args: { variant: 'pills' } }

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { label: 'Account', value: 'account' },
      { label: 'Password', value: 'password' },
      { label: 'Billing (soon)', value: 'billing', disabled: true },
      { label: 'Notifications', value: 'notifications' },
    ],
  },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseTabs },
    setup: () => {
      const sm = ref<string | number>('account')
      const md = ref<string | number>('account')
      const lg = ref<string | number>('account')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:28px; max-width:480px">
        <BaseTabs v-bind="args" v-model="sm" size="sm">${panels}</BaseTabs>
        <BaseTabs v-bind="args" v-model="md" size="md">${panels}</BaseTabs>
        <BaseTabs v-bind="args" v-model="lg" size="lg">${panels}</BaseTabs>
      </div>
    `,
  }),
}

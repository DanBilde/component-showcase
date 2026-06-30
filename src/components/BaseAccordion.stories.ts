import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseAccordion from './BaseAccordion.vue'

type Value = string | number

const items = [
  { title: 'What is your return policy?', value: 'returns' },
  { title: 'How long does shipping take?', value: 'shipping' },
  { title: 'Do you ship internationally?', value: 'international' },
]

const panels = `
  <template #returns><p>Returns are accepted within 30 days of delivery, in original condition.</p></template>
  <template #shipping><p>Orders ship within 1–2 business days and arrive in 3–5 days.</p></template>
  <template #international><p>Yes — we ship to most countries; duties are calculated at checkout.</p></template>
`

const meta = {
  title: 'Components/BaseAccordion',
  component: BaseAccordion,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    headingLevel: { control: 'number' },
  },
  args: {
    items,
    multiple: false,
    headingLevel: 3,
  },
  render: (args) => ({
    components: { BaseAccordion },
    setup: () => {
      const open = ref<Value[]>(['returns'])
      return { args, open }
    },
    template: `<div style="max-width:520px"><BaseAccordion v-bind="args" v-model="open">${panels}</BaseAccordion></div>`,
  }),
} satisfies Meta<typeof BaseAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => ({
    components: { BaseAccordion },
    setup: () => {
      const open = ref<Value[]>(['returns', 'shipping'])
      return { args, open }
    },
    template: `<div style="max-width:520px"><BaseAccordion v-bind="args" v-model="open">${panels}</BaseAccordion></div>`,
  }),
}

export const AllClosed: Story = {
  render: (args) => ({
    components: { BaseAccordion },
    setup: () => {
      const open = ref<Value[]>([])
      return { args, open }
    },
    template: `<div style="max-width:520px"><BaseAccordion v-bind="args" v-model="open">${panels}</BaseAccordion></div>`,
  }),
}

export const WithDisabledItem: Story = {
  args: {
    items: [
      { title: 'What is your return policy?', value: 'returns' },
      { title: 'Enterprise plans (coming soon)', value: 'enterprise', disabled: true },
      { title: 'How long does shipping take?', value: 'shipping' },
    ],
  },
}

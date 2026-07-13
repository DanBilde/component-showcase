import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseChipInput from './BaseChipInput.vue'

const meta = {
  title: 'Components/BaseChipInput',
  component: BaseChipInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    max: { control: 'number' },
    allowDuplicates: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Tags',
    placeholder: 'Type and press Enter…',
    size: 'md',
    hint: 'Press Enter or comma to add a tag.',
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseChipInput },
    setup: () => {
      const value = ref<string[]>(['vue', 'typescript'])
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseChipInput v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseChipInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  render: (args) => ({
    components: { BaseChipInput },
    setup: () => {
      const value = ref<string[]>([])
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseChipInput v-bind="args" v-model="value" /></div>',
  }),
}

export const WithError: Story = {
  args: { error: 'Add at least three tags.', required: true },
}

export const MaxThree: Story = {
  args: { max: 3, hint: 'Up to 3 tags.' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseChipInput },
    setup: () => {
      const sm = ref<string[]>(['small'])
      const md = ref<string[]>(['medium'])
      const lg = ref<string[]>(['large'])
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:420px">
        <BaseChipInput v-bind="args" v-model="sm" size="sm" label="Small" :hint="undefined" />
        <BaseChipInput v-bind="args" v-model="md" size="md" label="Medium" :hint="undefined" />
        <BaseChipInput v-bind="args" v-model="lg" size="lg" label="Large" :hint="undefined" />
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseMultiSelect from './BaseMultiSelect.vue'

type Value = string | number

const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Solid', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
]

const meta = {
  title: 'Components/BaseMultiSelect',
  component: BaseMultiSelect,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Frameworks',
    placeholder: 'Choose frameworks…',
    size: 'md',
    options: frameworks,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseMultiSelect },
    setup: () => {
      const value = ref<Value[]>([])
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseMultiSelect v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseMultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Preselected: Story = {
  render: (args) => ({
    components: { BaseMultiSelect },
    setup: () => {
      const value = ref<Value[]>(['vue', 'svelte'])
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseMultiSelect v-bind="args" v-model="value" /></div>',
  }),
}

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Ember (deprecated)', value: 'ember', disabled: true },
      { label: 'Backbone (deprecated)', value: 'backbone', disabled: true },
      { label: 'Svelte', value: 'svelte' },
    ],
  },
}

export const WithHint: Story = {
  args: { hint: 'Pick every framework this project supports.' },
}

export const WithError: Story = {
  args: { error: 'Select at least one framework.', required: true },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { BaseMultiSelect },
    setup: () => {
      const value = ref<Value[]>(['vue', 'react'])
      return { args, value }
    },
    template:
      '<div style="max-width:320px"><BaseMultiSelect v-bind="args" v-model="value" /></div>',
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseMultiSelect },
    setup: () => {
      const sm = ref<Value[]>([])
      const md = ref<Value[]>([])
      const lg = ref<Value[]>([])
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:320px">
        <BaseMultiSelect v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseMultiSelect v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseMultiSelect v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

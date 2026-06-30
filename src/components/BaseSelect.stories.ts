import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseSelect from './BaseSelect.vue'

const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Solid', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
]

const meta = {
  title: 'Components/BaseSelect',
  component: BaseSelect,
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
    label: 'Framework',
    placeholder: 'Choose a framework…',
    size: 'md',
    options: frameworks,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseSelect },
    setup: () => {
      const value = ref<string | number | null>(null)
      return { args, value }
    },
    template: '<div style="max-width:320px"><BaseSelect v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Preselected: Story = {
  render: (args) => ({
    components: { BaseSelect },
    setup: () => {
      const value = ref<string | number | null>('svelte')
      return { args, value }
    },
    template: '<div style="max-width:320px"><BaseSelect v-bind="args" v-model="value" /></div>',
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
  args: { hint: 'Pick the framework this project uses.' },
}

export const WithError: Story = {
  args: { error: 'A framework is required.', required: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSelect },
    setup: () => {
      const sm = ref<string | number | null>(null)
      const md = ref<string | number | null>(null)
      const lg = ref<string | number | null>(null)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:320px">
        <BaseSelect v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseSelect v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseSelect v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

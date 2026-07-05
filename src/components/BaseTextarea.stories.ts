import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseTextarea from './BaseTextarea.vue'

const meta = {
  title: 'Components/BaseTextarea',
  component: BaseTextarea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'both'] },
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    autoGrow: { control: 'boolean' },
    showCount: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Message',
    placeholder: 'Write your message…',
    size: 'md',
    rows: 3,
    resize: 'vertical',
    autoGrow: false,
    showCount: false,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseTextarea },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseTextarea v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: 'Markdown is supported.' },
}

export const WithError: Story = {
  args: { error: 'Message is required.', required: true },
}

export const CharacterCount: Story = {
  args: { maxlength: 200, showCount: true, hint: 'Keep it short and sweet.' },
  render: (args) => ({
    components: { BaseTextarea },
    setup: () => {
      const value = ref('The quick brown fox jumps over the lazy dog.')
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseTextarea v-bind="args" v-model="value" /></div>',
  }),
}

export const AutoGrow: Story = {
  args: { autoGrow: true, hint: 'This grows as you type.', rows: 2 },
  render: (args) => ({
    components: { BaseTextarea },
    setup: () => {
      const value = ref('Type a few lines…\nand watch the field grow to fit the content.')
      return { args, value }
    },
    template: '<div style="max-width:420px"><BaseTextarea v-bind="args" v-model="value" /></div>',
  }),
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Unavailable' },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseTextarea },
    setup: () => {
      const sm = ref('')
      const md = ref('')
      const lg = ref('')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:420px">
        <BaseTextarea v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseTextarea v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseTextarea v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

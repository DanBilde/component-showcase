import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const meta = {
  title: 'Components/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    type: 'text',
    size: 'md',
    label: 'Email',
    placeholder: 'you@example.com',
    disabled: false,
    required: false,
  },
  // A local ref makes the field interactive inside the canvas.
  render: (args) => ({
    components: { BaseInput },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: '<BaseInput v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof BaseInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

export const WithHint: Story = {
  args: { hint: "We'll never share your email." },
}

export const WithError: Story = {
  args: { error: 'Please enter a valid email address.' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Unavailable' },
}

export const Password: Story = {
  args: { type: 'password', label: 'Password', placeholder: '••••••••' },
}

export const WithPrefixAndSuffix: Story = {
  args: { label: 'Amount', placeholder: '0.00' },
  render: (args) => ({
    components: { BaseInput },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: `
      <BaseInput v-bind="args" v-model="value">
        <template #prefix>$</template>
        <template #suffix>USD</template>
      </BaseInput>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => {
      const sm = ref('')
      const md = ref('')
      const lg = ref('')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:320px">
        <BaseInput v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseInput v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseInput v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

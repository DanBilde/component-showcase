import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseSwitch from './BaseSwitch.vue'

const meta = {
  title: 'Components/BaseSwitch',
  component: BaseSwitch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Enable notifications',
    size: 'md',
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseSwitch },
    setup: () => {
      const on = ref(false)
      return { args, on }
    },
    template: '<BaseSwitch v-bind="args" v-model="on" />',
  }),
} satisfies Meta<typeof BaseSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const On: Story = {
  render: (args) => ({
    components: { BaseSwitch },
    setup: () => {
      const on = ref(true)
      return { args, on }
    },
    template: '<BaseSwitch v-bind="args" v-model="on" />',
  }),
}

export const WithHint: Story = {
  args: { hint: 'You can turn this off at any time.' },
}

export const WithError: Story = {
  args: { error: 'This setting is required.', required: true },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable setting' },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSwitch },
    setup: () => {
      const sm = ref(true)
      const md = ref(true)
      const lg = ref(true)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px">
        <BaseSwitch v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseSwitch v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseSwitch v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

export const SettingsList: Story = {
  render: (args) => ({
    components: { BaseSwitch },
    setup: () => {
      const wifi = ref(true)
      const bluetooth = ref(false)
      const airplane = ref(false)
      return { args, wifi, bluetooth, airplane }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:280px">
        <BaseSwitch v-model="wifi" label="Wi-Fi" />
        <BaseSwitch v-model="bluetooth" label="Bluetooth" />
        <BaseSwitch v-model="airplane" label="Airplane mode" />
      </div>
    `,
  }),
}

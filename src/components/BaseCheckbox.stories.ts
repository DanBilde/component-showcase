import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

const meta = {
  title: 'Components/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'I accept the terms and conditions',
    size: 'md',
    indeterminate: false,
    disabled: false,
    required: false,
  },
  render: (args) => ({
    components: { BaseCheckbox },
    setup: () => {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<BaseCheckbox v-bind="args" v-model="checked" />',
  }),
} satisfies Meta<typeof BaseCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  render: (args) => ({
    components: { BaseCheckbox },
    setup: () => {
      const checked = ref(true)
      return { args, checked }
    },
    template: '<BaseCheckbox v-bind="args" v-model="checked" />',
  }),
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all' },
}

export const WithHint: Story = {
  args: { label: 'Email me product updates', hint: 'No more than once a week.' },
}

export const WithError: Story = {
  args: { error: 'You must accept to continue.', required: true },
}

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable option' },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseCheckbox },
    setup: () => {
      const sm = ref(true)
      const md = ref(true)
      const lg = ref(true)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px">
        <BaseCheckbox v-bind="args" v-model="sm" size="sm" label="Small" />
        <BaseCheckbox v-bind="args" v-model="md" size="md" label="Medium" />
        <BaseCheckbox v-bind="args" v-model="lg" size="lg" label="Large" />
      </div>
    `,
  }),
}

// Real-world indeterminate: a parent "select all" reflecting child state.
export const SelectAllGroup: Story = {
  render: (args) => ({
    components: { BaseCheckbox },
    setup: () => {
      const channels = ref([
        { label: 'Email', checked: true },
        { label: 'SMS', checked: false },
        { label: 'Push', checked: false },
      ])
      const allChecked = computed(() => channels.value.every((c) => c.checked))
      const indeterminate = computed(
        () => channels.value.some((c) => c.checked) && !allChecked.value,
      )
      function toggleAll(value: boolean) {
        channels.value.forEach((c) => (c.checked = value))
      }
      return { args, channels, allChecked, indeterminate, toggleAll }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:10px">
        <BaseCheckbox
          :model-value="allChecked"
          :indeterminate="indeterminate"
          label="All notifications"
          @update:model-value="toggleAll"
        />
        <div style="display:flex; flex-direction:column; gap:10px; margin-left:28px">
          <BaseCheckbox
            v-for="c in channels"
            :key="c.label"
            v-model="c.checked"
            :label="c.label"
          />
        </div>
      </div>
    `,
  }),
}

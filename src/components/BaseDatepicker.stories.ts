import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import BaseDatepicker from './BaseDatepicker.vue'

const meta = {
  title: 'Components/BaseDatepicker',
  component: BaseDatepicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    modelValue: null,
    weekStartsOn: 1,
    size: 'md',
    label: 'Start date',
    placeholder: 'Select a date',
  },
  render: (args) => ({
    components: { BaseDatepicker },
    setup: () => {
      const value = ref(args.modelValue ?? null)
      watch(() => args.modelValue, (v) => (value.value = v ?? null))
      return { args, value }
    },
    // min-height reserves room so the (absolutely-positioned) calendar popover is
    // fully visible within the Storybook frame; not needed in a real app.
    template: '<div style="max-width:280px; min-height:420px"><BaseDatepicker v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof BaseDatepicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Preselected: Story = {
  args: { modelValue: '2026-07-20' },
}

export const WithMinMax: Story = {
  args: { modelValue: '2026-07-20', min: '2026-07-06', max: '2026-07-31', hint: 'July only.' },
}

export const WithError: Story = {
  args: { error: 'A date is required.', required: true },
}

export const Disabled: Story = {
  args: { modelValue: '2026-07-20', disabled: true },
}

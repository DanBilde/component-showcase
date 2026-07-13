import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import BaseCalendar from './BaseCalendar.vue'

const meta = {
  title: 'Components/BaseCalendar',
  component: BaseCalendar,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
  },
  args: {
    modelValue: '2026-07-15',
    weekStartsOn: 1,
  },
  render: (args) => ({
    components: { BaseCalendar },
    setup: () => {
      const value = ref(args.modelValue ?? null)
      watch(() => args.modelValue, (v) => (value.value = v ?? null))
      return { args, value }
    },
    template: `
      <div>
        <BaseCalendar v-bind="args" v-model="value" />
        <p style="margin-top:12px; font-size:14px; color:#64748b">Selected: {{ value || '—' }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WeekStartsSunday: Story = {
  args: { weekStartsOn: 0 },
}

export const WithMinMax: Story = {
  args: { modelValue: '2026-07-15', min: '2026-07-06', max: '2026-07-24' },
}

export const NoSelection: Story = {
  render: (args) => ({
    components: { BaseCalendar },
    setup: () => {
      const value = ref<string | null>(null)
      return { args, value }
    },
    template: `
      <div>
        <BaseCalendar v-bind="args" v-model="value" />
        <p style="margin-top:12px; font-size:14px; color:#64748b">Selected: {{ value || '—' }}</p>
      </div>
    `,
  }),
}

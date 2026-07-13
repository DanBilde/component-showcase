import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseMenu from './BaseMenu.vue'
import BaseButton from './BaseButton.vue'

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Share', value: 'share' },
  { divider: true },
  { label: 'Delete', value: 'delete', danger: true },
]

const meta = {
  title: 'Components/BaseMenu',
  component: BaseMenu,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end'] },
    disabled: { control: 'boolean' },
  },
  args: {
    items,
    placement: 'bottom-start',
    disabled: false,
  },
  render: (args) => ({
    components: { BaseMenu, BaseButton },
    setup: () => {
      const last = ref('')
      return { args, last }
    },
    template: `
      <div style="padding:40px">
        <BaseMenu v-bind="args" @select="(item) => (last = item.value)">
          <template #trigger><BaseButton variant="secondary">Actions ▾</BaseButton></template>
        </BaseMenu>
        <p style="margin-top:12px; font-size:14px; color:#64748b">Last selected: {{ last || '—' }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AlignEnd: Story = { args: { placement: 'bottom-end' } }

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: 'Open', value: 'open' },
      { label: 'Rename', value: 'rename' },
      { label: 'Move (upgrade required)', value: 'move', disabled: true },
      { divider: true },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  },
}

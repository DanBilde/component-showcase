import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseTreeView from './BaseTreeView.vue'

const tree = [
  {
    label: 'src',
    value: 'src',
    children: [
      {
        label: 'components',
        value: 'components',
        children: [
          { label: 'BaseButton.vue', value: 'button' },
          { label: 'BaseCard.vue', value: 'card' },
          { label: 'BaseModal.vue', value: 'modal' },
        ],
      },
      { label: 'style.css', value: 'style' },
      { label: 'main.ts', value: 'main' },
    ],
  },
  {
    label: 'public',
    value: 'public',
    children: [
      { label: 'favicon.svg', value: 'favicon' },
      { label: 'avatar.jpg', value: 'avatar' },
    ],
  },
  { label: 'package.json', value: 'package' },
  { label: 'README.md', value: 'readme' },
]

const meta = {
  title: 'Components/BaseTreeView',
  component: BaseTreeView,
  tags: ['autodocs'],
  argTypes: {
    defaultExpandAll: { control: 'boolean' },
  },
  args: {
    nodes: tree,
    defaultExpandAll: false,
  },
  render: (args) => ({
    components: { BaseTreeView },
    setup: () => {
      const selected = ref<string | number | null>(null)
      return { args, selected }
    },
    template: `
      <div style="max-width:320px">
        <BaseTreeView v-bind="args" v-model="selected" />
        <p style="margin-top:12px; font-size:14px; color:#64748b">Selected: {{ selected || '—' }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseTreeView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ExpandedByDefault: Story = {
  args: { defaultExpandAll: true },
}

export const WithDisabledNode: Story = {
  args: {
    nodes: [
      {
        label: 'Accessible folder',
        value: 'a',
        children: [{ label: 'file-1.txt', value: 'f1' }, { label: 'file-2.txt', value: 'f2' }],
      },
      { label: 'Locked folder', value: 'locked', disabled: true, children: [{ label: 'secret.txt', value: 's' }] },
    ],
    defaultExpandAll: true,
  },
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseCommandPalette from './BaseCommandPalette.vue'
import BaseButton from './BaseButton.vue'
import BaseKbd from './BaseKbd.vue'

const commands = [
  { value: 'new', label: 'New file', description: 'Create a new document', group: 'Actions', shortcut: '⌘N', keywords: ['create'] },
  { value: 'open', label: 'Open file', group: 'Actions', shortcut: '⌘O' },
  { value: 'save', label: 'Save', group: 'Actions', shortcut: '⌘S' },
  { value: 'profile', label: 'Go to profile', group: 'Navigation', keywords: ['account', 'user'] },
  { value: 'settings', label: 'Go to settings', group: 'Navigation', keywords: ['preferences'] },
  { value: 'billing', label: 'Go to billing', group: 'Navigation' },
  { value: 'theme', label: 'Toggle dark mode', group: 'Preferences' },
  { value: 'logout', label: 'Log out', group: 'Preferences' },
]

const meta = {
  title: 'Components/BaseCommandPalette',
  component: BaseCommandPalette,
  tags: ['autodocs'],
  args: {
    items: commands,
    placeholder: 'Type a command or search…',
  },
  render: (args) => ({
    components: { BaseCommandPalette, BaseButton, BaseKbd },
    setup: () => {
      const open = ref(false)
      const last = ref('')
      return { args, open, last }
    },
    template: `
      <div>
        <BaseButton variant="secondary" @click="open = true">
          Open command palette&nbsp; <BaseKbd :keys="['⌘','K']" size="sm" />
        </BaseButton>
        <p style="margin-top:12px; font-size:14px; color:#64748b">Last run: {{ last || '—' }}</p>
        <BaseCommandPalette v-bind="args" v-model="open" @select="(item) => (last = item.label)" />
      </div>
    `,
  }),
} satisfies Meta<typeof BaseCommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Fewer items + custom placeholder; still opened via the button (a command
// palette is a full-viewport overlay, so it can't be shown "inside" a story box).
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search actions…',
    items: [
      { value: 'new', label: 'New file', shortcut: '⌘N' },
      { value: 'search', label: 'Search everywhere', shortcut: '⌘⇧F' },
      { value: 'settings', label: 'Open settings', shortcut: '⌘,' },
    ],
  },
}

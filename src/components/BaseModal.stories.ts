import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    hideClose: { control: 'boolean' },
  },
  args: {
    title: 'Delete project',
    size: 'md',
    closeOnBackdrop: true,
    closeOnEsc: true,
    hideClose: false,
  },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <BaseButton @click="open = true">Open modal</BaseButton>
      <BaseModal v-bind="args" v-model="open">
        <p>This action cannot be undone. This will permanently delete the project and all of its data.</p>
        <template #footer>
          <BaseButton variant="ghost" @click="open = false">Cancel</BaseButton>
          <BaseButton @click="open = false">Delete</BaseButton>
        </template>
      </BaseModal>
    `,
  }),
} satisfies Meta<typeof BaseModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutFooter: Story = {
  args: { title: 'About' },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <BaseButton @click="open = true">Open modal</BaseButton>
      <BaseModal v-bind="args" v-model="open">
        <p>A simple message dialog with no footer actions — close it with the × button, the backdrop, or Escape.</p>
      </BaseModal>
    `,
  }),
}

export const Persistent: Story = {
  args: {
    title: 'Unsaved changes',
    closeOnBackdrop: false,
    closeOnEsc: false,
    hideClose: true,
  },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <BaseButton @click="open = true">Open modal</BaseButton>
      <BaseModal v-bind="args" v-model="open">
        <p>This dialog ignores backdrop clicks and Escape — the user must choose an explicit action.</p>
        <template #footer>
          <BaseButton variant="ghost" @click="open = false">Discard</BaseButton>
          <BaseButton @click="open = false">Save</BaseButton>
        </template>
      </BaseModal>
    `,
  }),
}

export const LongContent: Story = {
  args: { title: 'Terms of service', size: 'lg' },
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(false)
      const paragraphs = Array.from({ length: 12 }, (_, i) => i + 1)
      return { args, open, paragraphs }
    },
    template: `
      <BaseButton @click="open = true">Open modal</BaseButton>
      <BaseModal v-bind="args" v-model="open">
        <p v-for="n in paragraphs" :key="n" style="margin-bottom: 0.75rem">
          {{ n }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. The body scrolls
          while the header and footer stay pinned.
        </p>
        <template #footer>
          <BaseButton @click="open = false">Accept</BaseButton>
        </template>
      </BaseModal>
    `,
  }),
}

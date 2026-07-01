import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseAvatar from './BaseAvatar.vue'

// Served from public/avatar.jpg (falls back to initials until the file is added).
const photo = '/avatar.jpg'

const meta = {
  title: 'Components/BaseAvatar',
  component: BaseAvatar,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'select', options: ['online', 'away', 'busy', 'offline'] },
    ring: { control: 'boolean' },
  },
  args: {
    src: photo,
    name: 'Mihai Bilde',
    size: 'md',
    shape: 'circle',
    ring: false,
  },
  render: (args) => ({
    components: { BaseAvatar },
    setup: () => ({ args }),
    template: '<BaseAvatar v-bind="args" />',
  }),
} satisfies Meta<typeof BaseAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Image: Story = {}

export const Initials: Story = {
  args: { src: undefined, name: 'Grace Hopper' },
}

export const BrokenImageFallsBack: Story = {
  args: { src: 'https://example.com/does-not-exist.jpg', name: 'Alan Turing' },
}

export const IconFallback: Story = {
  args: { src: undefined, name: undefined },
}

export const WithStatus: Story = {
  args: { status: 'online' },
}

export const Shapes: Story = {
  render: (args) => ({
    components: { BaseAvatar },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:16px">
        <BaseAvatar v-bind="args" shape="circle" />
        <BaseAvatar v-bind="args" shape="square" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseAvatar },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px">
        <BaseAvatar v-bind="args" size="xs" />
        <BaseAvatar v-bind="args" size="sm" />
        <BaseAvatar v-bind="args" size="md" />
        <BaseAvatar v-bind="args" size="lg" />
        <BaseAvatar v-bind="args" size="xl" />
      </div>
    `,
  }),
}

export const InitialColors: Story = {
  render: (args) => ({
    components: { BaseAvatar },
    setup: () => {
      const names = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds']
      return { args, names }
    },
    template: `
      <div style="display:flex; align-items:center; gap:8px">
        <BaseAvatar v-for="n in names" :key="n" :name="n" />
      </div>
    `,
  }),
}

export const Group: Story = {
  render: (args) => ({
    components: { BaseAvatar },
    setup: () => {
      const names = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing']
      return { args, names }
    },
    template: `
      <div style="display:flex; align-items:center">
        <BaseAvatar v-for="(n, i) in names" :key="n" :name="n" ring
          :style="{ marginLeft: i === 0 ? '0' : '-10px', zIndex: names.length - i }" />
        <BaseAvatar ring :style="{ marginLeft: '-10px' }" aria-label="5 more"><span>+5</span></BaseAvatar>
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSkeleton from './BaseSkeleton.vue'

const meta = {
  title: 'Components/BaseSkeleton',
  component: BaseSkeleton,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    animation: { control: 'inline-radio', options: ['pulse', 'shimmer', 'none'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    shape: 'text',
    animation: 'pulse',
    lines: 3,
  },
  render: (args) => ({
    components: { BaseSkeleton },
    setup: () => ({ args }),
    template: '<div style="max-width:360px"><BaseSkeleton v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {}

export const Rect: Story = {
  args: { shape: 'rect', height: '8rem' },
}

export const Circle: Story = {
  args: { shape: 'circle', width: 64 },
}

export const Shimmer: Story = {
  args: { shape: 'text', animation: 'shimmer', lines: 3 },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSkeleton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:flex-end; gap:16px">
        <BaseSkeleton shape="circle" :width="40" />
        <BaseSkeleton shape="rect" width="120" height="80" />
        <BaseSkeleton shape="rect" width="120" height="120" />
      </div>
    `,
  }),
}

// Compose shapes to mirror a real loading card.
export const CardPlaceholder: Story = {
  render: (args) => ({
    components: { BaseSkeleton },
    setup: () => ({ args }),
    template: `
      <div style="max-width:320px; border:1px solid #e2e8f0; border-radius:8px; padding:16px">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px">
          <BaseSkeleton shape="circle" :width="48" />
          <div style="flex:1"><BaseSkeleton :lines="2" /></div>
        </div>
        <BaseSkeleton shape="rect" height="120" />
        <div style="margin-top:16px"><BaseSkeleton :lines="3" /></div>
      </div>
    `,
  }),
}

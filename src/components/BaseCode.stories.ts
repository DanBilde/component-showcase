import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCode from './BaseCode.vue'

const snippet = `npm install
npm run storybook`

const meta = {
  title: 'Components/BaseCode',
  component: BaseCode,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    language: { control: 'text' },
    block: { control: 'boolean' },
    copyable: { control: 'boolean' },
  },
  args: {
    code: snippet,
    block: true,
    language: 'bash',
    copyable: true,
  },
  render: (args) => ({
    components: { BaseCode },
    setup: () => ({ args }),
    template: '<div style="max-width:520px"><BaseCode v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseCode>

export default meta
type Story = StoryObj<typeof meta>

export const Block: Story = {}

export const Inline: Story = {
  render: () => ({
    components: { BaseCode },
    template: `
      <p style="color:#334155">
        Run <BaseCode code="npm run storybook" /> to start the showcase, then open
        <BaseCode code="localhost:6006" /> in your browser.
      </p>
    `,
  }),
}

export const PlainBlock: Story = {
  args: { language: undefined, copyable: false },
}

export const WithLanguageOnly: Story = {
  args: { copyable: false },
}

export const Copyable: Story = {
  args: { language: undefined, copyable: true },
}

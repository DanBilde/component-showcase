import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseDivider from './BaseDivider.vue'

const meta = {
  title: 'Components/BaseDivider',
  component: BaseDivider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
    labelPosition: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    variant: { control: 'inline-radio', options: ['solid', 'dashed'] },
    spacing: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: {
    orientation: 'horizontal',
    labelPosition: 'center',
    variant: 'solid',
    spacing: 'md',
  },
  render: (args) => ({
    components: { BaseDivider },
    setup: () => ({ args }),
    template: `
      <div style="max-width:380px; color:#334155">
        <p style="margin:0">Content above the divider.</p>
        <BaseDivider v-bind="args" />
        <p style="margin:0">Content below the divider.</p>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Plain: Story = {}

export const WithLabel: Story = {
  args: { label: 'OR' },
}

export const LabelLeft: Story = {
  args: { label: 'Section', labelPosition: 'left' },
}

export const Dashed: Story = {
  args: { variant: 'dashed' },
}

export const Vertical: Story = {
  render: (args) => ({
    components: { BaseDivider },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; color:#334155">
        <span>Docs</span>
        <BaseDivider v-bind="args" orientation="vertical" />
        <span>API</span>
        <BaseDivider v-bind="args" orientation="vertical" />
        <span>Support</span>
      </div>
    `,
  }),
}

export const Spacings: Story = {
  render: (args) => ({
    components: { BaseDivider },
    setup: () => ({ args }),
    template: `
      <div style="max-width:380px; color:#334155">
        <p style="margin:0">None</p>
        <BaseDivider spacing="none" />
        <p style="margin:0">Small</p>
        <BaseDivider spacing="sm" />
        <p style="margin:0">Large</p>
        <BaseDivider spacing="lg" />
        <p style="margin:0">End</p>
      </div>
    `,
  }),
}

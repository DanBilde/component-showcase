import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseBreadcrumbs from './BaseBreadcrumbs.vue'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Library', href: '#' },
  { label: 'Data', href: '#' },
  { label: 'Article title' },
]

const meta = {
  title: 'Components/BaseBreadcrumbs',
  component: BaseBreadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    items,
    separator: '/',
    size: 'md',
    ariaLabel: 'Breadcrumb',
  },
  render: (args) => ({
    components: { BaseBreadcrumbs },
    setup: () => ({ args }),
    template: '<BaseBreadcrumbs v-bind="args" />',
  }),
} satisfies Meta<typeof BaseBreadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ChevronSeparator: Story = { args: { separator: '›' } }

export const ChevronSlot: Story = {
  render: (args) => ({
    components: { BaseBreadcrumbs },
    setup: () => ({ args }),
    template: `
      <BaseBreadcrumbs v-bind="args">
        <template #separator>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="display:block">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </template>
      </BaseBreadcrumbs>
    `,
  }),
}

export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Home', href: '#' },
      { label: 'Catalog', href: '#' },
      { label: 'Electronics', href: '#' },
      { label: 'Computers', href: '#' },
      { label: 'Laptops', href: '#' },
      { label: 'ProBook 14', current: true },
    ],
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '#' },
      { label: 'Settings' },
    ],
  },
}

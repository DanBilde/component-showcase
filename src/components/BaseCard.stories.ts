import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import BaseBadge from './BaseBadge.vue'

const meta = {
  title: 'Components/BaseCard',
  component: BaseCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'elevated', 'filled'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    centered: { control: 'boolean' },
  },
  args: {
    variant: 'outlined',
    padding: 'md',
    title: 'Project Apollo',
    subtitle: 'Updated 2 hours ago',
    centered: false,
  },
  render: (args) => ({
    components: { BaseCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width:360px">
        <BaseCard v-bind="args">
          <p>A clean, self-contained container for grouping related content and actions.</p>
        </BaseCard>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Elevated: Story = { args: { variant: 'elevated' } }

export const Filled: Story = { args: { variant: 'filled' } }

// Centered top icon — the "feature card" layout.
export const FeatureWithIcon: Story = {
  args: { centered: true, title: 'Fast by default', subtitle: undefined },
  render: (args) => ({
    components: { BaseCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width:320px">
        <BaseCard v-bind="args">
          <template #icon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2L4.5 13.5H11l-1 8.5 9.5-13H13l0-7z" fill="currentColor" />
            </svg>
          </template>
          <p>Every component is presentational and dependency-free, so it renders instantly in isolation.</p>
        </BaseCard>
      </div>
    `,
  }),
}

export const WithFooter: Story = {
  render: (args) => ({
    components: { BaseCard, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="max-width:360px">
        <BaseCard v-bind="args" title="Delete workspace" :subtitle="undefined">
          <p>This permanently removes the workspace and all of its data. This action cannot be undone.</p>
          <template #footer>
            <div style="display:flex; justify-content:flex-end; gap:8px">
              <BaseButton variant="ghost" size="sm">Cancel</BaseButton>
              <BaseButton size="sm">Delete</BaseButton>
            </div>
          </template>
        </BaseCard>
      </div>
    `,
  }),
}

export const CustomHeader: Story = {
  render: (args) => ({
    components: { BaseCard, BaseBadge },
    setup: () => ({ args }),
    template: `
      <div style="max-width:360px">
        <BaseCard v-bind="args" :title="undefined" :subtitle="undefined">
          <template #header>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px">
              <h3 style="margin:0; font-weight:600; color:#0f172a">API keys</h3>
              <BaseBadge variant="success" dot>Active</BaseBadge>
            </div>
          </template>
          <p>Manage the keys used to authenticate requests to your workspace.</p>
        </BaseCard>
      </div>
    `,
  }),
}

export const FeatureGrid: Story = {
  render: (args) => ({
    components: { BaseCard },
    setup: () => {
      const features = [
        { title: 'Typed', body: 'Every prop and emit is fully typed with TypeScript.' },
        { title: 'Accessible', body: 'Keyboard and screen-reader support built in.' },
        { title: 'Themeable', body: 'Brand-neutral tokens you can restyle in one place.' },
      ]
      return { args, features }
    },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px">
        <BaseCard v-for="f in features" :key="f.title" variant="elevated" centered :title="f.title">
          <template #icon>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
          <p>{{ f.body }}</p>
        </BaseCard>
      </div>
    `,
  }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DashboardExample from './DashboardExample.vue'

/**
 * A full screen assembled from the library — no new components, no CSS beyond
 * Tailwind utilities and the semantic tokens.
 *
 * The domain is invented and every number is dummy data; the point is to show
 * how the pieces compose and that the whole screen themes for free.
 */
const meta: Meta<typeof DashboardExample> = {
  title: 'Examples/Dashboard',
  component: DashboardExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Try the range filter (it re-reads the KPI row), click a tool card (it pushes
 * a toast), and flip the Theme toolbar — the whole page follows.
 */
export const Dashboard: Story = {}

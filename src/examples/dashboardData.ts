/**
 * Dummy data for the Dashboard example.
 *
 * Entirely invented: a generic internal "Ops Console" for a fictional SaaS.
 * Nothing here is drawn from a real product — the example exists to show the
 * Base* components composing into a realistic screen.
 */

export type Range = '24h' | '7d' | '30d'

export interface Kpi {
  label: string
  value: string
  delta: number
  deltaLabel: string
  /** Metrics where a rise is bad (churn, error rate) flip the delta color. */
  positiveIsGood?: boolean
}

export const RANGES: { label: string; value: Range }[] = [
  { label: '24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
]

export const KPIS: Record<Range, Kpi[]> = {
  '24h': [
    { label: 'Active users', value: '1,284', delta: 3.2, deltaLabel: 'vs yesterday' },
    { label: 'Sessions', value: '4,910', delta: 5.8, deltaLabel: 'vs yesterday' },
    { label: 'Error rate', value: '0.42%', delta: -0.1, deltaLabel: 'vs yesterday', positiveIsGood: false },
    { label: 'Avg. response', value: '218ms', delta: -12, deltaLabel: 'vs yesterday', positiveIsGood: false },
  ],
  '7d': [
    { label: 'Active users', value: '8,431', delta: 12.4, deltaLabel: 'vs last week' },
    { label: 'Sessions', value: '31,782', delta: 8.1, deltaLabel: 'vs last week' },
    { label: 'Error rate', value: '0.38%', delta: -0.6, deltaLabel: 'vs last week', positiveIsGood: false },
    { label: 'Avg. response', value: '204ms', delta: -23, deltaLabel: 'vs last week', positiveIsGood: false },
  ],
  '30d': [
    { label: 'Active users', value: '34,905', delta: 18.9, deltaLabel: 'vs last month' },
    { label: 'Sessions', value: '128,440', delta: 15.3, deltaLabel: 'vs last month' },
    { label: 'Error rate', value: '0.51%', delta: 1.4, deltaLabel: 'vs last month', positiveIsGood: false },
    { label: 'Avg. response', value: '231ms', delta: 9, deltaLabel: 'vs last month', positiveIsGood: false },
  ],
}

export interface Tool {
  title: string
  description: string
  icon: string
  badge?: string
}

export const TOOLS: Tool[] = [
  { title: 'Content Studio', description: 'Draft, review and publish articles across every site.', icon: 'doc' },
  { title: 'Media Library', description: 'Upload and organise images, video and documents.', icon: 'image' },
  { title: 'Analytics', description: 'Traffic, conversion and revenue reporting.', icon: 'chart' },
  { title: 'Customers', description: 'Accounts, subscriptions and support history.', icon: 'users' },
  { title: 'Billing', description: 'Invoices, plans and payment methods.', icon: 'card' },
  { title: 'Automations', description: 'Scheduled jobs and workflow rules.', icon: 'bolt', badge: 'New' },
  { title: 'Access Control', description: 'Teams, roles and granular permissions.', icon: 'shield' },
  { title: 'Feature Flags', description: 'Roll features out gradually and safely.', icon: 'flag' },
]

export const EXTERNAL_TOOLS = ['Status page', 'API docs', 'Design system', 'Support inbox']

export const ACTIVITY = [
  { time: '09:42', title: 'Deployment succeeded', description: 'web-app v4.18.0 rolled out to production.', variant: 'success' as const },
  { time: '09:15', title: 'Feature flag enabled', description: '"checkout-v2" turned on for 25% of traffic.', variant: 'brand' as const },
  { time: '08:50', title: 'Elevated error rate', description: 'Search service briefly exceeded its threshold.', variant: 'warning' as const },
  { time: '08:02', title: 'Nightly import finished', description: '12,480 records processed, 3 skipped.', variant: 'neutral' as const },
]

export const SERVICES = [
  { name: 'API gateway', status: 'Operational', variant: 'success' as const, uptime: 99.98 },
  { name: 'Web app', status: 'Operational', variant: 'success' as const, uptime: 99.95 },
  { name: 'Search', status: 'Degraded', variant: 'warning' as const, uptime: 97.4 },
  { name: 'Background jobs', status: 'Operational', variant: 'success' as const, uptime: 99.89 },
]

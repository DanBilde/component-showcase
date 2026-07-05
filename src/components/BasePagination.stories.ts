import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import BasePagination from './BasePagination.vue'

const meta = {
  title: 'Components/BasePagination',
  component: BasePagination,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: { type: 'number', min: 1 } },
    total: { control: 'number' },
    pageSize: { control: 'number' },
    pageCount: { control: 'number' },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showEdges: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    modelValue: 1,
    total: 200,
    pageSize: 10,
    siblingCount: 1,
    size: 'md',
    showEdges: false,
    disabled: false,
  },
  render: (args) => ({
    components: { BasePagination },
    setup: () => {
      const page = ref(args.modelValue ?? 1)
      // Keep in sync when the modelValue control changes.
      watch(() => args.modelValue, (v) => (page.value = v ?? 1))
      return { args, page }
    },
    template: '<BasePagination v-bind="args" v-model="page" />',
  }),
} satisfies Meta<typeof BasePagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MiddleOfRange: Story = {
  args: { modelValue: 10 },
}

export const FewPages: Story = {
  args: { total: 30 },
}

export const WithEdges: Story = {
  args: { modelValue: 10, showEdges: true },
}

export const MoreSiblings: Story = {
  args: { modelValue: 10, siblingCount: 2 },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BasePagination },
    setup: () => {
      const sm = ref(3)
      const md = ref(3)
      const lg = ref(3)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px">
        <BasePagination v-bind="args" v-model="sm" size="sm" />
        <BasePagination v-bind="args" v-model="md" size="md" />
        <BasePagination v-bind="args" v-model="lg" size="lg" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { modelValue: 3, disabled: true },
}

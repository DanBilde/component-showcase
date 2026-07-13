import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseStepper from './BaseStepper.vue'
import BaseButton from './BaseButton.vue'

const steps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Address & method' },
  { label: 'Payment', description: 'Card details' },
  { label: 'Confirm', description: 'Place order' },
]

const meta = {
  title: 'Components/BaseStepper',
  component: BaseStepper,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: { type: 'number', min: 0 } },
    clickable: { control: 'boolean' },
  },
  args: {
    steps,
    modelValue: 1,
    clickable: false,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup: () => ({ args }),
    template: '<div style="max-width:640px"><BaseStepper v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BaseStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstStep: Story = { args: { modelValue: 0 } }

export const Completed: Story = { args: { modelValue: 4 } }

export const LabelsOnly: Story = {
  args: {
    steps: [{ label: 'Account' }, { label: 'Profile' }, { label: 'Done' }],
    modelValue: 1,
  },
}

// Interactive wizard: Back / Next move through the steps.
export const InteractiveWizard: Story = {
  render: (args) => ({
    components: { BaseStepper, BaseButton },
    setup: () => {
      const step = ref(0)
      const next = () => (step.value = Math.min(step.value + 1, steps.length - 1))
      const back = () => (step.value = Math.max(step.value - 1, 0))
      return { args, step, next, back }
    },
    template: `
      <div style="max-width:640px">
        <BaseStepper :steps="args.steps" v-model="step" clickable />
        <div style="display:flex; justify-content:space-between; margin-top:24px">
          <BaseButton variant="secondary" size="sm" :disabled="step === 0" @click="back">Back</BaseButton>
          <BaseButton size="sm" :disabled="step === 3" @click="next">Next</BaseButton>
        </div>
      </div>
    `,
  }),
}

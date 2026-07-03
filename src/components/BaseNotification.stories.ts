import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import BaseNotification from "./BaseNotification.vue";
import BaseButton from "./BaseButton.vue";

const meta = {
  title: "Components/BaseNotification",
  component: BaseNotification,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    title: { control: "text" },
    dismissible: { control: "boolean" },
    icon: { control: "boolean" },
    duration: { control: "number" },
  },
  args: {
    variant: "info",
    title: "Heads up",
    dismissible: false,
    icon: true,
    // Docs examples persist so they stay readable; see the AutoDismiss story
    // for the auto-dismiss behaviour (component default is 3000ms).
    duration: 0,
  },
  render: (args) => ({
    components: { BaseNotification },
    setup: () => ({ args }),
    template: `
      <div style="max-width:480px">
        <BaseNotification v-bind="args">Your changes have been saved to the cloud.</BaseNotification>
      </div>
    `,
  }),
} satisfies Meta<typeof BaseNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: { variant: "success", title: "Payment received" },
  render: (args) => ({
    components: { BaseNotification },
    setup: () => ({ args }),
    template: `<div style="max-width:480px"><BaseNotification v-bind="args">Your subscription is now active.</BaseNotification></div>`,
  }),
};

export const Warning: Story = {
  args: { variant: "warning", title: "Storage almost full" },
  render: (args) => ({
    components: { BaseNotification },
    setup: () => ({ args }),
    template: `<div style="max-width:480px"><BaseNotification v-bind="args">You've used 90% of your available storage.</BaseNotification></div>`,
  }),
};

export const Error: Story = {
  args: { variant: "error", title: "Upload failed" },
  render: (args) => ({
    components: { BaseNotification },
    setup: () => ({ args }),
    template: `<div style="max-width:480px"><BaseNotification v-bind="args">The file exceeds the 25MB limit. Try a smaller file.</BaseNotification></div>`,
  }),
};

export const MessageOnly: Story = {
  args: { title: undefined, variant: "info" },
};

export const Dismissible: Story = {
  args: { dismissible: true, variant: "success", title: "Copied to clipboard" },
  render: (args) => ({
    components: { BaseNotification, BaseButton },
    setup: () => {
      const show = ref(true);
      return { args, show };
    },
    template: `
      <div style="max-width:480px">
        <BaseNotification v-if="show" v-bind="args" @dismiss="show = false">
          The invite link has been copied.
        </BaseNotification>
        <BaseButton v-else size="sm" variant="secondary" @click="show = true">Show again</BaseButton>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  args: { variant: "warning", title: "Unsaved changes" },
  render: (args) => ({
    components: { BaseNotification, BaseButton },
    setup: () => ({ args }),
    template: `
      <div style="max-width:480px">
        <BaseNotification v-bind="args">
          You have unsaved changes that will be lost if you leave this page.
          <template #actions>
            <BaseButton size="sm">Save</BaseButton>
            <BaseButton size="sm" variant="ghost">Discard</BaseButton>
          </template>
        </BaseNotification>
      </div>
    `,
  }),
};

// Non-dismissible notifications auto-dismiss after `duration` ms (component default 3000).
// Uses 4000 here so the 2000ms fade-in has room to settle before it dismisses.
export const AutoDismiss: Story = {
  args: {
    variant: "success",
    title: "Saved",
    dismissible: false,
    duration: 4000,
  },
  render: (args) => ({
    components: { BaseNotification, BaseButton },
    setup: () => {
      const show = ref(true);
      return { args, show };
    },
    template: `
      <div style="max-width:480px">
        <BaseNotification v-if="show" v-bind="args" @dismiss="show = false">
          This message disappears on its own after {{ args.duration }}ms.
        </BaseNotification>
        <BaseButton v-else size="sm" variant="secondary" @click="show = true">Show again</BaseButton>
      </div>
    `,
  }),
};

export const AllTypes: Story = {
  render: (args) => ({
    components: { BaseNotification },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:480px">
        <BaseNotification variant="info" title="Note" :duration="0">A new version of the docs is available.</BaseNotification>
        <BaseNotification variant="success" title="Success" :duration="0">Your profile was updated.</BaseNotification>
        <BaseNotification variant="warning" title="Warning" :duration="0">Your trial ends in 3 days.</BaseNotification>
        <BaseNotification variant="error" title="Error" :duration="0">We couldn't process your request.</BaseNotification>
      </div>
    `,
  }),
};

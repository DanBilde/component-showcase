<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BaseSwitch from '../components/BaseSwitch.vue'
import BaseCheckbox from '../components/BaseCheckbox.vue'
import BaseSlider from '../components/BaseSlider.vue'
import BaseRating from '../components/BaseRating.vue'
import BaseBadge from '../components/BaseBadge.vue'
import BaseTag from '../components/BaseTag.vue'
import BaseAvatar from '../components/BaseAvatar.vue'
import BaseProgress from '../components/BaseProgress.vue'
import BaseSpinner from '../components/BaseSpinner.vue'
import BaseTabs from '../components/BaseTabs.vue'
import BaseTooltip from '../components/BaseTooltip.vue'
import BaseMenu from '../components/BaseMenu.vue'
import BaseKbd from '../components/BaseKbd.vue'
import BaseModal from '../components/BaseModal.vue'
import BaseToast, { type Toast } from '../components/BaseToast.vue'
import BaseCommandPalette from '../components/BaseCommandPalette.vue'

const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006/' : '/storybook/'

// Form demo state
const name = ref('')
const framework = ref<string | number | null>('vue')
const notifications = ref(true)
const terms = ref(false)
const volume = ref(60)
const rating = ref(4)

const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
]

// Tabs demo
const tab = ref('overview')
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]

// Menu demo
const menuItems = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { divider: true },
  { label: 'Delete', value: 'delete', danger: true },
]

// Feedback demos
const progress = ref(20)
let progressTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  progressTimer = setInterval(() => {
    progress.value = progress.value >= 100 ? 0 : progress.value + 5
  }, 600)
})
onBeforeUnmount(() => clearInterval(progressTimer))

// Overlays
const modalOpen = ref(false)
const paletteOpen = ref(false)

const toasts = ref<Toast[]>([])
let toastSeq = 0
function showToast() {
  toasts.value.push({
    id: ++toastSeq,
    variant: 'success',
    title: 'Saved',
    message: 'Your changes have been saved.',
  })
}
function dismissToast(id: Toast['id']) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

const commands = [
  { value: 'docs', label: 'Open Storybook docs', group: 'Navigation', shortcut: '⌘D' },
  { value: 'github', label: 'View source on GitHub', group: 'Navigation' },
  { value: 'toast', label: 'Trigger a toast', group: 'Actions' },
  { value: 'modal', label: 'Open a modal', group: 'Actions' },
]
function runCommand(item: { value: string | number }) {
  if (item.value === 'toast') showToast()
  else if (item.value === 'modal') modalOpen.value = true
  else if (item.value === 'github') window.open('https://github.com/DanBilde/component-showcase', '_blank')
  else if (item.value === 'docs') window.location.href = storybookUrl
}
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Buttons -->
    <BaseCard title="Buttons" subtitle="Variants & sizes">
      <div class="mt-2 flex flex-wrap gap-2">
        <BaseButton size="sm">Primary</BaseButton>
        <BaseButton size="sm" variant="secondary">Secondary</BaseButton>
        <BaseButton size="sm" variant="ghost">Ghost</BaseButton>
      </div>
    </BaseCard>

    <!-- Form controls -->
    <BaseCard title="Form controls" subtitle="Typed, accessible inputs">
      <div class="mt-2 flex flex-col gap-3">
        <BaseInput v-model="name" label="Name" placeholder="Ada Lovelace" size="sm" />
        <BaseSelect v-model="framework" :options="frameworks" label="Framework" size="sm" />
      </div>
    </BaseCard>

    <!-- Toggles -->
    <BaseCard title="Toggles & values" subtitle="Switch · checkbox · slider · rating">
      <div class="mt-2 flex flex-col gap-3">
        <BaseSwitch v-model="notifications" label="Notifications" size="sm" />
        <BaseCheckbox v-model="terms" label="Accept terms" size="sm" />
        <BaseSlider v-model="volume" label="Volume" show-value size="sm" />
        <BaseRating v-model="rating" />
      </div>
    </BaseCard>

    <!-- Data display -->
    <BaseCard title="Data display" subtitle="Badges · tags · avatars">
      <div class="mt-2 flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <BaseBadge variant="success" dot>Active</BaseBadge>
          <BaseBadge variant="brand" appearance="solid">New</BaseBadge>
          <BaseBadge variant="neutral">v1.0</BaseBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseTag variant="brand">design-system</BaseTag>
          <BaseTag variant="success" pill>vue</BaseTag>
        </div>
        <div class="flex items-center">
          <BaseAvatar name="Ada Lovelace" size="sm" ring />
          <BaseAvatar name="Grace Hopper" size="sm" ring style="margin-left:-8px" />
          <BaseAvatar name="Alan Turing" size="sm" ring style="margin-left:-8px" />
        </div>
      </div>
    </BaseCard>

    <!-- Feedback -->
    <BaseCard title="Feedback" subtitle="Progress · spinner · toast">
      <div class="mt-2 flex flex-col gap-3">
        <BaseProgress :value="progress" show-value label="Uploading" size="sm" />
        <div class="flex items-center gap-3">
          <BaseSpinner size="sm" />
          <BaseButton size="sm" variant="secondary" @click="showToast">Show toast</BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Tabs -->
    <BaseCard title="Tabs" subtitle="Keyboard-navigable">
      <div class="mt-2">
        <BaseTabs v-model="tab" :tabs="tabs" size="sm">
          <template #overview><p class="text-sm">Overview panel content.</p></template>
          <template #activity><p class="text-sm">Recent activity shows here.</p></template>
          <template #settings><p class="text-sm">Settings and preferences.</p></template>
        </BaseTabs>
      </div>
    </BaseCard>

    <!-- Overlays -->
    <BaseCard title="Overlays" subtitle="Modal · menu · tooltip">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <BaseButton size="sm" @click="modalOpen = true">Open modal</BaseButton>
        <BaseMenu :items="menuItems">
          <template #trigger><BaseButton size="sm" variant="secondary">Menu ▾</BaseButton></template>
        </BaseMenu>
        <BaseTooltip content="A helpful hint">
          <BaseButton size="sm" variant="ghost">Hover me</BaseButton>
        </BaseTooltip>
      </div>
    </BaseCard>

    <!-- Command palette -->
    <BaseCard title="Command palette" subtitle="⌘K-style search">
      <div class="mt-2">
        <BaseButton size="sm" variant="secondary" @click="paletteOpen = true">
          Open&nbsp; <BaseKbd :keys="['⌘', 'K']" size="sm" />
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Composition -->
    <BaseCard variant="elevated" centered title="…and 35 more">
      <template #icon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </template>
      <p class="text-sm">Explore every component, prop, and state in the full Storybook.</p>
      <template #footer>
        <BaseButton size="sm" :href="storybookUrl">Open Storybook →</BaseButton>
      </template>
    </BaseCard>
  </div>

  <!-- Global overlays (teleport to body) -->
  <BaseModal v-model="modalOpen" title="Delete project" size="sm">
    <p>This action cannot be undone. This will permanently delete the project and its data.</p>
    <template #footer>
      <BaseButton variant="ghost" @click="modalOpen = false">Cancel</BaseButton>
      <BaseButton @click="modalOpen = false">Delete</BaseButton>
    </template>
  </BaseModal>

  <BaseCommandPalette v-model="paletteOpen" :items="commands" @select="runCommand" />

  <BaseToast :toasts="toasts" @dismiss="dismissToast" />
</template>

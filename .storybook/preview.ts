import type { Preview } from '@storybook/vue3-vite'
import { addons } from 'storybook/preview-api'
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events'
import '../src/style.css'
import './preview.css'

/*
 * Theme sync with the Vue landing page. Both are served from the same origin
 * in production (`/` and `/storybook/`), so they share the `theme` localStorage
 * key that the landing page's useTheme composable reads/writes. Storybook seeds
 * its Theme toolbar from that key on load, and writes back when toggled — so the
 * choice carries in BOTH directions between the landing page and Storybook.
 */
const STORAGE_KEY = 'theme'

function storedTheme(): 'light' | 'dark' | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

function preferredTheme(): 'light' | 'dark' {
  return storedTheme() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function setDarkClass(theme?: string) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Apply immediately so the preview iframe's first paint matches the saved choice
// (before Storybook broadcasts its globals) — no flash of the wrong theme.
setDarkClass(preferredTheme())

const channel = addons.getChannel()

// On the first globals broadcast, force the toolbar to match the saved choice.
channel.once(SET_GLOBALS, ({ globals }: { globals?: { theme?: string } }) => {
  const pref = preferredTheme()
  setDarkClass(pref)
  if (globals?.theme !== pref) {
    channel.emit(UPDATE_GLOBALS, { globals: { theme: pref } })
  }
})

// When the user flips the Theme toolbar, update the class AND persist to the
// shared key so returning to the landing page keeps the same theme.
channel.on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => {
  setDarkClass(globals?.theme)
  try {
    if (globals?.theme) localStorage.setItem(STORAGE_KEY, globals.theme)
  } catch {
    /* ignore storage failures */
  }
})

const preview: Preview = {
  parameters: {
    options: {
      // Keep the Introduction page pinned to the top of the sidebar.
      storySort: {
        order: ['Introduction', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  // Toolbar switch to preview every component in light or dark.
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: preferredTheme(),
  },
  decorators: [
    // Small padding around every preview, painted with the themed canvas
    // background + text color. The `.dark` class is toggled on <html> by the
    // channel listener above, so `var(--color-*)` here already resolves per theme.
    () => ({
      template:
        '<div style="padding: 1.5rem; background-color: var(--color-canvas); color: var(--color-fg)"><story/></div>',
    }),
  ],
}

export default preview

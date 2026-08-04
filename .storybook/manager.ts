import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'

/*
 * Theme the Storybook MANAGER chrome (sidebar / toolbar / search) — a separate
 * top-frame app from the preview iframe, with its own theming API. Colors mirror
 * the app's semantic tokens (src/style.css) so the whole UI reads as one system.
 *
 * Like the preview (.storybook/preview.ts), this seeds from the shared
 * `localStorage['theme']` key on load (same origin as the landing page in prod)
 * and re-themes reactively when the Theme toolbar global changes.
 */
const lightTheme = create({
  base: 'light',
  brandTitle: 'Component Showcase',
  colorPrimary: '#2b6298',
  colorSecondary: '#2b6298',
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',
  barTextColor: '#475569',
  barSelectedColor: '#2b6298',
  barHoverColor: '#2b6298',
  barBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputTextColor: '#0f172a',
  inputBorderRadius: 8,
})

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Component Showcase',
  colorPrimary: '#4b93d1',
  colorSecondary: '#4b93d1',
  appBg: '#0b1120',
  appContentBg: '#17233b',
  appPreviewBg: '#0b1120',
  appBorderColor: '#2a3852',
  appBorderRadius: 8,
  textColor: '#eef2f7',
  textInverseColor: '#0b1120',
  textMutedColor: '#8595a9',
  barTextColor: '#b7c2d0',
  barSelectedColor: '#63a5db',
  barHoverColor: '#63a5db',
  barBg: '#111a2e',
  inputBg: '#17233b',
  inputBorder: '#2a3852',
  inputTextColor: '#eef2f7',
  inputBorderRadius: 8,
})

function preferredTheme(): 'light' | 'dark' {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* ignore */
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/*
 * `addons.setConfig({ theme })` is read once at manager mount and will NOT
 * hot-swap at runtime. The dynamic counterpart is `api.setOptions({ theme })`
 * (the pattern used by dark-mode addons), which we get via `addons.register`.
 */
addons.register('showcase/theme-sync', (api) => {
  const apply = (theme?: string) =>
    api.setOptions({ theme: theme === 'dark' ? darkTheme : lightTheme })

  // Initial: match the saved landing-page choice.
  apply(preferredTheme())

  // Follow the Theme toolbar live. (preview.ts owns writing localStorage.)
  const channel = addons.getChannel()
  channel.on(SET_GLOBALS, ({ globals }: { globals?: { theme?: string } }) => apply(globals?.theme))
  channel.on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => apply(globals?.theme))
})

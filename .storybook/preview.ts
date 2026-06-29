import type { Preview } from '@storybook/vue3-vite'
import '../src/style.css'

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
  decorators: [
    // small padding around every preview so components don't hug the edge
    () => ({ template: '<div style="padding: 1.5rem"><story/></div>' }),
  ],
}

export default preview

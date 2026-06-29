# Component Showcase

A personal, framework-agnostic component library and Storybook showcase built with
**Vue 3, TypeScript, Tailwind CSS v4, and Storybook 10**. Each component is written
from scratch as a clean, generic, reusable building block and documented with live,
interactive previews.

## Tech stack

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Storybook 10** (`@storybook/vue3-vite`) with autodocs and a11y checks
- **Vite** for dev/build

## Getting started

```bash
npm install

# Run the component showcase (Storybook)
npm run storybook        # → http://localhost:6006

# Build a static Storybook site
npm run build-storybook  # → ./storybook-static
```

The Vite app itself (`npm run dev`) is incidental; the showcase lives in Storybook.

## Project structure

```
src/
  components/            # Components + co-located stories
    AppButton.vue
    AppButton.stories.ts
  style.css              # Tailwind import + generic design tokens
.storybook/
  main.ts                # Story discovery + addons
  preview.ts             # Global styles, decorators, controls
```

## Components

| Component   | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `AppButton` | Button with variants (primary/secondary/ghost), sizes, disabled state, link mode, and icon slots. |

## Conventions

- Components are presentational and self-contained: props in, UI out, no app/data dependencies.
- Styling uses Tailwind utility classes plus a few brand-neutral CSS variables in `style.css`
  (`--color-brand`, `--radius`).
- Every component ships with a co-located `*.stories.ts` file using `args` / `argTypes`
  and `tags: ['autodocs']`.

## License

Personal project. All components are written from scratch.

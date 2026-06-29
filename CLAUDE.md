# Component Showcase — Project Memory

## What this is

A personal, portfolio-safe Vue 3 component library, documented in Storybook. Every
component is written from scratch as a clean, generic, reusable building block. Nothing
here is copied from any employer codebase.

## Stack

- Vue 3 (`<script setup lang="ts">`, Composition API)
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite` (config-less; tokens live in `src/style.css`)
- Storybook 10 (`@storybook/vue3-vite`), addons: docs, a11y, vitest, chromatic
- Vite

## Commands

- `npm run storybook` — run the showcase at http://localhost:6006 (primary workflow)
- `npm run build-storybook` — build static Storybook into `./storybook-static`
- `npm run dev` — plain Vite app (incidental; the showcase is Storybook)
- `npm run build` — `vue-tsc -b && vite build` (also serves as the type-check)

## Structure

```
src/
  components/            # Components + co-located *.stories.ts
  style.css              # `@import 'tailwindcss'` + generic design tokens
.storybook/
  main.ts                # story globs + addons + framework
  preview.ts             # imports src/style.css, padding decorator, controls
```

## Conventions

### Components
- Presentational and self-contained: **props in, UI out**. No router, store, API, or
  app-specific data dependencies. (That's what makes them previewable in isolation.)
- `<script setup lang="ts">` with typed `defineProps` / `defineEmits` and
  `withDefaults` for defaults.
- Styling via Tailwind utility classes. Brand-neutral tokens only, defined in
  `src/style.css`: `--color-brand`, `--color-brand-hover`, `--radius`. **Do not**
  introduce company-specific theme tokens, assets, or naming.
- Prefer a `variant` + `size` prop pattern with `Record<Variant, string>` class maps
  (see `AppButton.vue`).

### Stories
- Co-locate `ComponentName.stories.ts` next to the component.
- Use `Meta` + `StoryObj`, `tags: ['autodocs']`, and `args` / `argTypes` for controls.
- One named export per meaningful variant; add a `render` with a `template` for
  multi-instance showcases (e.g. `Sizes`, `AllVariants`).

### Tailwind in Storybook
- `src/style.css` is imported in `.storybook/preview.ts`, so Tailwind classes render in
  previews. If styles look missing, that import is the first thing to check.

### Commits
- Conventional commits, lowercase description, no AI attribution.

## Progress log

### Slice 1 — Scaffold + first component (done)
- Scaffolded Vite (vue-ts), added Tailwind v4 (`@tailwindcss/vite` + `style.css`),
  initialized Storybook 10, removed the boilerplate example stories.
- Wired Tailwind into `.storybook/preview.ts` and added a padding decorator.
- Built **`AppButton`**: variants (primary / secondary / ghost), sizes (sm / md / lg),
  `disabled`, link mode via `href` (renders `<a>`), and `iconLeft` / `iconRight` slots.
  Story covers Primary, Secondary, Ghost, Disabled, AsLink, Sizes, AllVariants.
- Verified the full pipeline with `npm run build-storybook` (success).

### Next up
- Add more presentational components one at a time (e.g. Tag/Badge, Modal, Dropdown),
  each as a fresh clean-room build following the `AppButton` pattern.

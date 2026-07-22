# Component Showcase

A personal, portfolio-safe component library and Storybook showcase built with
**Vue 3, TypeScript, Tailwind CSS v4, and Storybook 10**. Every component is written from
scratch as a clean, generic, reusable building block — presentational, dependency-free, and
documented with live, interactive previews.

**▶ Live showcase: https://component-showcase-alpha.vercel.app/**

## Tech stack

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, config-less; tokens in `src/style.css`)
- **Storybook 10** (`@storybook/vue3-vite`) with autodocs and a11y checks
- **Vite** for dev/build
- Deployed on **Vercel** (auto-deploy on push to `main`)

## Getting started

```bash
npm install

# Run the Vue landing page (portfolio home)
npm run dev              # → http://localhost:5173

# Run the component docs (Storybook)
npm run storybook        # → http://localhost:6006

# Combined production build: landing page → dist/, Storybook → dist/storybook/
npm run build:site
```

The deployed site serves the **landing page at `/`** and the full **Storybook at
`/storybook/`**.

## Project structure

```
src/
  App.vue                # Vue landing page (dogfoods the components)
  landing/               # landing-page sections
  components/            # Components + co-located *.stories.ts (Base* prefix)
  Introduction.mdx       # Storybook landing page
  style.css              # Tailwind import + generic design tokens
.storybook/
  main.ts                # Story discovery + addons + staticDirs
  preview.ts             # Global styles, decorators, controls, story order
```

## Components

43 components, each with a co-located `*.stories.ts` and autodocs.

### Buttons & actions
- **BaseButton** — variants (primary / secondary / ghost), sizes, disabled, link mode, icon slots.

### Form controls
- **BaseInput** — text field with sizes, hint/error states, and prefix/suffix slots.
- **BaseTextarea** — multi-line field with auto-grow and an optional character counter.
- **BaseSelect** — custom listbox dropdown with full keyboard navigation and type-ahead.
- **BaseMultiSelect** — multi-select listbox with checkboxes and removable chips.
- **BaseRadioGroup** — native radio group with custom styling and orientation.
- **BaseCheckbox** — checkbox with an indeterminate (tri-state) mode.
- **BaseSwitch** — accessible on/off toggle.
- **BaseSlider** — range input with a filled track and value label.
- **BaseRating** — star rating (read-only or interactive) with half-steps and keyboard support.
- **BaseSegmentedControl** — iOS-style single-select toggle group with keyboard navigation.
- **BaseChipInput** — tag/token input; add with Enter/comma, remove with × or Backspace.
- **BaseCalendar** — month-grid date picker with min/max, week-start, and keyboard navigation.
- **BaseDatepicker** — date field that opens a calendar popover (composes Popover + Calendar).

### Data display
- **BaseTag** — label chip with variants, pill shape, and a removable button.
- **BaseBadge** — compact status/count indicator with an optional status dot.
- **BaseAvatar** — image avatar with initials/icon fallback and a presence dot.
- **BaseCard** — slotted container (header/body/footer) with a centered-icon feature layout.
- **BaseStat** — KPI/metric block with a colored trend delta.
- **BaseList** — list container (plain/divided/bordered) with interactive rows and slots.
- **BaseDescriptionList** — semantic key/value pairs (inline or stacked).
- **BaseTreeView** — nested expandable tree with full keyboard navigation.
- **BaseKbd** — inline keyboard-key styling for shortcuts.
- **BaseCode** — inline or block code styling with a language label and copy button.
- **BaseTimeline** — vertical event timeline with a connecting line and colored markers.

### Feedback & status
- **BaseSpinner** — loading spinner with sizes and colors.
- **BaseProgress** — determinate/indeterminate progress bar.
- **BaseSkeleton** — loading placeholder (text/rect/circle) with pulse or shimmer.
- **BaseNotification** — info/success/warning/error alert with auto-dismiss.
- **BaseAlertBanner** — full-width page banner (subtle/solid) with actions and dismiss.
- **BaseToast** — teleported toast stack (6 positions) with animated enter/leave.
- **BaseEmptyState** — centered icon + heading + description + actions for empty screens.

### Navigation & disclosure
- **BaseTabs** — accessible tabs (underline / pills) with arrow-key navigation.
- **BaseBreadcrumbs** — breadcrumb trail with a custom separator and middle-collapse.
- **BasePagination** — page navigation with prev/next and ellipsis for long ranges.
- **BaseStepper** — horizontal step indicator for wizards, with optional clickable steps.
- **BaseAccordion** — collapsible panels (single or multiple open) with animated height.

### Overlays
- **BaseModal** — teleported dialog with backdrop, Escape, and scroll-lock handling.
- **BaseCommandPalette** — ⌘K searchable command list with grouping and keyboard navigation.
- **BaseTooltip** — hover/focus tooltip with four placements and an open delay.
- **BasePopover** — click-triggered floating panel with placement and click-outside.
- **BaseMenu** — dropdown action menu with keyboard navigation, dividers, and danger items.

### Layout
- **BaseDivider** — horizontal/vertical separator with an optional label.

## Conventions

- **Presentational & self-contained:** props in, UI out — no router, store, API, or
  app-specific data dependencies.
- **`Base*` naming**, `<script setup lang="ts">` with typed props/emits.
- **Styling via Tailwind utilities** plus a few brand-neutral CSS tokens in `src/style.css`
  (`--color-brand`, `--radius`). A small scoped `<style>` is used only where keyframe or
  pseudo-element styling is unavoidable (e.g. progress, skeleton, slider, toast).
- **Accessibility** is built in: semantic elements, ARIA roles/attributes, and keyboard
  support throughout.
- Every component ships a co-located `*.stories.ts` using `args` / `argTypes` and
  `tags: ['autodocs']`.

## License

Personal project. All components are written from scratch and are free of any
employer/company assets.

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

### Naming
- Components use the `Base*` prefix (e.g. `BaseButton`, `BaseTag`). New components follow
  the same convention.

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
- Built the first button component (later renamed to `BaseButton`): variants
  (primary / secondary / ghost), sizes (sm / md / lg), `disabled`, link mode via `href`
  (renders `<a>`), and `iconLeft` / `iconRight` slots.
- Verified the full pipeline with `npm run build-storybook` (success).

### Slice 2 — Base naming + BaseTag (done)
- Adopted the `Base*` naming convention; renamed `AppButton` → **`BaseButton`**.
- Built **`BaseTag`**: variants (neutral / brand / success / warning / danger),
  sizes (sm / md), `pill` shape, and a `removable` close button that emits `remove`.
  Slots: default label + `icon`. Story covers Default, Brand, Pill, Removable, Sizes,
  AllVariants.

### Slice 3 — Deploy + intro page (done)
- Wired up the GitHub remote (SSH, `DanBilde/component-showcase`) and deployed the static
  Storybook to **Vercel** via Git integration (auto-deploy on push to `main`). Config in
  `vercel.json`. Live at https://component-showcase-alpha.vercel.app/.
- Added `src/Introduction.mdx` — a docs-only landing page (hero, principles grid, linked
  component index, stack) pinned to the top of the sidebar via `storySort` in
  `.storybook/preview.ts`. Keep its component list in sync as new components ship.
- Briefly trialed a green `--color-brand`, then reverted to the original blue (`#2b6298`,
  hover `#245480`); `BaseButton` primary and the intro hero use white text on the brand.

### Slice 4 — BaseInput (done)
- Built **`BaseInput`**: `v-model` text field with sizes (sm / md / lg), `type`
  (text / email / password / number / search / tel / url), optional `label`, `placeholder`,
  `hint`, and `error` state, plus `disabled` / `required`. Slots: `prefix` / `suffix`.
  A11y: auto-generated `id` (via `useId`) links the label, with `aria-describedby` /
  `aria-invalid` wired to the hint/error. Story covers Default, Required, WithHint,
  WithError, Disabled, Password, WithPrefixAndSuffix, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 5 — BaseModal (done)
- Built **`BaseModal`**: `v-model`-controlled dialog rendered via `<Teleport to="body">`,
  with sizes (sm / md / lg), `title`, and `closeOnBackdrop` / `closeOnEsc` / `hideClose`
  toggles. Slots: default (body), `header`, `footer`. Behaviour: backdrop click + Escape
  to close, body scroll-lock while open, listeners cleaned up on close/unmount. A11y:
  `role="dialog"`, `aria-modal`, `aria-labelledby` → the title. Transitions use Vue's
  custom transition-class props with Tailwind classes (no scoped CSS). Story covers
  Default, WithoutFooter, Persistent, LongContent.
- Added it to the `Introduction.mdx` component index.

### Slice 6 — BaseSelect (done)
- Built **`BaseSelect`**: a custom listbox dropdown (not a native `<select>`) following the
  WAI-ARIA select-only combobox pattern. `v-model` selected value, `options`
  (`{ label, value, disabled? }`), sizes (sm / md / lg), and the same `label` / `placeholder`
  / `hint` / `error` / `disabled` / `required` API as `BaseInput`. Behaviour: click + full
  keyboard nav (Arrow / Home / End / Enter / Space / Escape / Tab), type-ahead, disabled-option
  skipping, click-outside to close, active option scrolled into view. A11y: trigger is
  `role="combobox"` with `aria-haspopup` / `aria-expanded` / `aria-controls` /
  `aria-activedescendant`; menu is `role="listbox"` with `role="option"` + `aria-selected`.
  Focus stays on the trigger (active option tracked via `aria-activedescendant`). Story
  covers Default, Preselected, WithDisabledOptions, WithHint, WithError, Disabled, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 7 — BaseMultiSelect (done)
- Built **`BaseMultiSelect`**: a sibling to `BaseSelect` for multiple selection. Array
  `v-model` (`(string | number)[]`), reuses `BaseSelect`'s exported `SelectOption` type.
  Selecting **toggles** an option (menu stays open); options render a checkbox and the
  trigger shows **removable chips** for the selected values. Same keyboard nav / type-ahead
  / click-outside / sizes / hint-error API as `BaseSelect`; listbox is
  `aria-multiselectable="true"`. The trigger is a `div[role="combobox"][tabindex=0]` (not a
  `<button>`) so each chip can hold a real remove `<button>`; **Backspace removes the last
  chip**, and a per-size **`min-height`** stops the field jumping when the first chip appears
  (it only grows when chips wrap). Story covers Default, Preselected, WithDisabledOptions,
  WithHint, WithError, Disabled, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 8 — BaseTabs (done)
- Built **`BaseTabs`**: `tabs` array (`{ label, value, disabled? }`) with `v-model` for the
  active value (works uncontrolled too, falling back to the first enabled tab). `variant`
  (underline / pills) + `size` (sm / md / lg) class-map styling. Per-tab content via dynamic
  named slots keyed by `value`; panels render with `v-show` to preserve state. A11y: full
  WAI-ARIA tabs pattern — `role="tablist"` / `tab` / `tabpanel`, roving `tabindex`,
  Arrow/Home/End navigation with automatic activation, disabled-tab skipping. Story covers
  Default, Pills, WithDisabledTab, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 9 — BaseTooltip (done)
- Built **`BaseTooltip`**: wraps a trigger via the default slot and shows a floating label
  on hover **and** keyboard focus; hides on leave / blur / Escape. `content` prop or
  `content` slot, `placement` (top / bottom / left / right) with a matching arrow,
  `openDelay` (ms), and `disabled`. Pure-CSS positioning (no floating-ui), fade transition
  via Tailwind transition-class props. A11y: panel is `role="tooltip"`; the wrapper gets
  `aria-describedby` while visible. Story covers Default, Placements, WithDelay,
  OnIconButton, Disabled.
- Added it to the `Introduction.mdx` component index.

### Slice 10 — BaseAccordion (done)
- Built **`BaseAccordion`**: `items` array (`{ title, value, disabled? }`) with an
  always-array `v-model` of open values and a `multiple` flag (single-open by default).
  Per-item content via dynamic named slots keyed by `value`. Height animates with the
  pure-CSS `grid-template-rows: 0fr → 1fr` trick (no JS hooks); closed panels get `inert`.
  A11y: header `<button aria-expanded aria-controls>` wrapped in a configurable
  `headingLevel`, panel `role="region"` + `aria-labelledby`, optional Arrow/Home/End focus
  movement between headers. Story covers Default, Multiple, AllClosed, WithDisabledItem.
- Added it to the `Introduction.mdx` component index.

### Slice 11 — BaseRadioGroup (done)
- Built **`BaseRadioGroup`**: `options` array (`{ label, value, disabled? }`) with `v-model`
  single value, `size` (sm / md / lg), `orientation` (vertical / horizontal), and the same
  `label` / `hint` / `error` / `disabled` / `required` API as `BaseInput`. Uses **native
  `<input type="radio">`** (visually restyled via a `peer` + custom control span) so arrow-key
  selection, focus, and form semantics come for free; grouped in a `<fieldset>` / `<legend>`.
  Story covers Default, Preselected, Horizontal, WithHint, WithError, WithDisabledOption,
  Disabled, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 12 — BaseCheckbox (done)
- Built **`BaseCheckbox`**: a single checkbox with boolean `v-model`, an `indeterminate`
  (tri-state) mode, `size` (sm / md / lg), and the same `label` / `hint` / `error` /
  `disabled` / `required` API. Native `<input type="checkbox">` (visually restyled);
  checked/indeterminate visuals are driven from Vue state (avoids Tailwind's `peer-checked`
  descendant limit), while the native `.indeterminate` DOM property is synced for screen
  readers. Story covers Default, Checked, Indeterminate, WithHint, WithError, Disabled,
  Sizes, and a SelectAllGroup demo (parent reflects child state).
- Added it to the `Introduction.mdx` component index.

### Slice 13 — BaseSwitch (done)
- Built **`BaseSwitch`**: an on/off toggle mirroring `BaseCheckbox` — boolean `v-model`,
  `size` (sm / md / lg), and the shared `label` / `hint` / `error` / `disabled` / `required`
  API. Native `<input type="checkbox" role="switch">` (sr-only `peer`) restyled as a
  track + knob; the knob slides via a `translate-x` driven from Vue state, focus ring via
  `peer-focus-visible`. Story covers Default, On, WithHint, WithError, Disabled, Sizes, and
  a SettingsList demo.
- Added it to the `Introduction.mdx` component index.

### Slice 14 — BaseBadge (done)
- Built **`BaseBadge`**: a compact status/count indicator, distinct from `BaseTag` (which is
  a removable label chip). `variant` (neutral / brand / success / warning / danger),
  `appearance` (subtle / solid), `size` (sm / md), and a `dot` option — a leading status dot
  when there's content, or a standalone dot when empty. Rounded-full pill. Story covers
  Default, Solid, WithDot, Counts, StatusDots, Sizes, AllVariants.
- Added it to the `Introduction.mdx` component index.

### Slice 15 — BaseAvatar (done)
- Built **`BaseAvatar`**: image avatar with a graceful fallback chain — image → initials
  (derived from `name`) → default user icon, resetting on `src` change and handling `@error`.
  `size` (xs–xl), `shape` (circle / square), optional `ring`, and a presence `status` dot
  (online / away / busy / offline) in the corner. Initials get a deterministic soft color
  from a name hash. A default **slot overrides the fallback** (e.g. a "+5" group-overflow
  avatar). A11y: `role="img"` + `aria-label` on the non-image fallback; status has an
  `sr-only` label. Story covers Image, Initials, BrokenImageFallsBack, IconFallback,
  WithStatus, Shapes, Sizes, InitialColors, Group.
- Added it to the `Introduction.mdx` component index.

### Slice 16 — BaseSpinner (done)
- Built **`BaseSpinner`**: a rotating SVG ring (`animate-spin`) with `size` (xs–xl) and
  `color` (brand / neutral / white / `current`). `current` inherits `currentColor` so the
  spinner matches surrounding text (e.g. inside a `BaseButton`). A11y: `role="status"` with
  an `sr-only` `label` (default "Loading"); the SVG is `aria-hidden`. Story covers Default,
  Sizes, Colors, InButton.
- Added it to the `Introduction.mdx` component index.

### Slice 17 — BaseBreadcrumbs (done)
- Built **`BaseBreadcrumbs`**: `items` array (`{ label, href?, current? }`) rendered as
  `<nav aria-label><ol>`. Items with `href` are links, the current/last crumb is plain text
  with `aria-current="page"`, and href-less non-current items render as buttons emitting
  `select`. Customizable `separator` (prop, or a `separator` slot for e.g. a chevron svg),
  `size` (sm / md), and optional `maxItems` that collapses the middle to an ellipsis. Story
  covers Default, ChevronSeparator, ChevronSlot, Collapsed, Small, TwoLevels.
- Added it to the `Introduction.mdx` component index.

### Slice 18 — BaseCard (done)
- Built **`BaseCard`**: a slotted container with `variant` (outlined / elevated / filled),
  `padding` (none / sm / md / lg), convenience `title` / `subtitle` props (or a `header`
  slot), default body slot, and a `footer` slot. First-class **centered top icon**: an
  `icon` slot rendered in a tinted circle, plus a `centered` prop for the classic feature-card
  layout. Story covers Default, Elevated, Filled, FeatureWithIcon, WithFooter, CustomHeader,
  FeatureGrid.
- Added it to the `Introduction.mdx` component index.

### Slice 19 — BaseNotification (done)
- Built **`BaseNotification`**: an alert/callout with `variant` (info / success / warning /
  error), each with a tinted container + leading icon (overridable via `icon` slot, hideable
  via `icon` prop). Optional `title`, `dismissible` close button (emits `dismiss` — parent
  controls removal), and an `actions` slot for buttons. A11y: `role` is `alert` for
  error/warning (assertive) and `status` for info/success (polite). Non-dismissible
  notifications auto-dismiss after a `duration` (default 4000ms, `0` disables; dismissible
  ones wait for the user) with a fade-out; still emits `dismiss`. Doc stories set
  `duration: 0` to stay readable — see the AutoDismiss story for the timed behaviour. Story
  covers Info, Success, Warning, Error, MessageOnly, Dismissible, WithActions, AutoDismiss,
  AllTypes.
- Added it to the `Introduction.mdx` component index.

### Slice 20 — BaseProgress (done)
- Built **`BaseProgress`**: a progress bar with a determinate mode (`value` / `max`, animated
  width) and an `indeterminate` mode (a sliding bar via a small scoped `<style>` keyframe —
  the one place we step outside Tailwind utilities, kept self-contained in the component).
  `variant` (brand / success / warning / danger / neutral), `size` (sm / md / lg), optional
  `label` + `showValue` (percentage). A11y: `role="progressbar"` with
  `aria-valuemin/max/now` (now omitted when indeterminate). Story covers Default, WithLabel,
  Indeterminate, Variants, Sizes, and an Animated live demo.
- Added it to the `Introduction.mdx` component index.

### Slice 21 — BaseSkeleton (done)
- Built **`BaseSkeleton`**: loading placeholder with `shape` (text / rect / circle), `lines`
  (for text, last line 60% width), `width` / `height` (number → px), and `animation`
  (pulse via Tailwind `animate-pulse`, shimmer via a scoped gradient keyframe, or none).
  A11y: `role="status"` + `aria-busy`. Story covers Text, Rect, Circle, Shimmer, Sizes, and
  a composed CardPlaceholder.
- Added it to the `Introduction.mdx` component index.

### Slice 22 — BaseToast (done)
- Built **`BaseToast`**: a teleported toast stack driven by a `toasts` array
  (`{ id, variant?, title?, message?, duration?, dismissible? }`), `position` (6 corners),
  and a default `duration`. The **container owns the auto-dismiss timers** (so the
  `<TransitionGroup>` can animate removals) and emits `dismiss(id)` — the parent owns the
  array. Animated enter (fade + slide-up), leave (fade + slide-out, `absolute` so siblings
  reflow), and `move` transition. Reuses BaseNotification's variant palette + icons + severity
  `role`. Story covers Playground (buttons push each type), TopCenter, Persistent.
- Added it to the `Introduction.mdx` component index.

### Slice 23 — BasePagination (done)
- Built **`BasePagination`**: `v-model` current page (1-based), page count from `total`/
  `pageSize` or an explicit `pageCount`, `siblingCount` (neighbors shown), `size` (sm / md /
  lg), optional `showEdges` (first/last buttons), and `disabled`. Numbered pages with
  ellipsis truncation (first + last always shown, dots where the range is cut). A11y:
  `<nav aria-label="Pagination">` + `<ul>`, `aria-current="page"` on the active page,
  labelled prev/next/first/last buttons disabled at the ends. Story covers Default,
  MiddleOfRange, FewPages, WithEdges, MoreSiblings, Sizes, Disabled.
- Added it to the `Introduction.mdx` component index.

### Slice 24 — BaseTextarea (done)
- Built **`BaseTextarea`**: mirrors `BaseInput`'s `label` / `hint` / `error` / `size` /
  `disabled` / `required` API for multi-line input. Adds `rows`, a `resize` control
  (none / vertical / both), optional `autoGrow` (auto-resize height to content via
  scrollHeight; forces resize-none + overflow-hidden), and an optional character counter
  (`maxlength` + `showCount`). A11y: `useId` label link, `aria-describedby` / `aria-invalid`
  to hint/error. Story covers Default, WithHint, WithError, CharacterCount, AutoGrow,
  Disabled, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 25 — BaseSlider (done)
- Built **`BaseSlider`**: a restyled native `<input type="range">` (keyboard + slider ARIA
  for free). `v-model` number, `min` / `max` / `step`, `size` (sm / md / lg), the shared
  `label` / `hint` / `error` / `disabled` / `required` API, and optional `showValue`. Filled
  track via a computed CSS gradient; custom thumb/track through a scoped `<style>` sized by
  CSS custom properties (`--track` / `--thumb` / `--fill`), with a focus ring via
  `color-mix`; error turns the fill red. Story covers Default, Steps, CustomRange, WithHint,
  WithError, Disabled, Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 26 — BaseStat (done)
- Built **`BaseStat`**: a bare KPI/metric block (composes inside `BaseCard`) — `label`,
  big `value` (or `value` slot), optional colored `delta` with an ↑/↓ trend arrow,
  `deltaSuffix` / `deltaLabel`, and an `icon` slot. `trend` auto-derives from a numeric
  delta; `positiveIsGood` (default true) flips the up/down color mapping for metrics like
  churn/refunds. `size` (sm / md / lg) scales the value. Story covers Default, Negative,
  InvertedColor, NoDelta, WithIcon, InCard, Dashboard (grid of stat cards), Sizes.
- Added it to the `Introduction.mdx` component index.

### Slice 27 — BaseDivider (done)
- Built **`BaseDivider`**: `orientation` (horizontal / vertical), optional `label` (or default
  slot) with `labelPosition` (left / center / right) for horizontal, `variant` (solid /
  dashed), and `spacing` (none / sm / md / lg, applied as margin per orientation). Vertical is
  a self-stretching `border-l` line for inline use. A11y: `role="separator"` +
  `aria-orientation`. Story covers Plain, WithLabel, LabelLeft, Dashed, Vertical, Spacings.
- Added it to the `Introduction.mdx` component index.

### Slice 28 — BaseList (done)
- Built **`BaseList`**: renders an `items` array (`{ label?, description?, value?, disabled?,
  href? }`) as rows. `variant` (plain / divided / bordered), `interactive` (rows become
  hoverable buttons, or links when `href` set, emitting `select`), and `size` (sm / md / lg).
  Slots: `leading` / `trailing` (scoped, per row) and `item` (scoped, full row-content
  override). Semantic `<ul>`/`<li>`; disabled rows dimmed + non-interactive. Story covers
  Default, Bordered, Interactive, WithLeadingAndTrailing (avatar + badge), CustomItem,
  WithDisabledRow.
- Added it to the `Introduction.mdx` component index.

### Next up
- Add more presentational components one at a time (e.g. EmptyState, KBD/Code,
  DescriptionList), each as a fresh clean-room build following the `Base*` pattern.

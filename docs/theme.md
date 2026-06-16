# Theme (Dark / Light Mode)

Read this when working on theming, the `ThemeProvider`, or the dark/light toggle.

## Approach: Tailwind v4 `dark:` class + CSS variables

Tailwind v4 is configured with the `dark:` variant triggered by the `.dark` class on
`<html>`. The `ThemeProvider` toggles that class. There is no `prefers-color-scheme` media query
in the stylesheets — the provider reads the user's preference at mount time and re-applies it.

The body uses the standard pair:

```tsx
<body className="min-h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
```

Components use `dark:` variants on a per-element basis (e.g. `bg-white dark:bg-gray-900`,
`text-gray-500 dark:text-gray-400`).

## Files

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Root layout: mounts `ThemeProvider` + injects anti-flash script |
| `app/globals.css` | Tailwind v4 base styles |
| `components/ThemeProvider.tsx` | React context: `theme`, `toggleTheme`, `setTheme` |
| `components/ThemeToggle.tsx` | Icon button showing the **current** theme (moon for dark, sun for light) |

## Storage

```typescript
localStorage['theme']: 'light' | 'dark'
```

Absence of the key means **"follow system"** — the initial theme is read from
`window.matchMedia('(prefers-color-scheme: dark)').matches`.

## Anti-flash inline script (critical)

In `app/layout.tsx` we inject a small inline script that runs **before React hydrates**:

```html
<script>
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })()
</script>
```

This prevents the "flash of unstyled content" where the page renders in light mode and then
flips to dark after hydration. The script is wrapped in `try/catch` to handle private browsing
modes where `localStorage` throws.

The `<html>` element also has `suppressHydrationWarning` because the class attribute changes
between server-rendered HTML and the post-script DOM.

## Provider behavior

```typescript
getInitialTheme()
  // 1. Read localStorage 'theme' → 'light' or 'dark' if set
  // 2. Otherwise fall back to prefers-color-scheme

useEffect (mount)
  // Set state to getInitialTheme() + apply theme
  // Add .theme-transition to <html> for smooth color transitions
  // Listen to prefers-color-scheme changes
  //   → if user has NOT set a manual preference (no localStorage key),
  //     follow the system change

useEffect (state change)
  // If user calls setTheme, persist to localStorage and apply
```

## Smooth theme transitions

After hydration, `ThemeProvider` adds the `.theme-transition` class to `<html>`. This applies a
300 ms `transition-property` for `background-color`, `border-color`, `color`, `fill`, and `stroke`
to `<html>` and all descendants. The transition is added after mount so it does not interfere with
the anti-flash inline script.

`applyTheme(theme)` is `document.documentElement.classList.toggle('dark', theme === 'dark')`.

The `ThemeContext` is always present, including during SSR and the initial hydration
pass, so `useTheme()` never throws. Before mount the context defaults to `light` with
no-op handlers; the real preference is read and applied in the mount effect.

## Manual override

When the user clicks `ThemeToggle`:

1. `setTheme` writes `localStorage['theme'] = 'light' | 'dark'`
2. State updates
3. `applyTheme` toggles the class

The visible icon reflects the **current** theme (moon in dark mode, sun in light mode), while the `aria-label` still describes the action (switch to the opposite mode).

Once the user has set a manual preference, `prefers-color-scheme` changes are **ignored** (the
listener checks `localStorage.getItem('theme')` before applying).

## Fruit salad color palette

The app uses a unified palette built from Lluvia's fruit color sets (kiwi, fresa,
cranberry, melon, periwinkle). The same macro color is used for text and progress bars
in `MacroSummary`, for macro labels in `LogEntryRow` and `FoodCard`, and as the hover
accent on food cards.

CSS custom properties in `app/globals.css` define the colors in both modes. Light mode
uses darker, higher-contrast variants so text stays readable on white cards; dark mode
uses the bright pastels on black cards.

| Macro | Source | Light mode | Dark mode |
| --- | --- | --- | --- |
| Calories | periwinkle | `#6b6fcc` | `#9a9cea` |
| Protein | fresa | `#b52e56` | `#dd4470` |
| Fat | cranberry | `#c98a2e` | `#ffc872` |
| Carbs | kiwi | `#4caf50` | `#92de8b` |
| Sugar | fresa | `#d8437a` | `#fe72a9` |
| Fiber | kiwi | `#028174` | `#0ab68b` |

## Meal group tints

`LogEntryList` groups log entries by meal and applies a subtle background/border tint
from the fruit palette. The colors are defined as CSS variables in `app/globals.css` and
consumed via the `.meal-desayuno`, `.meal-comida`, `.meal-cena`, and `.meal-snack` utility
classes.

| Meal | Source | Light tint | Dark tint |
| --- | --- | --- | --- |
| Desayuno | kiwi cream | `#fff8e7` / `#ffe3b3` | `rgba(255, 227, 179, 0.12)` / `rgba(255, 227, 179, 0.35)` |
| Comida | cranberry cream | `#fdf5e8` / `#fce4bf` | `rgba(252, 228, 191, 0.12)` / `rgba(252, 228, 191, 0.35)` |
| Cena | melon pink | `#fdf0f0` / `#f4bbbb` | `rgba(244, 187, 187, 0.12)` / `rgba(244, 187, 187, 0.35)` |
| Snack | periwinkle mint | `#e8faf8` / `#adeee2` | `rgba(173, 238, 226, 0.12)` / `rgba(173, 238, 226, 0.35)` |

## Category tabs

`CategoryTabs` uses the fruit palette for the selected tab. Each category has a dedicated
utility class in `app/globals.css` (`.cat-proteina`, `.cat-carbohidratos`, etc.) that sets
background, text, and border colors for both light and dark modes.

| Category | Source | Light mode | Dark mode |
| --- | --- | --- | --- |
| Proteína | fresa | `#b52e56` | `#dd4470` |
| Carbohidratos | kiwi | `#4caf50` | `#92de8b` |
| Grasas | cranberry | `#c98a2e` | `#ffc872` |
| Frutas | fresa | `#d8437a` | `#fe72a9` |
| Verduras | kiwi | `#028174` | `#0ab68b` |
| Condimentos | periwinkle | `#6b6fcc` | `#9a9cea` |
| Suplementos | periwinkle | `#5a7abf` | `#a2b9ee` |

## Preparation badges

`FoodCard` and `LogEntryRow` show `crudo` / `cocido` badges using the fruit palette.
Utility classes `.prep-crudo` and `.prep-cocido` in `app/globals.css` set the background
and text colors for both modes.

| Preparation | Color | Light mode | Dark mode |
| --- | --- | --- | --- |
| Crudo | cranberry yellow | `#c98a2e` | `#ffc872` |
| Cocido | fresa red | `#b52e56` | `#dd4470` |

## Adding a new themed component

Use the existing `dark:` variants. Convention: `bg-{color} dark:bg-{darkColor}`,
`text-{color} dark:text-{darkColor}`, `border-{color} dark:border-{darkColor}`. Use
`bg-black/20 dark:bg-black/60` for modal overlays.

Read `docs/architecture.md` for the overall architecture.

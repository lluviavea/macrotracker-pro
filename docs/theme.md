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
| `components/ThemeToggle.tsx` | Sun/moon icon button (uses `useTheme()`) |

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
  // Listen to prefers-color-scheme changes
  //   → if user has NOT set a manual preference (no localStorage key),
  //     follow the system change

useEffect (state change)
  // If user calls setTheme, persist to localStorage and apply
```

`applyTheme(theme)` is `document.documentElement.classList.toggle('dark', theme === 'dark')`.

The `ThemeContext` is always present, including during SSR and the initial hydration
pass, so `useTheme()` never throws. Before mount the context defaults to `light` with
no-op handlers; the real preference is read and applied in the mount effect.

## Manual override

When the user clicks `ThemeToggle`:

1. `setTheme` writes `localStorage['theme'] = 'light' | 'dark'`
2. State updates
3. `applyTheme` toggles the class

Once the user has set a manual preference, `prefers-color-scheme` changes are **ignored** (the
listener checks `localStorage.getItem('theme')` before applying).

## Macro color palette (dark mode)

The macro summary cards use a custom palette only in dark mode. Colors are stored as CSS
variables in `app/globals.css` and referenced in `components/MacroSummary.tsx`.

| Macro | Dark mode color | Variable |
| --- | --- | --- |
| Calories | `#81638b` | `--color-macro-calories` |
| Protein | `#b695c0` | `--color-macro-protein` |
| Fat | `#dac9df` | `--color-macro-fat` |
| Carbs | `#5dc1b9` | `--color-macro-carbs` |
| Sugar | `#9ce0db` | `--color-macro-sugar` |
| Fiber | `#92de8b` | `--color-macro-fiber` |

Light mode keeps the original Tailwind colors (violet, red, orange, yellow, pink, green).

## Adding a new themed component

Use the existing `dark:` variants. Convention: `bg-{color} dark:bg-{darkColor}`,
`text-{color} dark:text-{darkColor}`, `border-{color} dark:border-{darkColor}`. Use
`bg-black/20 dark:bg-black/60` for modal overlays.

Read `docs/architecture.md` for the overall architecture.

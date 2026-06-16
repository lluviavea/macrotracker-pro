# Progressive Web App (PWA)

Read this when working on installability, offline support, or PWA assets.

## Overview

MacroTracker is a Progressive Web App. Users can install it on mobile and desktop from the
browser, and a basic service worker caches static assets for offline access.

## Files

| File | Responsibility |
| --- | --- |
| `public/manifest.json` | PWA manifest (name, icons, theme colors, display mode) |
| `public/sw.js` | Service worker that caches static assets and falls back to the network |
| `public/icon-192x192.png` | Small icon for install prompt and home screen |
| `public/icon-512x512.png` | Large icon for splash screens |
| `scripts/generate-icons.mjs` | Generates PNG icons from an SVG using `sharp` |
| `components/PWARegister.tsx` | Client-only component that registers `/sw.js` |
| `app/layout.tsx` | Adds manifest link, Apple web app metadata, and theme color |

## Generating icons

If you change the icon design, regenerate the PNGs:

```bash
node scripts/generate-icons.mjs
```

The script reads an inline SVG, renders it with `sharp`, and writes `public/icon-192x192.png` and
`public/icon-512x512.png`.

## Service worker behavior

`public/sw.js` uses a cache-first-then-network strategy:

1. On `install`, it caches the root page, login page, icons, and manifest.
2. On `activate`, it deletes old caches.
3. On `fetch`, it serves from cache if available; otherwise it fetches from the network and caches
the response for future offline use.

Dynamic API routes (`/api/*`) are not pre-cached, but they will be cached after the first request
while the user is online.

## Limitations

- The service worker caches static pages and runtime assets, but API responses may be stale if the
user is offline for a long time.
- There is no background sync yet. Log entries created offline are lost unless the user is online
when submitting.

## Testing PWA features

1. Run `just run`.
2. Open the app in Chrome.
3. Open DevTools → Lighthouse → PWA to audit.
4. On mobile, use the share menu and choose "Add to Home Screen".

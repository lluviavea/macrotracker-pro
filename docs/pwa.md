# Progressive Web App (PWA)

Read this when working on installability, offline support, or PWA assets.

## Overview

MacroTracker is a Progressive Web App. Users can install it on mobile and desktop from the
browser, and a basic service worker caches static assets for offline access.

## Files

| File | Responsibility |
| --- | --- |
| `public/manifest.json` | PWA manifest (name, icons, theme colors, display mode) |
| `public/sw.js` | Service worker: network-first navigations, cache-first static assets, offline fallback |
| `public/icon-192x192.png` | Small icon for install prompt and home screen |
| `public/icon-512x512.png` | Large icon for splash screens |
| `scripts/generate-icons.mjs` | Generates PNG icons from an SVG using `sharp` |
| `components/PWARegister.tsx` | Client-only component that registers `/sw.js` and auto-reloads on SW updates |
| `app/layout.tsx` | Adds manifest link, Apple web app metadata, and theme color |

## Generating icons

If you change the icon design, regenerate the PNGs:

```bash
node scripts/generate-icons.mjs
```

The script reads an inline SVG, renders it with `sharp`, and writes `public/icon-192x192.png` and
`public/icon-512x512.png`.

## Service worker behavior

`public/sw.js` uses a **network-first** strategy for navigations and a **cache-first** strategy for
static assets:

1. On `install`, precaches only static files (icons, manifest).
2. On `activate`, deletes old caches and calls `clients.claim()`.
3. On `fetch`, applies different strategies by request type:
    - **Navigations**: network-first with cache + offline HTML fallback.
    - **Static assets** (`/_next/static/`, icons): cache-first (immutable, hashed).
    - **Other same-origin GETs**: network-first with cache fallback.
4. `PWARegister.tsx` listens for `controllerchange` and auto-reloads on SW update.

### Why network-first for navigations?

The dashboard is per-user, per-day, and dynamic. A cache-first strategy served stale authenticated
HTML and could return `undefined` on transient network failures (causing `ERR_FAILED` in Chrome).
Network-first ensures fresh content on every refresh while still providing offline fallback.

## Limitations

- The service worker caches navigations and static assets for offline use, but API responses are
  not available offline — the app shows an error/retry banner when the network is unavailable.
- There is no background sync yet. Log entries created offline are lost unless the user is online
  when submitting.

## Testing PWA features

1. Run `just run`.
2. Open the app in Chrome.
3. Open DevTools → Lighthouse → PWA to audit.
4. On mobile, use the share menu and choose "Add to Home Screen".

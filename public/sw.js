const CACHE_NAME = 'macrotracker-v2'

const PRECACHE_URLS = [
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
]

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sin conexión / Offline</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 2rem; background: #f9fafb; color: #111827; }
    div { text-align: center; max-width: 24rem; }
    h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
    p { color: #6b7280; margin: 0 0 1.5rem; }
    button { padding: .5rem 1.5rem; border: none; border-radius: .5rem; background: #111827; color: #fff; font-size: .875rem; font-weight: 500; cursor: pointer; }
    @media (prefers-color-scheme: dark) { body { background: #030712; color: #f3f4f6; } p { color: #9ca3af; } button { background: #f3f4f6; color: #030712; } }
  </style>
</head>
<body>
  <div>
    <h1>Sin conexión</h1>
    <p>Verifica tu conexión a internet e inténtalo de nuevo.</p>
    <button onclick="location.reload()">Reintentar</button>
  </div>
</body>
</html>`

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      ),
      self.clients.claim(),
    ])
  )
})

self.addEventListener('fetch', event => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          if (cached) return cached
          return new Response(OFFLINE_HTML, {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        })
    )
    return
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icon-') ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ||
        fetch(request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
      )
    )
    return
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})

'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <head>
        <style>{`
          body { font-family: system-ui, -apple-system, sans-serif; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 2rem; background: #f9fafb; color: #111827; }
          div { text-align: center; max-width: 28rem; }
          h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
          p { color: #6b7280; margin: 0 0 1.5rem; line-height: 1.5; }
          button { padding: .5rem 1.5rem; border: none; border-radius: .5rem; background: #111827; color: #fff; font-size: .875rem; font-weight: 500; cursor: pointer; }
          button:hover { opacity: .8; }
          @media (prefers-color-scheme: dark) { body { background: #030712; color: #f3f4f6; } p { color: #9ca3af; } button { background: #f3f4f6; color: #030712; } }
        `}</style>
      </head>
      <body>
        <div>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Try again — if the problem persists, clear your browser cache or contact support.</p>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  )
}

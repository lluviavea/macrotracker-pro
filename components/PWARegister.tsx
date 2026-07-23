'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const hadController = !!navigator.serviceWorker.controller

    navigator.serviceWorker
      .register('/sw.js')
      .catch(error => {
        console.error('SW registration failed:', error)
      })

    if (hadController) {
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }
  }, [])

  return null
}

'use client'

import { useEffect, useState } from 'react'

export interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

let nextId = 0

const listeners: Set<(msg: ToastMessage) => void> = new Set()

export function showToast(text: string, type: ToastMessage['type'] = 'success') {
  const msg: ToastMessage = { id: nextId++, text, type }
  listeners.forEach(fn => fn(msg))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id))
      }, 2500)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  if (toasts.length === 0) return null

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-700',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${colors[t.type]} text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg animate-slide-up`}
        >
          {t.text}
        </div>
      ))}
    </div>
  )
}

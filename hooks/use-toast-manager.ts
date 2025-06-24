"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"

interface Toast {
  id: string
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  icon?: React.ReactNode
}

export function useToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto-remove after duration
    const duration = toast.duration || 3000
    const timeout = setTimeout(() => {
      removeToast(id)
    }, duration)

    timeoutRefs.current.set(id, timeout)

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    // Clear timeout
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }

    // Remove toast
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current.clear()

    // Clear all toasts
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  }
}

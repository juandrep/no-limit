"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  icon?: React.ReactNode
  autoClose?: boolean
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => string
  hideToast: (id: string) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const hideToast = useCallback((id: string) => {
    console.log("Hiding toast:", id)

    // Clear timeout
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }

    // Remove toast
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = {
        ...toast,
        id,
        autoClose: toast.autoClose !== false, // Default to true
        duration: toast.duration || 2000,
      }

      console.log("Adding toast:", newToast)
      setToasts((prev) => [...prev, newToast])

      // Auto-close if enabled
      if (newToast.autoClose) {
        console.log(`Setting auto-close timer for ${newToast.duration}ms`)
        const timeout = setTimeout(() => {
          console.log("Auto-closing toast:", id)
          hideToast(id)
        }, newToast.duration)

        timeoutsRef.current.set(id, timeout)
      }

      return id
    },
    [hideToast],
  )

  const clearAllToasts = useCallback(() => {
    console.log("Clearing all toasts")
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()

    // Clear all toasts
    setToasts([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pointer-events-auto"
            >
              <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-xl p-4 flex items-center space-x-3 min-w-[200px] max-w-[280px]">
                {toast.icon && <div className="flex-shrink-0">{toast.icon}</div>}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{toast.message}</p>
                  {toast.type && <p className="text-xs text-muted-foreground capitalize">{toast.type}</p>}
                </div>

                <button
                  onClick={() => hideToast(toast.id)}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
                  aria-label="Close notification"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

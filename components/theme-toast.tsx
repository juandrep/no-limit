"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/hooks/use-theme"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToast() {
  const { theme, actualTheme } = useTheme()
  const [showToast, setShowToast] = useState(false)
  const [lastTheme, setLastTheme] = useState(theme)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const themes = {
    light: { icon: Sun, label: "Light Mode", color: "bg-yellow-500" },
    dark: { icon: Moon, label: "Dark Mode", color: "bg-blue-600" },
    system: { icon: Monitor, label: "System Mode", color: "bg-gray-600" },
  }

  // Clear any existing timeout
  const clearToastTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Close toast function
  const closeToast = () => {
    clearToastTimeout()
    setShowToast(false)
  }

  useEffect(() => {
    if (theme !== lastTheme) {
      // Clear any existing timeout first
      clearToastTimeout()

      // Show the toast
      setShowToast(true)
      setLastTheme(theme)

      // Set new timeout to auto-close
      timeoutRef.current = setTimeout(() => {
        setShowToast(false)
      }, 3000) // 3 seconds
    }
  }, [theme, lastTheme])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearToastTimeout()
    }
  }, [])

  const currentTheme = themes[theme]
  const Icon = currentTheme?.icon || Monitor

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 flex items-center space-x-3 bg-background border rounded-lg shadow-lg p-4 min-w-[220px] max-w-[300px]"
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentTheme?.color} text-white flex-shrink-0`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{currentTheme?.label}</p>
            <p className="text-xs text-muted-foreground truncate">
              {theme === "system" ? `Following system (${actualTheme})` : "Theme applied"}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={closeToast} className="h-6 w-6 flex-shrink-0 hover:bg-muted">
            <X className="h-3 w-3" />
            <span className="sr-only">Close notification</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

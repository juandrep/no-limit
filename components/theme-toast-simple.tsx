"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/hooks/use-theme"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, X } from "lucide-react"

export function ThemeToastSimple() {
  const { theme, actualTheme } = useTheme()
  const [showToast, setShowToast] = useState(false)
  const [lastTheme, setLastTheme] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  const themes = {
    light: { icon: Sun, label: "Light Mode", color: "from-yellow-400 to-orange-500" },
    dark: { icon: Moon, label: "Dark Mode", color: "from-blue-600 to-purple-600" },
    system: { icon: Monitor, label: "System Mode", color: "from-gray-500 to-gray-700" },
  }

  // Function to close toast and clear timeout
  const closeToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowToast(false)
  }

  // Function to show toast with auto-close
  const showToastWithTimer = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Show toast
    setShowToast(true)

    // Set timeout to auto-close
    timeoutRef.current = setTimeout(() => {
      console.log("Auto-closing toast after 2 seconds")
      setShowToast(false)
      timeoutRef.current = null
    }, 2000)
  }

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      setLastTheme(theme)
      isInitialMount.current = false
      return
    }

    // Only show toast if theme actually changed
    if (theme !== lastTheme) {
      console.log("Theme changed from", lastTheme, "to", theme)
      setLastTheme(theme)
      showToastWithTimer()
    }
  }, [theme, lastTheme])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const currentTheme = themes[theme]
  const Icon = currentTheme?.icon || Monitor

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          className="fixed bottom-6 right-6 z-[100] pointer-events-auto"
        >
          <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-xl p-4 flex items-center space-x-3 min-w-[200px] max-w-[280px]">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${currentTheme?.color} text-white shadow-lg`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">{currentTheme?.label}</p>
              <p className="text-xs text-muted-foreground">
                {theme === "system" ? `Using ${actualTheme} mode` : "Applied successfully"}
              </p>
            </div>

            <button
              onClick={closeToast}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary/50 to-primary rounded-b-xl"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

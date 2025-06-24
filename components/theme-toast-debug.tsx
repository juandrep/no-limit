"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, X } from "lucide-react"

export function ThemeToastDebug() {
  const { theme } = useTheme()
  const [showToast, setShowToast] = useState(false)
  const [lastTheme, setLastTheme] = useState(theme)
  const [countdown, setCountdown] = useState(0)

  const themes = {
    light: { icon: Sun, label: "Light Mode", color: "from-yellow-400 to-orange-500" },
    dark: { icon: Moon, label: "Dark Mode", color: "from-blue-600 to-purple-600" },
    system: { icon: Monitor, label: "System Mode", color: "from-gray-500 to-gray-700" },
  }

  useEffect(() => {
    if (theme !== lastTheme && lastTheme !== "") {
      console.log("Theme changed, showing toast")
      setShowToast(true)
      setCountdown(2)
      setLastTheme(theme)

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            console.log("Countdown finished, closing toast")
            clearInterval(countdownInterval)
            setShowToast(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(countdownInterval)
      }
    } else if (lastTheme === "") {
      setLastTheme(theme)
    }
  }, [theme, lastTheme])

  const currentTheme = themes[theme]
  const Icon = currentTheme?.icon || Monitor

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed bottom-6 right-6 z-[100] pointer-events-auto"
        >
          <div className="bg-background border rounded-xl shadow-xl p-4 flex items-center space-x-3 min-w-[220px]">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${currentTheme?.color} text-white`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm">{currentTheme?.label}</p>
              <p className="text-xs text-muted-foreground">Auto-close in {countdown}s</p>
            </div>

            <button
              onClick={() => setShowToast(false)}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

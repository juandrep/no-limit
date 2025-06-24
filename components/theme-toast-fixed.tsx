"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, X } from "lucide-react"
import { useAutoClose } from "@/hooks/use-auto-close"

export function ThemeToastFixed() {
  const { theme, actualTheme } = useTheme()
  const [lastTheme, setLastTheme] = useState("")
  const [currentToastTheme, setCurrentToastTheme] = useState(theme)

  const { isVisible, show, hide } = useAutoClose({
    duration: 2000,
    onClose: () => {
      console.log("Toast auto-closed")
    },
  })

  const themes = {
    light: { icon: Sun, label: "Light Mode", color: "from-yellow-400 to-orange-500" },
    dark: { icon: Moon, label: "Dark Mode", color: "from-blue-600 to-purple-600" },
    system: { icon: Monitor, label: "System Mode", color: "from-gray-500 to-gray-700" },
  }

  useEffect(() => {
    // Skip initial mount
    if (lastTheme === "") {
      setLastTheme(theme)
      return
    }

    // Only show if theme actually changed
    if (theme !== lastTheme) {
      console.log(`Theme changed from ${lastTheme} to ${theme}`)
      setLastTheme(theme)
      setCurrentToastTheme(theme)
      show()
    }
  }, [theme, lastTheme, show])

  const currentTheme = themes[currentToastTheme]
  const Icon = currentTheme?.icon || Monitor

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
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
                {currentToastTheme === "system" ? `Using ${actualTheme} mode` : "Applied successfully"}
              </p>
            </div>

            <button
              onClick={hide}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/hooks/use-theme"
import { useToast } from "@/contexts/toast-context"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToastContext() {
  const { theme, actualTheme } = useTheme()
  const { showToast } = useToast()
  const [lastTheme, setLastTheme] = useState("")
  const isInitialMount = useRef(true)

  const themes = {
    light: { icon: Sun, label: "Light Mode", color: "from-yellow-400 to-orange-500" },
    dark: { icon: Moon, label: "Dark Mode", color: "from-blue-600 to-purple-600" },
    system: { icon: Monitor, label: "System Mode", color: "from-gray-500 to-gray-700" },
  }

  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      setLastTheme(theme)
      isInitialMount.current = false
      return
    }

    // Only show if theme actually changed
    if (theme !== lastTheme) {
      console.log(`Theme changed from ${lastTheme} to ${theme}`)
      setLastTheme(theme)

      const currentTheme = themes[theme]
      const Icon = currentTheme?.icon || Monitor

      showToast({
        message: `${currentTheme?.label || "Theme Changed"}`,
        duration: 2000,
        autoClose: true,
        icon: (
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${currentTheme?.color} text-white shadow-lg`}
          >
            <Icon className="h-5 w-5" />
          </div>
        ),
      })
    }
  }, [theme, lastTheme, showToast, actualTheme])

  return null // This component doesn't render anything itself
}

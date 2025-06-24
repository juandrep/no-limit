"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { motion } from "framer-motion"

export function ThemeToggleSimple() {
  const { theme, setTheme, actualTheme } = useTheme()

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ]

  const currentIndex = themes.findIndex((t) => t.value === theme)
  const currentTheme = themes[currentIndex] || themes[0]
  const CurrentIcon = currentTheme.icon

  const cycleTheme = () => {
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    setTheme(nextTheme.value)

    // Show a brief notification
    console.log(`Theme switched to: ${nextTheme.label}`)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative h-9 w-9"
      title={`Current: ${currentTheme.label}. Click to switch to next theme.`}
    >
      <motion.div
        key={`${actualTheme}-${theme}`}
        initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <CurrentIcon className="h-4 w-4" />
      </motion.div>
      <span className="sr-only">Toggle theme - Current: {currentTheme.label}</span>
    </Button>
  )
}

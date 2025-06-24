"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const themes = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ]

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Monitor

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9"
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <motion.div
          key={actualTheme}
          initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CurrentIcon className="h-4 w-4" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 z-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
              </div>

              <div className="py-1">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  const isSelected = theme === themeOption.value

                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => handleThemeSelect(themeOption.value)}
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{themeOption.label}</div>
                          <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

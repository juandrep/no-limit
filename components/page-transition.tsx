"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Radio } from "lucide-react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [currentPath, setCurrentPath] = useState(pathname)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear any existing timeouts
  const clearTimeouts = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
    if (initialLoadTimeoutRef.current) {
      clearTimeout(initialLoadTimeoutRef.current)
      initialLoadTimeoutRef.current = null
    }
  }

  useEffect(() => {
    // Handle initial page load
    if (isInitialLoad) {
      setIsLoading(true)

      initialLoadTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setIsInitialLoad(false)
        setCurrentPath(pathname)
      }, 1500) // Show loading for 1.5 seconds on initial load

      return () => clearTimeouts()
    }
  }, [isInitialLoad, pathname])

  useEffect(() => {
    // Handle page transitions (not initial load)
    if (!isInitialLoad && pathname !== currentPath) {
      // Clear any existing timeouts first
      clearTimeouts()

      setIsLoading(true)

      // Scroll to top immediately when route changes
      window.scrollTo({ top: 0, behavior: "smooth" })

      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setCurrentPath(pathname)
      }, 600) // Shorter loading for page transitions

      return () => clearTimeouts()
    }
  }, [pathname, isInitialLoad, currentPath])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts()
  }, [])

  // Force stop loading if it's been too long (safety net)
  useEffect(() => {
    if (isLoading && !isInitialLoad) {
      const safetyTimeout = setTimeout(() => {
        console.warn("Loading took too long, forcing stop")
        setIsLoading(false)
        setCurrentPath(pathname)
      }, 2000) // Maximum 2 seconds for page transitions

      return () => clearTimeout(safetyTimeout)
    }
  }, [isLoading, isInitialLoad, pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                  <Radio className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 -z-10"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold mb-2">No Limit Radio</h2>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isInitialLoad ? "Loading your music experience..." : "Switching pages..."}</span>
                </div>
              </motion.div>

              {/* Loading bar */}
              <motion.div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: isInitialLoad ? 1.4 : 0.5,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

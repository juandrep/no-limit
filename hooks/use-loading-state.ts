"use client"

import { useState, useRef, useCallback } from "react"

interface LoadingStateOptions {
  minDuration?: number
  maxDuration?: number
}

export function useLoadingState(options: LoadingStateOptions = {}) {
  const { minDuration = 300, maxDuration = 2000 } = options
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const startLoading = useCallback(
    (duration?: number) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setIsLoading(true)
      startTimeRef.current = Date.now()

      const loadingDuration = duration || minDuration

      timeoutRef.current = setTimeout(
        () => {
          const elapsed = Date.now() - startTimeRef.current
          const remainingTime = Math.max(0, minDuration - elapsed)

          if (remainingTime > 0) {
            // Ensure minimum duration
            setTimeout(() => {
              setIsLoading(false)
            }, remainingTime)
          } else {
            setIsLoading(false)
          }
        },
        Math.min(loadingDuration, maxDuration),
      )
    },
    [minDuration, maxDuration],
  )

  const stopLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const elapsed = Date.now() - startTimeRef.current
    const remainingTime = Math.max(0, minDuration - elapsed)

    if (remainingTime > 0) {
      // Ensure minimum duration even when stopping early
      setTimeout(() => {
        setIsLoading(false)
      }, remainingTime)
    } else {
      setIsLoading(false)
    }
  }, [minDuration])

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    cleanup,
  }
}

"use client"

import { useEffect, useRef, useState } from "react"

interface UseAutoCloseOptions {
  duration?: number
  onClose?: () => void
}

export function useAutoClose({ duration = 2000, onClose }: UseAutoCloseOptions) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const show = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsVisible(true)
    startTimeRef.current = Date.now()

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      console.log("Auto-close timeout triggered")
      setIsVisible(false)
      onClose?.()
      timeoutRef.current = null
    }, duration)

    console.log(`Auto-close timer set for ${duration}ms`)
  }

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
    onClose?.()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isVisible,
    show,
    hide,
  }
}

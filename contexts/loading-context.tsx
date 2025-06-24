"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useRef } from "react"

interface LoadingContextType {
  isGlobalLoading: boolean
  startGlobalLoading: (id: string, duration?: number) => void
  stopGlobalLoading: (id: string) => void
  clearAllLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false)
  const loadingIds = useRef<Set<string>>(new Set())
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const startGlobalLoading = useCallback((id: string, duration = 600) => {
    // Clear existing timeout for this id
    const existingTimeout = timeouts.current.get(id)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Add to loading set
    loadingIds.current.add(id)
    setIsGlobalLoading(true)

    // Set timeout to auto-stop
    const timeout = setTimeout(() => {
      stopGlobalLoading(id)
    }, duration)

    timeouts.current.set(id, timeout)
  }, [])

  const stopGlobalLoading = useCallback((id: string) => {
    // Clear timeout
    const timeout = timeouts.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeouts.current.delete(id)
    }

    // Remove from loading set
    loadingIds.current.delete(id)

    // Update global loading state
    setIsGlobalLoading(loadingIds.current.size > 0)
  }, [])

  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    timeouts.current.forEach((timeout) => clearTimeout(timeout))
    timeouts.current.clear()

    // Clear loading set
    loadingIds.current.clear()
    setIsGlobalLoading(false)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isGlobalLoading,
        startGlobalLoading,
        stopGlobalLoading,
        clearAllLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

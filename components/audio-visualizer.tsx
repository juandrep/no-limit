"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "@/hooks/use-theme"

interface AudioVisualizerProps {
  audioContext: AudioContext | null
  analyser: AnalyserNode | null
  isPlaying: boolean
  height?: number
  barCount?: number
}

export function AudioVisualizer({
  audioContext,
  analyser,
  isPlaying,
  height = 60,
  barCount = 32,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { actualTheme } = useTheme()

  const draw = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate bar dimensions
    const barWidth = canvas.width / barCount
    const barSpacing = 2

    // Get theme-appropriate colors
    const isDark = actualTheme === "dark"
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()

    let resolvedColor: string
    let resolvedColorWithOpacity: string

    if (primaryColor) {
      resolvedColor = `hsl(${primaryColor})`
      resolvedColorWithOpacity = `hsl(${primaryColor} / ${isDark ? 0.7 : 0.5})`
    } else {
      // Fallback colors based on theme
      resolvedColor = isDark ? "#60a5fa" : "#3b82f6"
      resolvedColorWithOpacity = isDark ? "rgba(96, 165, 250, 0.7)" : "rgba(59, 130, 246, 0.5)"
    }

    if (analyser && audioContext && isPlaying) {
      // Real audio visualization
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength)
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height

        const x = i * barWidth
        const y = canvas.height - barHeight

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, resolvedColor)
        gradient.addColorStop(1, resolvedColorWithOpacity)

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth - barSpacing, barHeight)
      }
    } else {
      // Fallback animation when no audio context or not playing
      const time = Date.now() * 0.001
      for (let i = 0; i < barCount; i++) {
        const barHeight = isPlaying
          ? (Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5) * canvas.height * 0.3 + 10
          : Math.random() * 15 + 5

        const x = i * barWidth
        const y = canvas.height - barHeight

        // Use different opacity for static vs animated bars
        const fillColor = isPlaying
          ? resolvedColorWithOpacity
          : isDark
            ? "rgba(96, 165, 250, 0.3)"
            : "rgba(59, 130, 246, 0.3)"

        ctx.fillStyle = fillColor
        ctx.fillRect(x, y, barWidth - barSpacing, barHeight)
      }
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw)
    }
  }, [analyser, audioContext, isPlaying, barCount, actualTheme])

  useEffect(() => {
    if (isPlaying) {
      draw()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Draw static bars when not playing
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = rect.width + "px"
      canvas.style.height = height + "px"

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [height])

  return (
    <div className="w-full bg-muted/30 rounded-lg p-4 transition-colors duration-300">
      <canvas ref={canvasRef} className="w-full rounded" style={{ height: `${height}px` }} />
      {!audioContext && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Audio visualization requires user interaction to start
        </p>
      )}
    </div>
  )
}

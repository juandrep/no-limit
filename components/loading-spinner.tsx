"use client"

import { motion } from "framer-motion"
import { Radio, Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="relative"
      >
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 flex items-center justify-center`}
        >
          <Radio className={`${iconSizes[size]} text-white`} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 -z-10`}
        />
      </motion.div>

      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{text}</span>
        </motion.div>
      )}
    </div>
  )
}

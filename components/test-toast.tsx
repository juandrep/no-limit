"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TestToast() {
  const [show, setShow] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const showToast = () => {
    console.log("Showing test toast")
    setShow(true)
    setCountdown(3)

    // Simple countdown
    let count = 3
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      console.log(`Countdown: ${count}`)

      if (count <= 0) {
        console.log("Closing test toast")
        clearInterval(interval)
        setShow(false)
      }
    }, 1000)
  }

  return (
    <div className="fixed top-4 left-4 z-[200] space-y-2">
      <Button onClick={showToast} variant="outline" size="sm">
        Test Toast
      </Button>

      {show && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <p>Test Toast - Closing in {countdown}s</p>
          <Button onClick={() => setShow(false)} variant="ghost" size="sm" className="text-white hover:bg-red-600">
            Close
          </Button>
        </div>
      )}
    </div>
  )
}

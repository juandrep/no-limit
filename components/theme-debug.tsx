"use client"

import { useTheme } from "@/hooks/use-theme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ThemeDebug() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <Card className="fixed bottom-4 left-4 w-64 z-50 opacity-90">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Theme Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs">
          <p>Selected: {theme}</p>
          <p>Actual: {actualTheme}</p>
          <p>System: {window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"}</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button size="sm" variant="outline" onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button size="sm" variant="outline" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

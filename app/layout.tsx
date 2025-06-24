import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { ThemeProvider } from "@/hooks/use-theme"
import { PageTransition } from "@/components/page-transition"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LoadingProvider } from "@/contexts/loading-context"
import { ToastProvider } from "@/contexts/toast-context"
import { ThemeToastContext } from "@/components/theme-toast-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "No Limit Radio - Your Music, No Limits",
  description: "Stream the best Hip-Hop, R&B, and Rock/Pop music 24/7",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <LoadingProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <PageTransition>{children}</PageTransition>
                  </main>
                  <Footer />
                </div>
                <ScrollToTop />
                <ThemeToastContext />
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

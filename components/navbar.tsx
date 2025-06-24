"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Radio, User, LogOut, Settings, Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthModal } from "@/components/auth-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeToggleSimple } from "@/components/theme-toggle-simple"
import { useAuth } from "@/hooks/use-auth"
import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Stations", href: "/stations" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleNavigation = useCallback(
    (href: string) => {
      if (isNavigating) return // Prevent rapid clicking

      setIsNavigating(true)
      setMobileMenuOpen(false) // Close mobile menu when navigating

      // Reset after a short delay
      setTimeout(() => {
        setIsNavigating(false)
      }, 800)
    },
    [isNavigating],
  )

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false) // Close mobile menu after logout
    setMobileUserMenuOpen(false) // Close user menu
  }

  const handleDesktopLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const handleAuthModalOpen = () => {
    setShowAuthModal(true)
  }

  const handleAuthModalClose = (open: boolean) => {
    setShowAuthModal(open)
  }

  const toggleMobileUserMenu = () => {
    setMobileUserMenuOpen(!mobileUserMenuOpen)
  }

  // Close dropdown when clicking outside (same as theme toggle)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key (same as theme toggle)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isUserMenuOpen])

  const handleUserMenuItemClick = (action: () => void) => {
    action()
    setIsUserMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Radio className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">No Limit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                  isNavigating && "pointer-events-none opacity-50",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="ml-auto flex items-center space-x-8">
            {/* Theme Toggle - Desktop only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Auth Section */}
            {user ? (
              <>
                {/* Desktop User Menu - Using same pattern as ThemeToggle */}
                <div className="hidden md:block relative">
                  <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative h-12 w-12 rounded-full"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-72 z-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
                        >
                          {/* User Info Header */}
                          <div className="px-3 py-3 border-b">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-base font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              href="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                            >
                              <User className="mr-3 h-4 w-4" />
                              <span>Profile</span>
                            </Link>

                            <Link
                              href="/favorites"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                            >
                              <Heart className="mr-3 h-4 w-4" />
                              <span>Favorites</span>
                            </Link>

                            <Link
                              href="/settings"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                            >
                              <Settings className="mr-3 h-4 w-4" />
                              <span>Settings</span>
                            </Link>

                            <div className="my-1 h-px bg-border" />

                            <button
                              onClick={() => handleUserMenuItemClick(handleDesktopLogout)}
                              className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 outline-none text-red-600"
                            >
                              <LogOut className="mr-3 h-4 w-4" />
                              <span>Log out</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile User Avatar - Just shows avatar, menu is in mobile sheet */}
                <div className="md:hidden">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              // Login button - visible on both desktop and mobile
              <Button
                onClick={handleAuthModalOpen}
                variant="default"
                size="default"
                className="h-10 px-6 font-medium mr-4"
              >
                Login
              </Button>
            )}

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-4">
                  {/* User Section - Only show if logged in */}
                  {user && (
                    <div className="pb-4 border-b">
                      <button
                        onClick={toggleMobileUserMenu}
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            mobileUserMenuOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {/* Collapsible User Menu */}
                      {mobileUserMenuOpen && (
                        <div className="mt-3 space-y-1 pl-4">
                          <Link
                            href="/profile"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileUserMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span className="text-sm">Profile</span>
                          </Link>
                          <Link
                            href="/favorites"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileUserMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">Favorites</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileUserMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-red-600 hover:text-red-700 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Log out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "block p-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted/50",
                          pathname === item.href
                            ? "bg-muted text-foreground"
                            : "text-foreground/70 hover:text-foreground",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Theme Toggle - Mobile only */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeToggleSimple />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={handleAuthModalClose} />
    </>
  )
}

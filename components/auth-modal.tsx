"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, register, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Prevent background scrolling when modal is open - improved mobile handling
  useEffect(() => {
    if (open) {
      // Store the current overflow state
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      // Return cleanup function that restores original state
      return () => {
        document.body.style.overflow = originalOverflow || "unset"
      }
    }
  }, [open])

  // Reset form when switching tabs
  useEffect(() => {
    setErrors({})
    setShowPassword(false)
  }, [activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!loginForm.email || !loginForm.password) {
      setErrors({ general: "Please fill in all fields" })
      return
    }

    try {
      await login(loginForm.email, loginForm.password)
      onOpenChange(false)
      setLoginForm({ email: "", password: "" })
    } catch (error) {
      setErrors({ general: "Invalid email or password" })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setErrors({ general: "Please fill in all fields" })
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      return
    }

    if (registerForm.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" })
      return
    }

    try {
      await register(registerForm.name, registerForm.email, registerForm.password)
      onOpenChange(false)
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" })
    } catch (error) {
      setErrors({ general: "Email already exists or registration failed" })
    }
  }

  // Animation variants for form content
  const formVariants = {
    hidden: {
      opacity: 0,
      x: activeTab === "login" ? -20 : 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: activeTab === "login" ? 20 : -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  // Stagger animation for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>Welcome to No Limit Radio</DialogTitle>
            <DialogDescription>Sign in to your account or create a new one to get started.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="login"
                className="relative transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: activeTab === "login" ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Login
                </motion.span>
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="relative transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: activeTab === "register" ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Up
                </motion.span>
              </TabsTrigger>
            </TabsList>

            {/* Login Tab Content */}
            <TabsContent value="login" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "login" && (
                  <motion.div key="login-form" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-4">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <CardTitle className="text-lg">Welcome Back</CardTitle>
                          <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </motion.div>
                      </CardHeader>
                      <CardContent>
                        <motion.form
                          onSubmit={handleLogin}
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="john@example.com"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              disabled={isLoading}
                              className="transition-all duration-200 focus:scale-[1.02]"
                            />
                          </motion.div>

                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                disabled={isLoading}
                                className="transition-all duration-200 focus:scale-[1.02] pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <motion.div
                                  initial={false}
                                  animate={{ rotate: showPassword ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </motion.div>
                              </Button>
                            </div>
                          </motion.div>

                          {errors.general && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-500"
                            >
                              {errors.general}
                            </motion.p>
                          )}

                          <motion.div variants={fieldVariants}>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center"
                                >
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Signing in...
                                </motion.div>
                              ) : (
                                <motion.span
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  Sign In
                                </motion.span>
                              )}
                            </Button>
                          </motion.div>
                        </motion.form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Register Tab Content */}
            <TabsContent value="register" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "register" && (
                  <motion.div
                    key="register-form"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-4">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <CardTitle className="text-lg">Create Account</CardTitle>
                          <CardDescription>Create a new account to start listening.</CardDescription>
                        </motion.div>
                      </CardHeader>
                      <CardContent>
                        <motion.form
                          onSubmit={handleRegister}
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="register-name">Full Name</Label>
                            <Input
                              id="register-name"
                              type="text"
                              placeholder="John Doe"
                              value={registerForm.name}
                              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                              disabled={isLoading}
                              className="transition-all duration-200 focus:scale-[1.02]"
                            />
                          </motion.div>

                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="register-email">Email</Label>
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="john@example.com"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                              disabled={isLoading}
                              className="transition-all duration-200 focus:scale-[1.02]"
                            />
                          </motion.div>

                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="register-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                disabled={isLoading}
                                className="transition-all duration-200 focus:scale-[1.02] pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <motion.div
                                  initial={false}
                                  animate={{ rotate: showPassword ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </motion.div>
                              </Button>
                            </div>
                            {errors.password && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                              >
                                {errors.password}
                              </motion.p>
                            )}
                          </motion.div>

                          <motion.div variants={fieldVariants} className="space-y-2">
                            <Label htmlFor="register-confirm-password">Confirm Password</Label>
                            <Input
                              id="register-confirm-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                              disabled={isLoading}
                              className="transition-all duration-200 focus:scale-[1.02]"
                            />
                            {errors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500"
                              >
                                {errors.confirmPassword}
                              </motion.p>
                            )}
                          </motion.div>

                          {errors.general && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-500"
                            >
                              {errors.general}
                            </motion.p>
                          )}

                          <motion.div variants={fieldVariants}>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center"
                                >
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                                </motion.div>
                              ) : (
                                <motion.span
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  Create Account
                                </motion.span>
                              )}
                            </Button>
                          </motion.div>
                        </motion.form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

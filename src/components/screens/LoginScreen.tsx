'use client'

import { useAppStore } from '@/lib/store'
import { BookOpen, Eye, EyeOff, Loader2, GraduationCap, Library } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

export default function LoginScreen() {
  const { setUser, setCurrentScreen, resetOnboarding } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Login Failed', description: data.error || 'Invalid credentials', variant: 'destructive' })
        return
      }
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        universityId: data.universityId,
        role: data.role,
        program: data.program || '',
        department: data.department || '',
        yearLevel: data.yearLevel || '',
        avatarInitials: data.avatarInitials,
        streakCount: data.streakCount || 0,
        isOnboarded: data.isOnboarded,
        notificationDueDate: data.notificationDueDate,
        notificationReservation: data.notificationReservation,
        notificationAnnouncements: data.notificationAnnouncements,
      })
      setCurrentScreen('home')
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    resetOnboarding()
    setCurrentScreen('onboarding')
  }

  const handleDemoLogin = () => {
    setEmail('juan@university.edu')
    setPassword('password123')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with decorative elements */}
      <div className="relative bg-purple-gradient px-6 pt-14 pb-20 rounded-b-[2rem] overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-white/5" />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg shadow-black/10 ring-1 ring-white/20"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            LibLog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm mt-1 flex items-center gap-1.5"
          >
            <Library className="w-3.5 h-3.5" />
            Digital Library Logbook System
          </motion.p>
        </motion.div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-6 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-black/5"
        >
          <h2 className="text-lg font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-xs text-muted-foreground mb-5">Sign in to your library account</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loginPassword" className="text-sm font-medium">Password</Label>
                <button className="text-xs text-lib-purple font-medium hover:text-lib-purple-dark transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full h-12 rounded-xl bg-lib-purple hover:bg-lib-purple-dark text-white font-semibold text-base disabled:opacity-50 shadow-lg shadow-lib-purple/20 active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </Button>
          </div>

          {/* Demo login */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-muted-foreground">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl border-2 border-dashed border-lib-purple-200 bg-lib-purple-50/50 text-lib-purple text-sm font-medium hover:bg-lib-purple-50 hover:border-lib-purple-300 active:bg-lib-purple-100 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Use Demo Account
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={handleRegister}
              className="text-lib-purple font-semibold hover:text-lib-purple-dark transition-colors"
            >
              Register
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground/60">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

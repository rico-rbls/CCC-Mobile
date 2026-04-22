'use client'

import { useAppStore } from '@/lib/store'
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react'
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
      {/* Header */}
      <div className="bg-purple-gradient px-6 pt-12 pb-16 rounded-b-[2rem]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LibLog</h1>
          <p className="text-white/70 text-sm mt-1">Digital Library Logbook</p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Sign In</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail" className="text-sm font-medium">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loginPassword" className="text-sm font-medium">Password</Label>
                <button className="text-xs text-lib-purple font-medium">Forgot password?</button>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full h-12 rounded-xl bg-lib-purple hover:bg-lib-purple-dark text-white font-semibold text-base disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </Button>
          </div>

          {/* Demo login */}
          <button
            onClick={handleDemoLogin}
            className="w-full mt-3 py-2 rounded-xl border border-lib-purple-200 bg-lib-purple-50 text-lib-purple text-sm font-medium hover:bg-lib-purple-100 transition-colors"
          >
            Use Demo Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={handleRegister}
              className="text-lib-purple font-semibold"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

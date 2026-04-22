'use client'

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Briefcase, User, ArrowLeft, ArrowRight, Eye, EyeOff, Check, BookOpen, Bell, Calendar, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

const roleCards = [
  { id: 'student' as const, icon: GraduationCap, label: 'Student', desc: 'Currently enrolled' },
  { id: 'faculty' as const, icon: Briefcase, label: 'Faculty', desc: 'Teaching staff' },
  { id: 'visitor' as const, icon: User, label: 'Visitor', desc: 'Guest access' },
]

const programs = [
  'Computer Science', 'Nursing', 'Business Administration', 'Education',
  'Engineering', 'Arts & Sciences', 'Psychology', 'Mathematics', 'Biology', 'English'
]

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']

const departments = [
  'Computer Science', 'Nursing', 'Business', 'Education',
  'Engineering', 'Arts & Sciences', 'Psychology', 'Mathematics'
]

export default function OnboardingScreen() {
  const {
    onboardingStep, setOnboardingStep,
    onboardingData, setOnboardingData,
    setUser, setCurrentScreen
  } = useAppStore()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const totalSteps = 5
  const step = onboardingStep

  const canContinue = () => {
    switch (step) {
      case 0: return onboardingData.role !== ''
      case 1: return onboardingData.fullName.trim() !== '' && onboardingData.universityId.trim() !== ''
      case 2: return onboardingData.role === 'faculty'
        ? onboardingData.department !== ''
        : onboardingData.program !== '' && onboardingData.yearLevel !== ''
      case 3: return onboardingData.email.trim() !== '' && onboardingData.password.length >= 6 && confirmPassword === onboardingData.password
      case 4: return true
      default: return false
    }
  }

  const handleContinue = async () => {
    if (step < totalSteps - 1) {
      setOnboardingStep(step + 1)
    } else {
      // Complete onboarding - register via API
      setIsSubmitting(true)
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: onboardingData.fullName,
            email: onboardingData.email,
            password: onboardingData.password,
            universityId: onboardingData.universityId,
            role: onboardingData.role,
            program: onboardingData.program,
            department: onboardingData.department,
            yearLevel: onboardingData.yearLevel,
            notificationDueDate: onboardingData.notificationDueDate,
            notificationReservation: onboardingData.notificationReservation,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          toast({ title: 'Registration Failed', description: data.error || 'Please try again', variant: 'destructive' })
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
          isOnboarded: true,
          notificationDueDate: data.notificationDueDate,
          notificationReservation: data.notificationReservation,
          notificationAnnouncements: data.notificationAnnouncements,
        })
        setCurrentScreen('home')
      } catch {
        toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 0) setOnboardingStep(step - 1)
  }

  const getPasswordStrength = () => {
    const p = onboardingData.password
    if (p.length === 0) return { level: 0, label: '', color: '' }
    if (p.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-400' }
    if (p.length < 8) return { level: 2, label: 'Fair', color: 'bg-yellow-400' }
    const hasUpper = /[A-Z]/.test(p)
    const hasNum = /[0-9]/.test(p)
    const hasSpecial = /[^A-Za-z0-9]/.test(p)
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length
    if (score >= 2) return { level: 4, label: 'Strong', color: 'bg-green-500' }
    return { level: 3, label: 'Good', color: 'bg-blue-400' }
  }

  const strength = getPasswordStrength()

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Progress bar with gradient background */}
      <div className="bg-lib-purple-50/50 px-6 pt-5 pb-4">
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < step ? 'bg-lib-purple' : i === step ? 'bg-lib-purple shadow-sm shadow-lib-purple/30' : 'bg-lib-purple-200'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-lib-purple-100 active:bg-lib-purple-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-lib-purple" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'bg-lib-purple scale-125' : i < step ? 'bg-lib-purple-400' : 'bg-lib-purple-200'
                }`}
              />
            ))}
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 px-6 py-4 overflow-y-auto"
          >
            {step === 0 && (
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-3xl bg-purple-gradient flex items-center justify-center mb-5 shadow-lg shadow-lib-purple/25"
                >
                  <BookOpen className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Welcome to LibLog</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-[260px]">
                  Choose your role to get started with the digital library
                </p>
                <div className="w-full space-y-3">
                  {roleCards.map((r, idx) => {
                    const selected = onboardingData.role === r.id
                    const Icon = r.icon
                    return (
                      <motion.button
                        key={r.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setOnboardingData({ role: r.id })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          selected
                            ? 'border-lib-purple bg-lib-purple-50 shadow-md shadow-lib-purple/10'
                            : 'border-gray-200 bg-white hover:border-lib-purple-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selected ? 'bg-lib-purple' : 'bg-lib-purple-50'
                        }`}>
                          <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-lib-purple'}`} />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.desc}</div>
                        </div>
                        {selected && (
                          <Check className="w-5 h-5 text-lib-purple ml-auto" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col">
                <div className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center mb-4 self-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">Personal Information</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Tell us about yourself
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={onboardingData.fullName}
                      onChange={(e) => setOnboardingData({ fullName: e.target.value })}
                      className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="univId" className="text-sm font-medium">University ID</Label>
                    <Input
                      id="univId"
                      placeholder="e.g. 2024-00001"
                      value={onboardingData.universityId}
                      onChange={(e) => setOnboardingData({ universityId: e.target.value })}
                      className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <div className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center mb-4 self-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">Academic Information</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  {onboardingData.role === 'faculty' ? 'Your department details' : 'Your program and year'}
                </p>
                <div className="space-y-4">
                  {onboardingData.role !== 'faculty' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Program / Department</Label>
                      <select
                        value={onboardingData.program}
                        onChange={(e) => setOnboardingData({ program: e.target.value })}
                        className="w-full h-12 rounded-xl border border-gray-200 px-3 text-sm bg-white focus:border-lib-purple focus:ring-lib-purple/20 focus:outline-none"
                      >
                        <option value="">Select program</option>
                        {programs.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  )}
                  {onboardingData.role === 'faculty' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Department</Label>
                      <select
                        value={onboardingData.department}
                        onChange={(e) => setOnboardingData({ department: e.target.value })}
                        className="w-full h-12 rounded-xl border border-gray-200 px-3 text-sm bg-white focus:border-lib-purple focus:ring-lib-purple/20 focus:outline-none"
                      >
                        <option value="">Select department</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  )}
                  {onboardingData.role === 'student' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Year Level</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {yearLevels.map(y => (
                          <button
                            key={y}
                            onClick={() => setOnboardingData({ yearLevel: y })}
                            className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                              onboardingData.yearLevel === y
                                ? 'border-lib-purple bg-lib-purple-50 text-lib-purple'
                                : 'border-gray-200 text-gray-500 hover:border-lib-purple-200'
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {onboardingData.role === 'visitor' && (
                    <div className="bg-lib-purple-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-lib-purple">As a visitor, you can browse the catalog and use the QR check-in feature.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col">
                <div className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center mb-4 self-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">Account Setup</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Create your login credentials
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">University Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={onboardingData.email}
                      onChange={(e) => setOnboardingData({ email: e.target.value })}
                      className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        value={onboardingData.password}
                        onChange={(e) => setOnboardingData({ password: e.target.value })}
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
                    {onboardingData.password.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i <= strength.level ? strength.color : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{strength.label}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && confirmPassword !== onboardingData.password && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                    {confirmPassword.length > 0 && confirmPassword === onboardingData.password && (
                      <p className="text-xs text-green-600">Passwords match</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col">
                <div className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center mb-4 self-center">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Choose what notifications you&apos;d like to receive
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-lib-purple" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Due Date Reminders</div>
                        <div className="text-xs text-muted-foreground">Get reminded before books are due</div>
                      </div>
                    </div>
                    <Switch
                      checked={onboardingData.notificationDueDate}
                      onCheckedChange={(v) => setOnboardingData({ notificationDueDate: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-lib-purple" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Reservation Alerts</div>
                        <div className="text-xs text-muted-foreground">Know when reserved books are available</div>
                      </div>
                    </div>
                    <Switch
                      checked={onboardingData.notificationReservation}
                      onCheckedChange={(v) => setOnboardingData({ notificationReservation: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-lib-purple" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">System Announcements</div>
                        <div className="text-xs text-muted-foreground">Updates and news from the library</div>
                      </div>
                    </div>
                    <Switch
                      checked={false}
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="px-6 pb-6 pt-4">
        <Button
          onClick={handleContinue}
          disabled={!canContinue() || isSubmitting}
          className="w-full h-12 rounded-xl bg-lib-purple hover:bg-lib-purple-dark text-white font-semibold text-base disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : step === totalSteps - 1 ? (
            'Get Started'
          ) : (
            <span className="flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

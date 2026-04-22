'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Lock,
  Mail,
  Bell,
  Palette,
  Info,
  LogOut,
  Moon,
  Sun,
  Clock,
  User,
  Shield,
  FileText,
  BookOpen,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'

interface LibrarySettings {
  isOpen: boolean
  openingTime: string
  closingTime: string
  maxBorrowStudent: number
  maxBorrowFaculty: number
  maxBorrowVisitor: number
}

export default function SettingsScreen() {
  const { user, setCurrentScreen, goBack, logout } = useAppStore()
  const [dueDateNotif, setDueDateNotif] = useState(user?.notificationDueDate ?? true)
  const [reservationNotif, setReservationNotif] = useState(user?.notificationReservation ?? true)
  const [announcementNotif, setAnnouncementNotif] = useState(user?.notificationAnnouncements ?? false)
  const { theme, setTheme } = useTheme()
  const [librarySettings, setLibrarySettings] = useState<LibrarySettings | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setLibrarySettings(data)
        }
      } catch {
        // silently fail
      }
    }
    fetchSettings()
  }, [])

  const handleToggle = async (
    field: 'notificationDueDate' | 'notificationReservation' | 'notificationAnnouncements',
    value: boolean
  ) => {
    if (field === 'notificationDueDate') setDueDateNotif(value)
    if (field === 'notificationReservation') setReservationNotif(value)
    if (field === 'notificationAnnouncements') setAnnouncementNotif(value)

    try {
      await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, [field]: value }),
      })
      toast({ title: 'Preference updated' })
    } catch {
      toast({ title: 'Failed to update preference', variant: 'destructive' })
    }
  }

  const handleLogout = () => {
    logout()
    setCurrentScreen('login')
    toast({ title: 'Logged out successfully' })
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-lib-purple-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-bold text-foreground text-lg">Settings</h2>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-5">
        {/* Account section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h3 className="text-xs font-semibold text-lib-purple uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Account
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* User info display */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-lib-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.avatarInitials || user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground block truncate">{user?.fullName ?? 'Unknown User'}</span>
                <p className="text-xs text-muted-foreground truncate">{user?.email ?? 'No email set'}</p>
              </div>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-foreground">Change Password</span>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <span className="text-xs text-muted-foreground">••••</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Email</span>
                <p className="text-xs text-muted-foreground">{user?.email ?? 'No email set'}</p>
              </div>
              <span className="text-xs text-lib-purple font-medium">Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Notifications section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs font-semibold text-lib-purple uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-lib-purple" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Due Date Reminders</span>
                  <p className="text-xs text-muted-foreground">Get reminded before books are due</p>
                </div>
              </div>
              <Switch
                checked={dueDateNotif}
                onCheckedChange={(v) => handleToggle('notificationDueDate', v)}
                className="data-[state=checked]:bg-lib-purple"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-lib-purple" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Reservation Alerts</span>
                  <p className="text-xs text-muted-foreground">When reserved books are available</p>
                </div>
              </div>
              <Switch
                checked={reservationNotif}
                onCheckedChange={(v) => handleToggle('notificationReservation', v)}
                className="data-[state=checked]:bg-lib-purple"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-lib-purple" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">System Announcements</span>
                  <p className="text-xs text-muted-foreground">Updates and news from the library</p>
                </div>
              </div>
              <Switch
                checked={announcementNotif}
                onCheckedChange={(v) => handleToggle('notificationAnnouncements', v)}
                className="data-[state=checked]:bg-lib-purple"
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-xs font-semibold text-lib-purple uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            Appearance
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-lib-purple" /> : <Sun className="w-4 h-4 text-lib-purple" />}
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Dark Mode</span>
                  <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-lib-purple"
              />
            </div>
          </div>
        </motion.div>

        {/* Library section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs font-semibold text-lib-purple uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Library
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Library Hours</span>
                <p className="text-xs text-muted-foreground">
                  {librarySettings
                    ? `${formatTime(librarySettings.openingTime)} – ${formatTime(librarySettings.closingTime)}`
                    : 'Loading...'}
                </p>
              </div>
              <span className={`text-xs font-medium ${librarySettings?.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                {librarySettings?.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('attendance')}
              className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-foreground">Attendance History</span>
                <p className="text-xs text-muted-foreground">View your library visit records</p>
              </div>
              <span className="text-muted-foreground text-sm">→</span>
            </button>
          </div>
        </motion.div>

        {/* About section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-xs font-semibold text-lib-purple uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            About
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Info className="w-4 h-4 text-lib-purple" />
                </div>
                <span className="text-sm font-medium text-foreground">App Version</span>
              </div>
              <span className="text-xs text-muted-foreground">1.0.0</span>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-lib-purple" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Privacy Policy</span>
              <span className="text-muted-foreground text-sm">→</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-lib-purple" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Terms of Service</span>
              <span className="text-muted-foreground text-sm">→</span>
            </button>
          </div>
        </motion.div>

        {/* Log Out button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl py-6 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </motion.div>

        <div className="h-6" />
      </div>
    </div>
  )
}

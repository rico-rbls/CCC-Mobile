'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Mail, Bell, Palette, Info, LogOut, Moon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export default function SettingsScreen() {
  const { user, setCurrentScreen, goBack } = useAppStore()
  const [dueDateNotif, setDueDateNotif] = useState(user?.notificationDueDate ?? true)
  const [reservationNotif, setReservationNotif] = useState(user?.notificationReservation ?? true)
  const [announcementNotif, setAnnouncementNotif] = useState(user?.notificationAnnouncements ?? false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-lib-purple-50">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-bold text-foreground text-lg">Settings</h2>
      </div>

      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
        {/* Account section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Account</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button className="flex items-center gap-3 w-full px-4 py-3.5 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-foreground">Change Password</span>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-lib-purple" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-foreground">Email</span>
                <p className="text-xs text-muted-foreground">{user?.email ?? 'No email set'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Notifications</h3>
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
              <Switch checked={dueDateNotif} onCheckedChange={setDueDateNotif} />
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
              <Switch checked={reservationNotif} onCheckedChange={setReservationNotif} />
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
              <Switch checked={announcementNotif} onCheckedChange={setAnnouncementNotif} />
            </div>
          </div>
        </div>

        {/* Appearance section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Appearance</h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-lib-purple" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Dark Mode</span>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
              <Switch checked={false} disabled />
            </div>
          </div>
        </div>

        {/* About section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">About</h3>
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
            <button className="flex items-center gap-3 w-full px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                <Info className="w-4 h-4 text-lib-purple" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Privacy Policy</span>
            </button>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

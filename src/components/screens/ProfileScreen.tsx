'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  User, BookOpen, Flame, Calendar,
  ChevronRight, Edit, Bell, Shield, HelpCircle, Info, LogOut
} from 'lucide-react'

const menuItems = [
  { id: 'settings', icon: Edit, label: 'Edit Profile', color: 'text-lib-purple' },
  { id: 'notifications', icon: Bell, label: 'Notification Preferences', color: 'text-lib-purple' },
  { id: 'settings', icon: Shield, label: 'Privacy Policy', color: 'text-lib-purple' },
  { id: 'settings', icon: HelpCircle, label: 'Help & Support', color: 'text-lib-purple' },
  { id: 'settings', icon: Info, label: 'About', color: 'text-lib-purple' },
]

export default function ProfileScreen() {
  const { user, setCurrentScreen, logout } = useAppStore()

  const stats = [
    { icon: BookOpen, label: 'Books Borrowed', value: '12' },
    { icon: Calendar, label: 'Attendance', value: '28' },
    { icon: Flame, label: 'Streak', value: String(user?.streakCount ?? 0) },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Profile header */}
      <div className="bg-purple-gradient px-6 pt-8 pb-12 rounded-b-[2rem]">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3 border-3 border-white/30"
          >
            <span className="text-2xl font-bold text-white">{user?.avatarInitials ?? 'U'}</span>
          </motion.div>
          <h2 className="text-xl font-bold text-white">{user?.fullName ?? 'User'}</h2>
          <p className="text-white/70 text-sm mt-0.5">
            {[user?.program, user?.yearLevel, user?.role].filter(Boolean).map(s => s?.charAt(0).toUpperCase() + s?.slice(1)).join(' · ')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-3 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-lib-purple" />
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground text-center">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => setCurrentScreen(item.id as 'settings' | 'notifications')}
                className={`flex items-center gap-3 w-full px-4 py-3.5 hover:bg-lib-purple-50/50 transition-colors ${
                  index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>

        <div className="h-4" />
      </div>
    </div>
  )
}

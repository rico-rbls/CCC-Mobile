'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  User, BookOpen, Flame, Calendar, Clock,
  ChevronRight, Edit, Bell, Shield, HelpCircle, Info, LogOut, MapPin
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

const menuItems = [
  { id: 'settings', icon: Edit, label: 'Edit Profile', color: 'text-lib-purple' },
  { id: 'settings', icon: Bell, label: 'Notification Preferences', desc: 'Due dates, reservations', color: 'text-lib-purple' },
  { id: 'settings', icon: Shield, label: 'Privacy Policy', color: 'text-lib-purple' },
  { id: 'settings', icon: HelpCircle, label: 'Help & Support', color: 'text-lib-purple' },
  { id: 'settings', icon: Info, label: 'About', desc: 'v1.0.0', color: 'text-lib-purple' },
]

export default function ProfileScreen() {
  const { user, setCurrentScreen, logout } = useAppStore()
  const [borrowCount, setBorrowCount] = useState(0)
  const [attendanceCount, setAttendanceCount] = useState(0)
  const userIdRef = useRef(user?.id)

  useEffect(() => {
    const uid = user?.id
    if (!uid) return
    userIdRef.current = uid

    let cancelled = false
    const fetchStats = async () => {
      try {
        const [activeRes, historyRes, attendanceRes] = await Promise.all([
          fetch(`/api/borrow?userId=${uid}&status=active`),
          fetch(`/api/borrow?userId=${uid}&status=returned`),
          fetch(`/api/attendance?userId=${uid}`),
        ])
        if (cancelled) return
        const activeData = await activeRes.json()
        const historyData = await historyRes.json()
        const attendanceData = await attendanceRes.json()
        const activeCount = activeData.records?.length || 0
        const historyCount = historyData.records?.length || 0
        setBorrowCount(activeCount + historyCount)
        setAttendanceCount(attendanceData.records?.length || 0)
      } catch {
        // silently fail
      }
    }
    fetchStats()
    return () => { cancelled = true }
  }, [user?.id])

  const stats = [
    { icon: BookOpen, label: 'Borrowed', value: String(borrowCount), color: 'text-lib-purple', bg: 'bg-lib-purple-50' },
    { icon: MapPin, label: 'Visits', value: String(attendanceCount), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Flame, label: 'Streak', value: String(user?.streakCount ?? 0), color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  const roleLabel = user?.role === 'faculty' ? 'Faculty' : user?.role === 'visitor' ? 'Visitor' : 'Student'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Profile header with gradient */}
      <div className="relative bg-purple-gradient px-6 pt-10 pb-16 rounded-b-[2rem] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
        
        <div className="flex flex-col items-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 ring-4 ring-white/20"
          >
            <span className="text-2xl font-bold text-white">{user?.avatarInitials ?? 'U'}</span>
          </motion.div>
          <h2 className="text-xl font-bold text-white">{user?.fullName ?? 'User'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-[10px] font-medium">
              {roleLabel}
            </span>
            <p className="text-white/70 text-xs">
              {[user?.program, user?.yearLevel].filter(Boolean).map(s => s?.charAt(0).toUpperCase() + s?.slice(1)).join(' · ')}
            </p>
          </div>
          <p className="text-white/50 text-[10px] mt-1 font-mono">ID: {user?.universityId}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground text-center font-medium">{stat.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Quick info card */}
      <div className="px-4 mt-3">
        <div className="bg-lib-purple-50 rounded-xl p-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-lib-purple flex-shrink-0" />
          <p className="text-xs text-lib-purple-700">
            Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCurrentScreen('settings')}
                className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-lib-purple-50/30 active:bg-lib-purple-50/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-lib-purple-50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-foreground block">{item.label}</span>
                  {item.desc && <span className="text-[10px] text-muted-foreground">{item.desc}</span>}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </motion.button>
            )
          })}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>

        <div className="h-4" />
      </div>
    </div>
  )
}

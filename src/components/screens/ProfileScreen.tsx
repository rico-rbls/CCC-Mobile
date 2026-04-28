'use client'

import { useAppStore, type AppScreen } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  BookOpen, Flame, Clock,
  ChevronRight, Edit, LogOut, MapPin, Heart, Mail, GraduationCap, FileText
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

// Menu items - only Edit Profile, Favorites, Reservations (removed items now in Settings)
function getMenuItems(favCount: number) {
  return [
    { id: 'edit-profile' as AppScreen, icon: Edit, label: 'Edit Profile', desc: 'Update your information', color: 'text-lib-purple', bg: 'bg-lib-purple-50 dark:bg-white/10' },
    { id: 'favorites', icon: Heart, label: 'My Favorites', desc: `${favCount} saved book${favCount !== 1 ? 's' : ''}`, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'reservations', icon: BookOpen, label: 'My Reservations', desc: 'Track reserved items', color: 'text-lib-purple', bg: 'bg-lib-purple-50 dark:bg-white/10' },
  ]
}

// Monthly reading data for bar chart
const monthlyData = [
  { month: 'Sep', books: 2 },
  { month: 'Oct', books: 4 },
  { month: 'Nov', books: 3 },
  { month: 'Dec', books: 1 },
  { month: 'Jan', books: 5 },
  { month: 'Feb', books: 3 },
  { month: 'Mar', books: 4 },
]

interface LibrarySettings {
  isOpen: boolean
  openingTime: string
  closingTime: string
}

export default function ProfileScreen() {
  const { user, setCurrentScreen, logout, favorites } = useAppStore()
  const [borrowCount, setBorrowCount] = useState(0)
  const [attendanceCount, setAttendanceCount] = useState(0)
  const [readingGoal, setReadingGoal] = useState(24)
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [librarySettings, setLibrarySettings] = useState<LibrarySettings | null>(null)
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
        const activeRecords = Array.isArray(activeData) ? activeData : (activeData.records || [])
        const historyRecords = Array.isArray(historyData) ? historyData : (historyData.records || [])
        const attendanceRecords = Array.isArray(attendanceData) ? attendanceData : (attendanceData.records || [])
        setBorrowCount(activeRecords.length + historyRecords.length)
        setAttendanceCount(attendanceRecords.length)
      } catch {
        // silently fail
      }
    }
    fetchStats()
    return () => { cancelled = true }
  }, [user?.id])

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

  const stats = [
    { icon: BookOpen, label: 'Borrowed', value: String(borrowCount), color: 'text-lib-purple', bg: 'bg-lib-purple-50 dark:bg-white/10' },
    { icon: MapPin, label: 'Visits', value: String(attendanceCount), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: Flame, label: 'Streak', value: String(user?.streakCount ?? 0), color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ]

  const roleLabel = user?.role === 'faculty' ? 'Faculty' : user?.role === 'visitor' ? 'Visitor' : 'Student'
  const maxBooks = Math.max(...monthlyData.map(d => d.books), 1)

  const formatTime = (time: string) => {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Profile header with gradient */}
      <div className="relative bg-purple-gradient px-6 pt-10 pb-12 rounded-b-[22px] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-12 right-20 w-16 h-16 rounded-full bg-white/5" />
        
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
          {/* Email below name */}
          {user?.email && (
            <div className="flex items-center gap-1.5 mt-1">
              <Mail className="w-3 h-3 text-white/50" />
              <p className="text-white/60 text-xs">{user.email}</p>
            </div>
          )}
          {/* Role badge and program info */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white/90 text-[10px] font-medium">
              {roleLabel}
            </span>
            {user?.program && (
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-white/50" />
                <span className="text-white/60 text-[10px]">
                  {user.program}{user.yearLevel ? ` · ${user.yearLevel}` : ''}
                </span>
              </div>
            )}
          </div>
          <p className="text-white/40 text-[10px] mt-1 font-mono">ID: {user?.universityId}</p>
        </div>
      </div>

      {/* Stats cards - overlapping header */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-card rounded-[22px] shadow-sm p-4 grid grid-cols-3 gap-3">
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
                <div className={`w-10 h-10 rounded-[14px] ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground text-center font-medium">{stat.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Reading Goal card */}
      <div className="px-4 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-card rounded-[22px] shadow-sm p-4"
        >
          <div className="flex items-center gap-4">
            {/* Circular progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E8D5F3"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#652D90"
                  strokeWidth="3"
                  strokeDasharray={`${Math.min(100, (borrowCount / readingGoal) * 100)}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-lib-purple">{borrowCount}/{readingGoal}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Reading Goal</h4>
                <button
                  onClick={() => setShowGoalPicker(!showGoalPicker)}
                  className="text-xs text-lib-purple font-medium"
                >
                  {showGoalPicker ? 'Done' : 'Change'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {borrowCount >= readingGoal
                  ? '\uD83C\uDF89 Goal achieved! Great job!'
                  : `${readingGoal - borrowCount} more book${readingGoal - borrowCount !== 1 ? 's' : ''} to reach your goal`
                }
              </p>
              {showGoalPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-2 mt-2"
                >
                  {[12, 24, 36, 48].map(goal => (
                    <button
                      key={goal}
                      onClick={() => { setReadingGoal(goal); setShowGoalPicker(false) }}
                      className={`flex-1 py-1.5 rounded-[14px] text-xs font-medium transition-all ${
                        readingGoal === goal
                          ? 'bg-lib-purple text-white'
                          : 'bg-lib-purple-50 dark:bg-white/10 text-lib-purple dark:text-lib-purple-300 hover:bg-lib-purple-100 dark:hover:bg-white/15'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reading Stats card with mini bar chart */}
      <div className="px-4 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-[22px] shadow-sm p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Reading Stats</span>
            <span className="text-[10px] text-muted-foreground">Books per month</span>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-2 h-20">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.books / maxBooks) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                  className={`w-full rounded-t-md min-h-[4px] ${
                    i === monthlyData.length - 1 ? 'bg-lib-purple' : 'bg-lib-purple-200 dark:bg-white/20'
                  }`}
                />
                <span className={`text-[9px] ${i === monthlyData.length - 1 ? 'text-lib-purple font-bold' : 'text-muted-foreground'}`}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-white/5">
            <span className="text-[10px] text-muted-foreground">
              Total: {monthlyData.reduce((sum, d) => sum + d.books, 0)} books this year
            </span>
            <span className="text-[10px] font-medium text-lib-purple">
              Avg: {(monthlyData.reduce((sum, d) => sum + d.books, 0) / monthlyData.length).toFixed(1)}/mo
            </span>
          </div>
        </motion.div>
      </div>

      {/* Library section (moved from Settings) */}
      <div className="px-4 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-card rounded-[22px] shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <div className="w-9 h-9 rounded-[14px] bg-lib-purple-50 dark:bg-white/10 flex items-center justify-center">
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
            <span className={`text-xs font-medium ${librarySettings?.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {librarySettings?.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('attendance')}
            className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-lib-purple-50/50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-[14px] bg-lib-purple-50 dark:bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-lib-purple" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-medium text-foreground">Attendance History</span>
              <p className="text-xs text-muted-foreground">View your library visit records</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      </div>

      {/* Favorite Books section */}
      <div className="px-4 mt-3">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setCurrentScreen('favorites')}
          className="w-full bg-card rounded-[22px] shadow-sm p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-[14px] bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-semibold text-foreground">Favorite Books</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {favorites.length} book{favorites.length !== 1 ? 's' : ''} saved to your collection
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Quick info card */}
      <div className="px-4 mt-3">
        <div className="bg-lib-purple-50 dark:bg-white/5 rounded-[22px] p-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-lib-purple flex-shrink-0" />
          <p className="text-xs text-lib-purple-700 dark:text-lib-purple-300">
            Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Menu - only Edit Profile, Favorites, Reservations */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <div className="bg-card rounded-[22px] shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
          {getMenuItems(favorites.length).map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCurrentScreen(item.id as AppScreen)}
                className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-lib-purple-50/30 dark:hover:bg-white/5 active:bg-lib-purple-50/50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-[14px] ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-foreground block">{item.label}</span>
                  {item.desc && <span className="text-[10px] text-muted-foreground">{item.desc}</span>}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-[22px] border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 active:bg-red-200 dark:active:bg-red-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>

        <div className="h-4" />
      </div>
    </div>
  )
}

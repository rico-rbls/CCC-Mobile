'use client'

import { useAppStore, type AppScreen } from '@/lib/store'
import { Home, Search, ScanLine, BookOpen, User } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const navItems: { id: AppScreen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'qr-scan', icon: ScanLine, label: 'Scan' },
  { id: 'borrowed', icon: BookOpen, label: 'Borrowed' },
  { id: 'profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, user } = useAppStore()
  const [activeBorrows, setActiveBorrows] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/borrow?userId=${user.id}&status=active`)
        if (res.ok) {
          const data = await res.json()
          const records = Array.isArray(data) ? data : (data.records || [])
          setActiveBorrows(records.length)
        }
      } catch {
        // silently fail
      }
    }
    fetchCount()
  }, [user?.id, currentScreen])

  const handleNavClick = useCallback((screenId: AppScreen) => {
    setCurrentScreen(screenId)
  }, [setCurrentScreen])

  return (
    <nav className="bg-background dark:bg-[#110a1e] border-t border-gray-100 dark:border-white/5 safe-bottom">
      <div className="flex items-center justify-around px-3 pt-2 pb-2 gap-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const Icon = item.icon
          const isCenter = item.id === 'qr-scan'

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center gap-1 min-w-[56px]"
                aria-label={item.label}
              >
                <div className="w-12 h-12 rounded-[16px] bg-lib-purple flex items-center justify-center shadow-lg shadow-lib-purple/30 relative">
                  <Icon className="w-6 h-6 text-white" />
                  {/* Badge for active borrows */}
                  {activeBorrows > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] text-white font-bold flex items-center justify-center">
                      {activeBorrows}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-lib-purple dark:text-lib-purple-300 font-semibold">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center gap-1 min-w-[56px]"
              aria-label={item.label}
            >
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors duration-200 relative ${
                isActive
                  ? 'bg-lib-purple-50 dark:bg-lib-purple/20'
                  : 'bg-transparent'
              }`}>
                <Icon className={`w-5 h-5 transition-colors duration-200 ${
                  isActive ? 'text-lib-purple dark:text-lib-purple-300' : 'text-gray-400 dark:text-white/30'
                }`} />
                {/* Badge for active borrows */}
                {item.id === 'borrowed' && activeBorrows > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-lib-purple text-[8px] text-white font-bold flex items-center justify-center">
                    {activeBorrows}
                  </span>
                )}
              </div>
              <span className={`text-[9px] transition-colors duration-200 ${
                isActive ? 'text-lib-purple dark:text-lib-purple-300 font-semibold' : 'text-gray-400 dark:text-white/30'
              }`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

'use client'

import { useAppStore, type AppScreen } from '@/lib/store'
import { Home, Search, ScanLine, BookOpen, User } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const navItems: { id: AppScreen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
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

  const isScanActive = currentScreen === 'qr-scan'

  return (
    <nav className="safe-bottom">
      <div className="flex items-center justify-between px-4 pt-2 pb-3 bg-[#0f0a1e]">
        {/* 4 nav icons — each in its own floating rounded card */}
        <div className="flex-1 flex items-center justify-around gap-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center gap-1"
                aria-label={item.label}
              >
                <div className="relative w-11 h-11 rounded-2xl bg-white/[0.07] flex items-center justify-center transition-colors duration-200">
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/35'
                  }`} />
                  {/* Badge for active borrows */}
                  {item.id === 'borrowed' && activeBorrows > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 rounded-full bg-red-500 text-[7px] text-white font-bold flex items-center justify-center px-0.5">
                      {activeBorrows}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] transition-colors duration-200 leading-tight ${
                  isActive ? 'text-white font-semibold' : 'text-white/30'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Scan — same size floating card on the right */}
        <button
          onClick={() => handleNavClick('qr-scan')}
          className="flex flex-col items-center gap-1 ml-2"
          aria-label="Scan"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/[0.07] flex items-center justify-center transition-colors duration-200 relative">
            <ScanLine className={`w-5 h-5 transition-colors duration-200 ${
              isScanActive ? 'text-white' : 'text-white/35'
            }`} />
          </div>
          <span className={`text-[9px] transition-colors duration-200 leading-tight ${
            isScanActive ? 'text-white font-semibold' : 'text-white/30'
          }`}>
            Scan
          </span>
        </button>
      </div>
    </nav>
  )
}

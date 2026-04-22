'use client'

import { useAppStore, type AppScreen } from '@/lib/store'
import { Home, Search, ScanLine, BookOpen, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

const navItems: { id: AppScreen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'qr-scan', icon: ScanLine, label: 'Scan' },
  { id: 'borrowed', icon: BookOpen, label: 'Borrowed' },
  { id: 'profile', icon: User, label: 'Profile' },
]

// ── Ripple Effect Component ──────────────────────────────────────────
function RippleEffect() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute inset-0 rounded-full bg-white/30 pointer-events-none"
    />
  )
}

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, user } = useAppStore()
  const [activeBorrows, setActiveBorrows] = useState(0)
  const [rippleKey, setRippleKey] = useState(0)
  const [prevScreen, setPrevScreen] = useState<AppScreen>(currentScreen)

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
    setPrevScreen(currentScreen)
    setCurrentScreen(screenId)
    if (screenId === 'qr-scan') {
      setRippleKey(prev => prev + 1)
    }
  }, [currentScreen, setCurrentScreen])

  // Track screen changes for indicator bounce
  const screenChanged = prevScreen !== currentScreen

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 safe-bottom">
      <div className="flex items-end justify-around px-2 pt-2 pb-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const isCenter = item.id === 'qr-scan'
          const Icon = item.icon

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center -mt-6 relative z-10"
                aria-label={item.label}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="w-14 h-14 rounded-full bg-lib-purple flex items-center justify-center shadow-lg shadow-lib-purple/30 relative overflow-hidden"
                >
                  {/* Ripple effect on press */}
                  <AnimatePresence>
                    {rippleKey > 0 && <RippleEffect key={rippleKey} />}
                  </AnimatePresence>
                  <Icon className="w-6 h-6 text-white relative z-10" />
                </motion.div>
                <span className="text-[10px] mt-1 text-lib-purple dark:text-lib-purple-300 font-medium">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center gap-0.5 py-1 min-w-[48px] min-h-[44px] justify-center relative"
              aria-label={item.label}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 500, damping: 12, restDelta: 0.01 }}
                className="relative"
                style={{ transformOrigin: 'center center' }}
              >
                {/* Spring-back overshoot: scale from 0.85 → 1.05 → 1.0 on release */}
                <motion.div
                  animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  key={`${item.id}-${isActive}`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-lib-purple' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                </motion.div>
                {/* Badge for active borrows */}
                {item.id === 'borrowed' && activeBorrows > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-lib-purple text-[8px] text-white font-bold flex items-center justify-center animate-badge-pulse">
                    {activeBorrows}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-lib-purple font-semibold' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {/* Active indicator dot with bounce */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key={`indicator-${item.id}`}
                    layoutId="navIndicator"
                    className="w-1 h-1 rounded-full bg-lib-purple mt-0.5"
                    initial={{ scale: 0, y: -4 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -4 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                      mass: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

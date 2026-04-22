'use client'

import { useAppStore, type AppScreen } from '@/lib/store'
import { Home, Search, ScanLine, BookOpen, User } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems: { id: AppScreen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'qr-scan', icon: ScanLine, label: 'Scan' },
  { id: 'borrowed', icon: BookOpen, label: 'Borrowed' },
  { id: 'profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { currentScreen, setCurrentScreen } = useAppStore()

  return (
    <nav className="glass-effect border-t border-lib-purple-100 safe-bottom">
      <div className="flex items-end justify-around px-2 pt-2 pb-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const isCenter = item.id === 'qr-scan'
          const Icon = item.icon

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className="flex flex-col items-center -mt-6 relative"
                aria-label={item.label}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-lib-purple flex items-center justify-center shadow-lg shadow-lib-purple/30"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-[10px] mt-1 text-lib-purple font-medium">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className="flex flex-col items-center gap-0.5 py-1 min-w-[48px] min-h-[44px] justify-center"
              aria-label={item.label}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-lib-purple' : 'text-gray-400'
                  }`}
                />
              </motion.div>
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-lib-purple font-semibold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="w-1 h-1 rounded-full bg-lib-purple mt-0.5"
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

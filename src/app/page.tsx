'use client'

import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'

import OnboardingScreen from '@/components/screens/OnboardingScreen'
import LoginScreen from '@/components/screens/LoginScreen'
import HomeScreen from '@/components/screens/HomeScreen'
import SearchScreen from '@/components/screens/SearchScreen'
import QRScanScreen from '@/components/screens/QRScanScreen'
import BorrowedScreen from '@/components/screens/BorrowedScreen'
import ProfileScreen from '@/components/screens/ProfileScreen'
import SettingsScreen from '@/components/screens/SettingsScreen'
import NotificationsScreen from '@/components/screens/NotificationsScreen'
import BookDetailScreen from '@/components/screens/BookDetailScreen'
import AttendanceScreen from '@/components/screens/AttendanceScreen'
import FavoritesScreen from '@/components/screens/FavoritesScreen'
import ReservationsScreen from '@/components/screens/ReservationsScreen'
import EditProfileScreen from '@/components/screens/EditProfileScreen'
import BottomNav from '@/components/layout/BottomNav'

const screenComponents: Record<string, React.ComponentType> = {
  onboarding: OnboardingScreen,
  login: LoginScreen,
  home: HomeScreen,
  search: SearchScreen,
  'qr-scan': QRScanScreen,
  borrowed: BorrowedScreen,
  profile: ProfileScreen,
  settings: SettingsScreen,
  notifications: NotificationsScreen,
  'book-detail': BookDetailScreen,
  attendance: AttendanceScreen,
  favorites: FavoritesScreen,
  reservations: ReservationsScreen,
  'edit-profile': EditProfileScreen,
}

// Screens that should NOT show bottom nav
const noNavScreens = new Set(['onboarding', 'login', 'qr-scan'])

export default function Home() {
  const { currentScreen, isAuthenticated } = useAppStore()

  // If not authenticated, show onboarding or login
  // If on an auth screen, show that; otherwise default to home
  let displayScreen = currentScreen
  if (!isAuthenticated && !['onboarding', 'login'].includes(currentScreen)) {
    displayScreen = 'login'
  }

  const ScreenComponent = screenComponents[displayScreen] ?? HomeScreen
  const showNav = !noNavScreens.has(displayScreen) && isAuthenticated

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0d0618] flex justify-center">
      <div className="w-full max-w-[430px] h-dvh bg-white dark:bg-[#110a1e] relative shadow-xl">
        {/* Screen content - full scrollable area */}
        <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <ScreenComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation - transparent overlay, only card & scan are visible */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <div className="pointer-events-auto">
              <BottomNav />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

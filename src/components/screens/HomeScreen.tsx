'use client'

import { useAppStore, type BorrowedBook, type ResourceItem } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, Bell, Settings, QrCode, BookOpen, Bookmark,
  ChevronRight, Clock, TrendingUp, Loader2, Megaphone, X,
  CalendarDays, Star, Calendar, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState, useCallback, useRef } from 'react'
import { getResourceCover } from '@/lib/covers'

// ── Types ──────────────────────────────────────────────────────────
interface Announcement {
  id: string
  title: string
  message: string
  targetRoles: string
  isActive: boolean
  createdAt: string
}

interface TrendingItem {
  id: string
  rank: number
  title: string
  author: string
  borrows: number
  category: string
}

// ── Section header with purple accent bar and pattern ──────────────
function SectionHeader({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 section-header-pattern rounded-lg px-1 py-0.5">
      <div className="w-1 h-5 rounded-full bg-lib-purple" />
      {icon}
      <h3 className="font-bold text-foreground">{children}</h3>
    </div>
  )
}

// ── Shimmer / skeleton card ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-1.5 w-full" />
    </div>
  )
}

function SkeletonRecommendations() {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-32 space-y-2">
          <Skeleton className="w-32 h-44 rounded-xl" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      ))}
    </div>
  )
}

// ── Stagger animation variants ─────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
}

// ── Main component ─────────────────────────────────────────────────
export default function HomeScreen() {
  const { user, setCurrentScreen, setSelectedBookId, unreadCount } = useAppStore()

  // Data state
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [recommendations, setRecommendations] = useState<ResourceItem[]>([])
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<Set<string>>(new Set())
  const [libraryOpen, setLibraryOpen] = useState(true)
  const [closingTime, setClosingTime] = useState('9PM')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [highlightBook, setHighlightBook] = useState<ResourceItem | null>(null)

  // Announcement carousel
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pull-to-refresh
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartY = useRef(0)

  // ── Fetch all data ────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user?.id) return
    try {
      // Fetch borrowed books
      const borrowRes = await fetch(`/api/borrow?userId=${user.id}&status=active`)
      const borrowData = await borrowRes.json()
      const borrowRecords = Array.isArray(borrowData) ? borrowData : (borrowData.records || [])
      if (borrowRes.ok && borrowRecords.length > 0) {
        const books: BorrowedBook[] = borrowRecords.map((r: Record<string, unknown>) => {
          const dueDate = new Date(r.dueDate as string)
          const now = new Date()
          const diffMs = dueDate.getTime() - now.getTime()
          const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
          const borrowDate = new Date(r.borrowDate as string)
          const totalDays = Math.ceil((dueDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24))
          return {
            id: r.id as string,
            title: (r.resource as Record<string, unknown>)?.title as string || 'Unknown',
            author: (r.resource as Record<string, unknown>)?.author as string || 'Unknown',
            category: (r.resource as Record<string, unknown>)?.subject as string || '',
            coverImage: (r.resource as Record<string, unknown>)?.coverImage as string | null,
            borrowDate: new Date(r.borrowDate as string).toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            status: daysLeft < 0 ? 'overdue' : 'active',
            daysLeft,
            _totalDays: totalDays,
            _elapsed: totalDays - Math.max(0, daysLeft),
          }
        })
        setBorrowedBooks(books)
      }

      // Fetch program-based recommendations
      const program = user?.program || ''
      let programResources: ResourceItem[] = []
      if (program) {
        const progRes = await fetch(`/api/resources?subject=${encodeURIComponent(program)}&limit=6`)
        const progData = await progRes.json()
        if (progRes.ok && progData.resources) {
          programResources = progData.resources.map(mapResource)
        }
      }

      // Fetch general recommendations as fallback
      const genRes = await fetch('/api/resources?limit=6')
      const genData = await genRes.json()
      let generalResources: ResourceItem[] = []
      if (genRes.ok && genData.resources) {
        generalResources = genData.resources.map(mapResource)
      }

      // Merge: program-based first, then fill with general, deduplicate
      const seen = new Set(programResources.map(r => r.id))
      const merged = [...programResources, ...generalResources.filter(r => !seen.has(r.id))].slice(0, 6)
      setRecommendations(merged.length > 0 ? merged : generalResources)

      // Fetch trending from API - use resources and assign mock borrow counts
      const trendingRes = await fetch('/api/resources?limit=5')
      const trendingData = await trendingRes.json()
      if (trendingRes.ok && trendingData.resources) {
        const mockBorrowCounts = [142, 128, 97, 85, 76]
        const trendingItems: TrendingItem[] = trendingData.resources.map((r: Record<string, unknown>, i: number) => ({
          id: r.id as string,
          rank: i + 1,
          title: r.title as string,
          author: r.author as string,
          borrows: mockBorrowCounts[i] || Math.floor(Math.random() * 100) + 30,
          category: r.category as string,
        }))
        setTrending(trendingItems)
      }

      // Fetch highlight book (random pick for Today's Highlights)
      const highlightRes = await fetch('/api/resources?limit=7')
      const highlightData = await highlightRes.json()
      if (highlightRes.ok && highlightData.resources && highlightData.resources.length > 0) {
        const randomIdx = Math.floor(Math.random() * Math.min(highlightData.resources.length, 5))
        setHighlightBook(mapResource(highlightData.resources[randomIdx]))
      }

      // Fetch announcements
      const annRes = await fetch('/api/announcements')
      const annData = await annRes.json()
      if (annRes.ok && Array.isArray(annData)) {
        setAnnouncements(annData)
      }

      // Fetch library settings
      const settingsRes = await fetch('/api/settings')
      const settingsData = await settingsRes.json()
      if (settingsRes.ok) {
        setLibraryOpen(settingsData.isOpen)
        const ct = settingsData.closingTime || '21:00'
        const hour = parseInt(ct.split(':')[0])
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour > 12 ? hour - 12 : hour
        setClosingTime(`${displayHour}${ampm}`)
      }
    } catch (e) {
      console.error('Failed to fetch home data:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id, user?.program])

  // Helper to map resource from API
  function mapResource(r: Record<string, unknown>): ResourceItem {
    return {
      id: r.id as string,
      title: r.title as string,
      author: r.author as string,
      category: r.category as 'book' | 'research' | 'magazine',
      coverImage: r.coverImage as string | null,
      availableCopies: r.availableCopies as number,
      totalCopies: r.copies as number,
      shelfLocation: r.shelfLocation as string,
      status: r.status as string,
      subject: r.subject as string,
      tags: (r.tags as string || '').split(',').filter(Boolean),
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Announcement auto-rotate carousel ─────────────────────────
  const visibleAnnouncements = announcements.filter(a => !dismissedAnnouncements.has(a.id))

  useEffect(() => {
    if (visibleAnnouncements.length <= 1) {
      if (carouselRef.current) clearInterval(carouselRef.current)
      return
    }
    carouselRef.current = setInterval(() => {
      setAnnouncementIndex(prev => (prev + 1) % visibleAnnouncements.length)
    }, 5000)
    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current)
    }
  }, [visibleAnnouncements.length])

  useEffect(() => {
    if (announcementIndex >= visibleAnnouncements.length) {
      setAnnouncementIndex(0)
    }
  }, [announcementIndex, visibleAnnouncements.length])

  // ── Pull-to-refresh ───────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - touchStartY.current
    if (diff > 0 && diff < 100) {
      setPullDistance(diff)
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !refreshing) {
      setRefreshing(true)
      fetchData()
    }
    setPullDistance(0)
  }

  // ── Helpers ───────────────────────────────────────────────────
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatFullDate = () => {
    const d = new Date()
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const activeBook = borrowedBooks[0]
  const totalDays = (activeBook as BorrowedBook & { _totalDays?: number })?._totalDays || 14
  const elapsed = (activeBook as BorrowedBook & { _elapsed?: number })?._elapsed || 0
  const progressPercent = activeBook ? Math.min(100, Math.max(0, (elapsed / totalDays) * 100)) : 0

  const currentAnnouncement = visibleAnnouncements[announcementIndex] || null

  // ── Quick actions config ──────────────────────────────────────
  const quickActions = [
    { label: 'Scan QR', subtitle: 'Attendance', icon: QrCode, bg: 'bg-lib-purple', text: 'text-white', screen: 'qr-scan' as const },
    { label: 'My Loans', subtitle: 'View history', icon: BookOpen, bg: 'bg-lib-purple-50 dark:bg-gray-800', text: 'text-lib-purple', screen: 'borrowed' as const },
    { label: 'Reservations', subtitle: 'Track items', icon: Bookmark, bg: 'bg-lib-purple-50 dark:bg-gray-800', text: 'text-lib-purple', screen: 'borrowed' as const },
    { label: 'Attendance', subtitle: 'Check in', icon: Calendar, bg: 'bg-lib-purple-50 dark:bg-gray-800', text: 'text-lib-purple', screen: 'home' as const },
  ]

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-28" />
            <div className="flex gap-2">
              <Skeleton className="w-9 h-9 rounded-full" />
              <Skeleton className="w-9 h-9 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-7 w-56 rounded-full" />
        </div>
        <div className="flex-1 px-4 py-4 space-y-4">
          <SkeletonCard />
          <SkeletonRecommendations />
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: Math.min(pullDistance * 0.5, 40), opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center overflow-hidden"
          >
            <Loader2 className={`w-5 h-5 text-lib-purple ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs text-lib-purple ml-1.5">
              {refreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top section ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-foreground">{user?.streakCount ?? 0}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('notifications')}
              className="relative p-2 rounded-full hover:bg-lib-purple-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentScreen('settings')}
              className="p-2 rounded-full hover:bg-lib-purple-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* User greeting */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-lib-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{user?.avatarInitials ?? 'U'}</span>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={greeting()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="font-bold text-foreground"
              >
                {greeting()}, {user?.fullName?.split(' ')[0] ?? 'User'}!
              </motion.h2>
            </AnimatePresence>
            <p className="text-xs text-muted-foreground">
              {[user?.program, user?.yearLevel, user?.role].filter(Boolean).map(s => s?.charAt(0).toUpperCase() + s?.slice(1)).join(' · ')}
            </p>
          </div>
        </div>

        {/* Library status badge */}
        <div className="flex items-center justify-between mb-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            libraryOpen
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${libraryOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${libraryOpen ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              Library {libraryOpen ? 'Open' : 'Closed'} · {libraryOpen ? `Closes ${closingTime}` : 'Opens tomorrow'}
            </span>
          </div>
        </div>

        {/* Full date display */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-lib-purple" />
          <span className="text-xs text-muted-foreground font-medium">{formatFullDate()}</span>
        </div>
      </div>

      {/* ── Subtle divider ──────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-lib-purple-200 dark:via-gray-800 to-transparent" />

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto custom-scrollbar">

        {/* ── Announcements section ────────────────────────── */}
        {visibleAnnouncements.length > 0 && currentAnnouncement && (
          <motion.div
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <SectionHeader icon={<Megaphone className="w-4 h-4 text-lib-purple" />}>Announcements</SectionHeader>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnnouncement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-lib-purple-50 dark:bg-gray-800/50 border border-lib-purple-200 dark:border-gray-700 rounded-2xl p-4 relative"
              >
                <button
                  onClick={() => {
                    setDismissedAnnouncements(prev => new Set(prev).add(currentAnnouncement.id))
                    setAnnouncementIndex(0)
                  }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-lib-purple-100 transition-colors"
                  aria-label="Dismiss announcement"
                >
                  <X className="w-3.5 h-3.5 text-lib-purple" />
                </button>
                <div className="flex items-start gap-3 pr-6">
                  <div className="w-8 h-8 rounded-lg bg-lib-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Megaphone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-lib-purple text-sm leading-tight">{currentAnnouncement.title}</h4>
                    <p className="text-xs text-lib-purple-700 dark:text-lib-purple-300 mt-1 leading-relaxed">{currentAnnouncement.message}</p>
                  </div>
                </div>
                {/* Carousel dots */}
                {visibleAnnouncements.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {visibleAnnouncements.map((a, idx) => (
                      <button
                        key={a.id}
                        onClick={() => setAnnouncementIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === announcementIndex ? 'bg-lib-purple w-4' : 'bg-lib-purple-300'
                        }`}
                        aria-label={`Go to announcement ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Today's Highlights feature card ─────────────── */}
        {highlightBook && (
          <motion.div
            custom={0.5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <SectionHeader icon={<Sparkles className="w-4 h-4 text-lib-purple" />}>Today&apos;s Highlight</SectionHeader>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedBookId(highlightBook.id); setCurrentScreen('book-detail') }}
              className="w-full bg-purple-gradient rounded-2xl p-4 text-left relative overflow-hidden cover-pattern-overlay shadow-sm"
            >
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute bottom-2 left-10 w-16 h-16 rounded-full bg-white/5" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-16 h-20 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                  <BookOpen className="w-7 h-7 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span className="text-[10px] font-medium text-white/70">Featured Pick</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{highlightBook.title}</h4>
                  <p className="text-xs text-white/60 mt-0.5">{highlightBook.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {highlightBook.availableCopies > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-medium">
                        {highlightBook.availableCopies} available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-400/20 text-white text-[10px] font-medium">
                        Currently unavailable
                      </span>
                    )}
                    <span className="text-white/50 text-[10px]">→</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* ── Active borrowed book card ───────────────────── */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionHeader>Current Borrow</SectionHeader>
          {activeBook ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden relative card-hover-effect"
            >
              {/* Gradient overlay on left border */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-lib-purple via-lib-purple-light to-lib-purple-300 rounded-l-2xl" />

              <div className="p-4 pl-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{activeBook.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{activeBook.author}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ml-2 ${
                    activeBook.status === 'overdue'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : activeBook.daysLeft <= 3
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-lib-purple-50 dark:bg-gray-800 text-lib-purple'
                  }`}>
                    {activeBook.status === 'overdue'
                      ? `${Math.abs(activeBook.daysLeft)} days overdue`
                      : `${activeBook.daysLeft} days left`
                    }
                  </div>
                </div>

                {/* Category badge */}
                {activeBook.category && (
                  <Badge variant="secondary" className="mb-2 text-[10px] h-5 bg-lib-purple-50 dark:bg-gray-800 text-lib-purple border-lib-purple-200 dark:border-gray-700">
                    {activeBook.category}
                  </Badge>
                )}

                <Progress value={progressPercent} className="h-1.5 mt-2" />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">Borrowed {activeBook.borrowDate}</span>
                  <span className="text-[10px] text-muted-foreground">Due {activeBook.dueDate}</span>
                </div>

                {/* View Details button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 px-2 text-lib-purple hover:text-lib-purple-light hover:bg-lib-purple-50 dark:hover:bg-gray-800 text-xs font-medium p-0"
                  onClick={() => { setSelectedBookId(activeBook.id); setCurrentScreen('book-detail') }}
                >
                  View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Empty state - no borrowed books - illustration-like design */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 dot-pattern-bg" />

              <div className="flex flex-col items-center text-center relative z-10">
                {/* Illustration-like design with stacked books */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-lib-purple-50 dark:bg-gray-800 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-lib-purple/40" />
                  </div>
                  {/* Floating book icons around */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-lib-purple-100 dark:bg-gray-700 flex items-center justify-center floating-animation">
                    <BookOpen className="w-3.5 h-3.5 text-lib-purple/60" />
                  </div>
                  <div className="absolute -bottom-1 -left-2 w-6 h-6 rounded-lg bg-lib-purple-50 dark:bg-gray-800 flex items-center justify-center floating-animation" style={{ animationDelay: '1s' }}>
                    <Bookmark className="w-3 h-3 text-lib-purple/50" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground text-sm">No Active Borrows</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed max-w-[220px]">
                  Your reading list is empty. Explore the catalog to find your next great read!
                </p>
                <Button
                  size="sm"
                  className="bg-lib-purple hover:bg-lib-purple-light text-white text-xs h-9 px-5 rounded-xl shadow-sm shadow-lib-purple/20"
                  onClick={() => setCurrentScreen('search')}
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Browse Catalog
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Quick Actions ────────────────────────────────── */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionHeader>Quick Actions</SectionHeader>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-3">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setCurrentScreen(action.screen)}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl hover:bg-lib-purple-50/50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.text}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground leading-tight">{action.label}</span>
                  <span className="text-[9px] text-muted-foreground leading-tight">{action.subtitle}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Subtle divider ──────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

        {/* ── Recommended for You ──────────────────────────── */}
        {recommendations.length > 0 && (
          <motion.div
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-3">
              <SectionHeader>Recommended for You</SectionHeader>
              <button
                onClick={() => setCurrentScreen('search')}
                className="text-xs text-lib-purple font-medium flex items-center gap-0.5"
              >
                See All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {recommendations.map((book) => {
                const isForYou = user?.program && book.subject?.toLowerCase().includes(user.program.toLowerCase())
                return (
                  <motion.button
                    key={book.id}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { setSelectedBookId(book.id); setCurrentScreen('book-detail') }}
                    className="flex-shrink-0 w-32 group"
                  >
                    {(() => {
                      const coverSrc = getResourceCover(book.coverImage, book.title)
                      return coverSrc ? (
                        <div className="w-32 h-44 rounded-xl mb-2 relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                          <img src={coverSrc} alt={book.title} className="w-full h-full object-cover" />
                          {/* Category badge on cover */}
                          {book.category && (
                            <span className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-gray-800/90 text-lib-purple text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                              {book.category}
                            </span>
                          )}
                          {/* "For You" star badge */}
                          {isForYou && (
                            <span className="absolute top-1.5 right-1.5 bg-amber-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              For You
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-32 h-44 rounded-xl bg-purple-gradient mb-2 flex items-center justify-center relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow cover-pattern-overlay">
                          <BookOpen className="w-8 h-8 text-white/50" />
                          {/* Category badge on cover */}
                          {book.category && (
                            <span className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-gray-800/90 text-lib-purple text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                              {book.category}
                            </span>
                          )}
                          {/* "For You" star badge */}
                          {isForYou && (
                            <span className="absolute top-1.5 right-1.5 bg-amber-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              For You
                            </span>
                          )}
                        </div>
                      )
                    })()}
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                      <span className="text-[10px] text-muted-foreground">
                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{book.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{book.author}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── Subtle divider ──────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

        {/* ── Trending in Your Department ──────────────────── */}
        <motion.div
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionHeader icon={<TrendingUp className="w-4 h-4 text-lib-purple" />}>Trending in Your Department</SectionHeader>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            {trending.map((item, index) => (
              <button
                key={item.id}
                onClick={() => { setSelectedBookId(item.id); setCurrentScreen('book-detail') }}
                className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-lib-purple-50/50 dark:hover:bg-gray-800 active:bg-lib-purple-50 dark:active:bg-gray-800/50 transition-colors ${
                  index < trending.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  item.rank <= 3 ? 'bg-lib-purple text-white' : 'bg-lib-purple-50 dark:bg-gray-800 text-lib-purple'
                }`}>
                  {item.rank}
                </span>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{item.author}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">{item.borrows}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom safe area padding for nav bar ──────── */}
        <div className="h-20" />
      </div>
    </div>
  )
}

'use client'

import { useAppStore, type BorrowedBook, type ResourceItem } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Flame, Bell, Settings, QrCode, BookOpen, Bookmark,
  ChevronRight, Clock, TrendingUp, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState, useCallback } from 'react'

export default function HomeScreen() {
  const { user, setCurrentScreen, setSelectedBookId, unreadCount } = useAppStore()
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [recommendations, setRecommendations] = useState<ResourceItem[]>([])
  const [trending, setTrending] = useState<{ rank: number; title: string; author: string; borrows: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [libraryOpen, setLibraryOpen] = useState(true)
  const [closingTime, setClosingTime] = useState('9PM')

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    try {
      // Fetch borrowed books
      const borrowRes = await fetch(`/api/borrow?userId=${user.id}&status=active`)
      const borrowData = await borrowRes.json()
      if (borrowRes.ok && borrowData.records) {
        const books: BorrowedBook[] = borrowData.records.map((r: Record<string, unknown>) => {
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

      // Fetch resources for recommendations
      const resRes = await fetch('/api/resources?limit=6')
      const resData = await resRes.json()
      if (resRes.ok && resData.resources) {
        const items: ResourceItem[] = resData.resources.map((r: Record<string, unknown>) => ({
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
        }))
        setRecommendations(items)
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
    }
  }, [user?.id])

  useEffect(() => {
    // Use mock trending data for now
    setTrending([
      { rank: 1, title: 'Introduction to Algorithms', author: 'Cormen et al.', borrows: 142 },
      { rank: 2, title: 'Clean Code', author: 'Robert C. Martin', borrows: 128 },
      { rank: 3, title: 'Design Patterns', author: 'Erich Gamma', borrows: 97 },
      { rank: 4, title: 'Database System Concepts', author: 'Silberschatz', borrows: 85 },
      { rank: 5, title: 'Operating System Concepts', author: 'Silberschatz', borrows: 76 },
    ])
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = () => {
    const d = new Date()
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${days[d.getDay()]}/${months[d.getMonth()]}/${String(d.getDate()).padStart(2, '0')}`
  }

  const activeBook = borrowedBooks[0]
  const totalDays = (activeBook as BorrowedBook & { _totalDays?: number })?._totalDays || 14
  const elapsed = (activeBook as BorrowedBook & { _elapsed?: number })?._elapsed || 0
  const progressPercent = activeBook ? Math.min(100, Math.max(0, (elapsed / totalDays) * 100)) : 0

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="w-8 h-8 text-lib-purple animate-spin" />
        <p className="text-sm text-muted-foreground mt-2">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top section */}
      <div className="bg-white px-4 pt-4 pb-3">
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
              className="relative p-2 rounded-full hover:bg-lib-purple-50"
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
              className="p-2 rounded-full hover:bg-lib-purple-50"
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
            <h2 className="font-bold text-foreground">{greeting()}, {user?.fullName?.split(' ')[0] ?? 'User'}!</h2>
            <p className="text-xs text-muted-foreground">
              {[user?.program, user?.yearLevel, user?.role].filter(Boolean).map(s => s?.charAt(0).toUpperCase() + s?.slice(1)).join(' · ')}
            </p>
          </div>
        </div>

        {/* Library status + date */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            libraryOpen
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${libraryOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${libraryOpen ? 'text-green-700' : 'text-red-700'}`}>
              Library {libraryOpen ? 'Open' : 'Closed'} · {libraryOpen ? `Closes ${closingTime}` : 'Opens tomorrow'}
            </span>
          </div>
          <span className="text-xs font-semibold text-lib-purple">{formatDate()}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Active borrowed book */}
        {activeBook && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-lib-purple"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{activeBook.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeBook.author}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeBook.status === 'overdue'
                    ? 'bg-red-100 text-red-700'
                    : activeBook.daysLeft <= 3
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-lib-purple-50 text-lib-purple'
                }`}>
                  {activeBook.status === 'overdue'
                    ? `${Math.abs(activeBook.daysLeft)} days overdue`
                    : `${activeBook.daysLeft} days left`
                  }
                </div>
              </div>
              <Progress value={progressPercent} className="h-1.5 mt-2" />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">Borrowed {activeBook.borrowDate}</span>
                <span className="text-[10px] text-muted-foreground">Due {activeBook.dueDate}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Scan QR', icon: QrCode, bg: 'bg-lib-purple', text: 'text-white', screen: 'qr-scan' as const },
            { label: 'My Loans', icon: BookOpen, bg: 'bg-lib-purple-50', text: 'text-lib-purple', screen: 'borrowed' as const },
            { label: 'Reservations', icon: Bookmark, bg: 'bg-lib-purple-50', text: 'text-lib-purple', screen: 'borrowed' as const },
          ].map((action) => (
            <motion.button
              key={action.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen(action.screen)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl"
            >
              <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
                <action.icon className={`w-6 h-6 ${action.text}`} />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground">Recommended for You</h3>
              <button
                onClick={() => setCurrentScreen('search')}
                className="text-xs text-lib-purple font-medium flex items-center gap-0.5"
              >
                See All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {recommendations.map((book) => (
                <motion.button
                  key={book.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelectedBookId(book.id); setCurrentScreen('book-detail') }}
                  className="flex-shrink-0 w-32"
                >
                  <div className="w-32 h-44 rounded-xl bg-purple-gradient mb-2 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white/50" />
                  </div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-[10px] text-muted-foreground">
                      {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{book.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{book.author}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Trending in Your Department */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-lib-purple" />
            <h3 className="font-bold text-foreground">Trending in Your Department</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {trending.map((item, index) => (
              <button
                key={item.rank}
                onClick={() => { setSelectedBookId(`t${item.rank}`); setCurrentScreen('book-detail') }}
                className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-lib-purple-50/50 transition-colors ${
                  index < trending.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-lib-purple-50 flex items-center justify-center text-xs font-bold text-lib-purple flex-shrink-0">
                  {item.rank}
                </span>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{item.author}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">{item.borrows}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Extra padding at bottom for nav */}
        <div className="h-4" />
      </div>
    </div>
  )
}

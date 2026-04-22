'use client'

import { useAppStore, type BorrowedBook } from '@/lib/store'
import { BookOpen, Clock, Loader2, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function BorrowedScreen() {
  const { user, setSelectedBookId, setCurrentScreen } = useAppStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [activeBooks, setActiveBooks] = useState<BorrowedBook[]>([])
  const [historyBooks, setHistoryBooks] = useState<BorrowedBook[]>([])
  const [loading, setLoading] = useState(true)
  const [returningId, setReturningId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    try {
      // Active borrows
      const activeRes = await fetch(`/api/borrow?userId=${user.id}&status=active`)
      const activeData = await activeRes.json()
      if (activeRes.ok && activeData.records) {
        const books: BorrowedBook[] = activeData.records.map((r: Record<string, unknown>) => {
          const dueDate = new Date(r.dueDate as string)
          const now = new Date()
          const diffMs = dueDate.getTime() - now.getTime()
          const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
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
          }
        })
        setActiveBooks(books)
      }

      // History
      const historyRes = await fetch(`/api/borrow?userId=${user.id}&status=returned`)
      const historyData = await historyRes.json()
      if (historyRes.ok && historyData.records) {
        const books: BorrowedBook[] = historyData.records.map((r: Record<string, unknown>) => {
          const dueDate = new Date(r.dueDate as string)
          const returnDate = r.returnDate ? new Date(r.returnDate as string) : null
          return {
            id: r.id as string,
            title: (r.resource as Record<string, unknown>)?.title as string || 'Unknown',
            author: (r.resource as Record<string, unknown>)?.author as string || 'Unknown',
            category: (r.resource as Record<string, unknown>)?.subject as string || '',
            coverImage: (r.resource as Record<string, unknown>)?.coverImage as string | null,
            borrowDate: new Date(r.borrowDate as string).toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            returnDate: returnDate?.toLocaleDateString() ?? '',
            status: 'active' as const,
            daysLeft: 0,
          }
        })
        setHistoryBooks(books)
      }
    } catch (e) {
      console.error('Failed to fetch borrowed data:', e)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReturn = async (borrowId: string, bookTitle: string) => {
    setReturningId(borrowId)
    try {
      const res = await fetch(`/api/borrow/${borrowId}/return`, { method: 'PUT' })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Cannot Return', description: data.error || 'Something went wrong', variant: 'destructive' })
        return
      }
      toast({ title: 'Book Returned!', description: `${bookTitle} has been returned successfully.` })
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Failed to return book. Please try again.', variant: 'destructive' })
    } finally {
      setReturningId(null)
    }
  }

  const books = activeTab === 'active' ? activeBooks : historyBooks

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient accent */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="font-bold text-foreground text-lg mb-3">My Loans</h2>
        <div className="flex bg-lib-purple-50 rounded-xl p-1">
          {(['active', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white shadow-sm text-lib-purple'
                  : 'text-lib-purple-400 hover:text-lib-purple-600'
              }`}
            >
              {tab === 'active' ? `Active (${activeBooks.length})` : `History (${historyBooks.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Books list */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-lib-purple animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-lib-purple-50 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-lib-purple" />
            </div>
            <h3 className="font-bold text-foreground mb-1">No books yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {activeTab === 'active' ? 'You have no active loans' : 'Your borrowing history will appear here'}
            </p>
            {activeTab === 'active' && (
              <Button
                onClick={() => setCurrentScreen('search')}
                className="bg-lib-purple hover:bg-lib-purple-dark text-white text-xs h-9 px-4 rounded-xl"
              >
                Browse Catalog
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-14 h-[72px] rounded-lg bg-purple-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
                      <BookOpen className="w-5 h-5 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">{book.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span>Borrowed: {book.borrowDate}</span>
                        <span>Due: {book.dueDate}</span>
                      </div>
                      {activeTab === 'active' && (
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            book.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : book.daysLeft <= 3
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {book.status === 'overdue'
                              ? `${Math.abs(book.daysLeft)} days overdue`
                              : `${book.daysLeft} days left`
                            }
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReturn(book.id, book.title)}
                            disabled={returningId === book.id}
                            className="h-7 px-2 text-xs text-lib-purple hover:text-lib-purple-dark hover:bg-lib-purple-50 font-medium"
                          >
                            {returningId === book.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3 mr-1" />
                            )}
                            Return
                          </Button>
                        </div>
                      )}
                      {activeTab === 'history' && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Returned{book.returnDate ? ` on ${book.returnDate}` : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedBookId(book.id); setCurrentScreen('book-detail') }}
                            className="h-7 px-2 text-xs text-lib-purple hover:text-lib-purple-dark hover:bg-lib-purple-50 font-medium"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        <div className="h-4" />
      </div>
    </div>
  )
}

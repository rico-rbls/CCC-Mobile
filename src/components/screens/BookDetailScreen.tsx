'use client'

import { useAppStore, type ResourceItem } from '@/lib/store'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, MapPin, Bookmark, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function BookDetailScreen() {
  const { selectedBookId, user, goBack, setCurrentScreen } = useAppStore()
  const [book, setBook] = useState<(ResourceItem & { description: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [reserving, setReserving] = useState(false)
  const { toast } = useToast()

  const fetchBook = useCallback(async () => {
    if (!selectedBookId) return
    try {
      const res = await fetch(`/api/resources/${selectedBookId}`)
      const data = await res.json()
      if (res.ok) {
        setBook({
          id: data.id,
          title: data.title,
          author: data.author,
          category: data.category,
          coverImage: data.coverImage,
          availableCopies: data.availableCopies,
          totalCopies: data.copies,
          shelfLocation: data.shelfLocation,
          status: data.status,
          subject: data.subject,
          tags: (data.tags || '').split(',').filter(Boolean),
          description: data.abstract || 'No description available.',
        })
      }
    } catch (e) {
      console.error('Failed to fetch book:', e)
    } finally {
      setLoading(false)
    }
  }, [selectedBookId])

  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  const handleBorrow = async () => {
    if (!user?.id || !book) return
    setBorrowing(true)
    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, resourceId: book.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Cannot Borrow', description: data.error || 'Something went wrong', variant: 'destructive' })
        return
      }
      toast({ title: 'Book Borrowed!', description: `${book.title} has been checked out to you.` })
      // Refresh book data
      fetchBook()
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setBorrowing(false)
    }
  }

  const handleReserve = async () => {
    if (!user?.id || !book) return
    setReserving(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, resourceId: book.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Cannot Reserve', description: data.error || 'Something went wrong', variant: 'destructive' })
        return
      }
      toast({ title: 'Reserved!', description: `You'll be notified when ${book.title} becomes available.` })
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setReserving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="w-8 h-8 text-lib-purple animate-spin" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
        <button onClick={goBack} className="text-lib-purple mt-2 text-sm font-medium">Go back</button>
      </div>
    )
  }

  const isAvailable = book.availableCopies > 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-gradient px-4 pt-4 pb-16 relative">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={goBack} className="p-2 -ml-2 rounded-full bg-white/10">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white/70 text-sm">Book Details</span>
        </div>
      </div>

      {/* Book cover overlapping header */}
      <div className="px-4 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Cover placeholder */}
          <div className="h-48 bg-purple-gradient flex items-center justify-center relative">
            <BookOpen className="w-16 h-16 text-white/30" />
            <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 hover:bg-white/30">
              {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
            </Badge>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-bold text-foreground leading-tight">{book.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>

            {/* Availability + Shelf */}
            <div className="flex items-center gap-3 mt-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                {isAvailable ? `${book.availableCopies}/${book.totalCopies} available` : 'Unavailable'}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                Shelf {book.shelfLocation}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">About this book</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {book.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-lib-purple-50 text-lib-purple text-[10px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4">
        <Button
          onClick={isAvailable ? handleBorrow : handleReserve}
          disabled={borrowing || reserving}
          className={`w-full h-12 rounded-xl font-semibold text-base ${
            isAvailable
              ? 'bg-lib-purple hover:bg-lib-purple-dark text-white'
              : 'bg-lib-purple-50 text-lib-purple hover:bg-lib-purple-100'
          }`}
        >
          {borrowing || reserving ? (
            <span className="flex items-center gap-2">
              <motion.div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              Processing...
            </span>
          ) : isAvailable ? (
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Borrow this Book
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" /> Reserve this Book
            </span>
          )}
        </Button>
      </div>

      {/* Related books */}
      <div className="px-4 mt-6 flex-1 overflow-y-auto">
        <h3 className="font-bold text-foreground mb-3">More Resources</h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { title: 'Algorithm Design Manual', author: 'Steven Skiena' },
            { title: 'Competitive Programming', author: 'Steven Halim' },
            { title: 'Cracking the Coding Interview', author: 'Gayle McDowell' },
          ].map((relBook, index) => (
            <button
              key={relBook.title}
              className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-lib-purple-50/50 transition-colors ${
                index < 2 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-gradient flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white/50" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{relBook.title}</h4>
                <p className="text-[10px] text-muted-foreground">{relBook.author}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}

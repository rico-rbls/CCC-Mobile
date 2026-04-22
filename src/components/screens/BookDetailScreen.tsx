'use client'

import { useAppStore, type ResourceItem } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, MapPin, Bookmark, ChevronRight, Loader2, Heart, Share2, Calendar, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { getResourceCover } from '@/lib/covers'

export default function BookDetailScreen() {
  const { selectedBookId, user, goBack, setCurrentScreen, setSelectedBookId, toggleFavorite, isFavorite } = useAppStore()
  const [book, setBook] = useState<(ResourceItem & { description: string; isbn?: string; publicationDate?: string }) | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [reserving, setReserving] = useState(false)
  const [hearted, setHearted] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
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
          isbn: data.isbn || undefined,
          publicationDate: data.publicationDate || undefined,
        })
        setHearted(isFavorite(data.id))
      }
    } catch (e) {
      console.error('Failed to fetch book:', e)
    } finally {
      setLoading(false)
    }
  }, [selectedBookId, isFavorite])

  const fetchRelated = useCallback(async () => {
    if (!selectedBookId) return
    try {
      const res = await fetch(`/api/resources?limit=4`)
      const data = await res.json()
      if (res.ok && data.resources) {
        const items: ResourceItem[] = data.resources
          .filter((r: Record<string, unknown>) => r.id !== selectedBookId)
          .slice(0, 3)
          .map((r: Record<string, unknown>) => ({
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
        setRelatedBooks(items)
      }
    } catch (e) {
      console.error('Failed to fetch related:', e)
    }
  }, [selectedBookId])

  useEffect(() => {
    fetchBook()
    fetchRelated()
  }, [fetchBook, fetchRelated])

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

  const handleFavorite = () => {
    if (!book) return
    toggleFavorite(book.id)
    setHearted(!hearted)
    toast({
      title: hearted ? 'Removed from Favorites' : 'Added to Favorites',
      description: hearted ? `${book.title} removed from your favorites.` : `${book.title} added to your favorites!`,
    })
  }

  const handleShare = async () => {
    if (!book) return
    const shareText = `Check out "${book.title}" by ${book.author} on LibLog!`
    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, text: shareText })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 2000)
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
      {/* Header with decorative pattern */}
      <div className="bg-purple-gradient px-4 pt-4 pb-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 cover-pattern-overlay" />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-4 -left-6 w-24 h-24 rounded-full bg-white/5" />

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-white/70 text-sm">Book Details</span>
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Book cover overlapping header */}
      <div className="px-4 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Cover with image or decorative pattern overlay */}
          {(() => {
            const coverSrc = getResourceCover(book.coverImage, book.title)
            return coverSrc ? (
              <div className="h-48 relative overflow-hidden">
                <img src={coverSrc} alt={book.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Category badge */}
                <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 hover:bg-white/30">
                  {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                </Badge>
                {/* Favorite button */}
                <button
                  onClick={handleFavorite}
                  className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-all active:scale-90"
                  aria-label={hearted ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 transition-all ${hearted ? 'text-red-400 fill-red-400 scale-110' : 'text-white'}`} />
                </button>
              </div>
            ) : (
              <div className="h-48 bg-purple-gradient flex items-center justify-center relative cover-pattern-overlay">
                <BookOpen className="w-16 h-16 text-white/30" />
                <div className="absolute top-4 left-4 w-20 h-20 rounded-full border border-white/10" />
                <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border border-white/10" />
                <div className="absolute top-8 right-12 w-8 h-8 rounded-full bg-white/5" />
                <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 hover:bg-white/30">
                  {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                </Badge>
                <button
                  onClick={handleFavorite}
                  className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-all active:scale-90"
                  aria-label={hearted ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 transition-all ${hearted ? 'text-red-400 fill-red-400 scale-110' : 'text-white'}`} />
                </button>
              </div>
            )
          })()}

          <div className="p-4">
            <h2 className="text-lg font-bold text-foreground leading-tight">{book.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>

            {/* Availability + Shelf */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
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

            {/* ISBN and Publication Date */}
            <div className="mt-3 flex flex-wrap gap-2">
              {book.isbn && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </div>
              )}
              {book.publicationDate && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">Published:</span> {book.publicationDate}
                </div>
              )}
              {book.subject && (
                <div className="px-2.5 py-1 rounded-lg bg-lib-purple-50 text-xs text-lib-purple font-medium">
                  {book.subject}
                </div>
              )}
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
      <div className="px-4 mt-4 flex gap-3">
        <Button
          onClick={isAvailable ? handleBorrow : handleReserve}
          disabled={borrowing || reserving}
          className={`flex-1 h-12 rounded-xl font-semibold text-base ${
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
              <BookOpen className="w-4 h-4" /> Borrow
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" /> Reserve
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="h-12 px-4 rounded-xl border-lib-purple-200 text-lib-purple hover:bg-lib-purple-50"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Related books from API */}
      <div className="px-4 mt-6 flex-1 overflow-y-auto">
        <h3 className="font-bold text-foreground mb-3">More Resources</h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {relatedBooks.length > 0 ? (
            relatedBooks.map((relBook, index) => (
              <button
                key={relBook.id}
                onClick={() => { setSelectedBookId(relBook.id); setCurrentScreen('book-detail') }}
                className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-lib-purple-50/50 active:bg-lib-purple-50 transition-colors ${
                  index < relatedBooks.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-gradient flex items-center justify-center flex-shrink-0 cover-pattern-overlay">
                  <BookOpen className="w-4 h-4 text-white/50" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{relBook.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{relBook.author}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              No other resources found
            </div>
          )}
        </div>
        <div className="h-4" />
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50"
          >
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

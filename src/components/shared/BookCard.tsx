'use client'

import { motion } from 'framer-motion'
import { BookOpen, Star, ChevronRight } from 'lucide-react'
import { getResourceCover } from '@/lib/covers'
import { cn } from '@/lib/utils'

interface ResourceLike {
  id: string
  title: string
  author: string
  category: string
  coverImage: string | null
  availableCopies?: number
  totalCopies?: number
  subject?: string
  tags?: string[]
}

interface BookCardProps {
  book: ResourceLike
  layout?: 'list' | 'grid' | 'featured' | 'search-result'
  isForYou?: boolean
  rank?: number
  borrows?: number
  onClick?: () => void
  children?: React.ReactNode
}

const categoryColors: Record<string, string> = {
  book: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  research: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  magazine: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
}

export default function BookCard({
  book,
  layout = 'list',
  isForYou = false,
  rank,
  borrows,
  onClick,
  children,
}: BookCardProps) {
  const coverSrc = getResourceCover(book.coverImage, book.title)

  if (layout === 'grid') {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="flex-shrink-0 w-[120px] group text-left"
      >
        <div className="w-[120px] h-[160px] rounded-2xl mb-2 relative overflow-hidden dark:shadow-sm group-hover:dark:shadow-md transition-shadow">
          {coverSrc ? (
            <img src={coverSrc} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-purple-gradient flex items-center justify-center cover-pattern-overlay">
              <BookOpen className="w-7 h-7 text-white/50" />
            </div>
          )}
          
          {isForYou && (
            <span className="absolute top-1.5 right-1.5 bg-amber-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-lg leading-none flex items-center gap-0.5 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-current" />
              For You
            </span>
          )}

          {!isForYou && book.category && (
            <span className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-black/60 text-lib-purple dark:text-lib-purple-300 text-[8px] font-bold px-1.5 py-0.5 rounded-lg leading-none">
              {book.category.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <h4 className="text-xs font-semibold text-foreground leading-tight line-clamp-2 min-h-[28px]">
            {book.title}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{book.author}</p>
        </div>
      </motion.button>
    )
  }

  if (layout === 'featured') {
    const available = book.availableCopies ?? 0
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full bg-lib-purple-50 dark:bg-white/5 border border-lib-purple-200 dark:border-white/10 rounded-2xl p-4 text-left glass-card hover-lift transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-lib-purple-100 dark:bg-white/10 flex items-center justify-center dark:shadow-sm">
            {coverSrc ? (
              <img src={coverSrc} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-7 h-7 text-lib-purple/50 dark:text-lib-purple-300/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-medium text-lib-purple dark:text-lib-purple-300">Featured Pick</span>
            </div>
            <h4 className="text-sm font-bold text-lib-purple dark:text-lib-purple-200 leading-tight line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs text-lib-purple/60 dark:text-lib-purple-400/70 mt-0.5">
              {book.author}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {available > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-lib-purple-100 dark:bg-white/10 text-lib-purple dark:text-lib-purple-300 text-[10px] font-medium">
                  {available} available
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-medium">
                  Currently unavailable
                </span>
              )}
              <ChevronRight className="w-3 h-3 text-lib-purple/40 dark:text-lib-purple-300/40" />
            </div>
          </div>
        </div>
      </motion.button>
    )
  }

  if (layout === 'search-result') {
    const category = book.category || 'book'
    const tags = book.tags || []
    const Component = onClick && !children ? motion.button : motion.div
    return (
      <Component
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="w-full bg-card rounded-[22px] dark:shadow-sm p-4 flex items-start gap-3 text-left card-hover-effect hover-lift transition-all"
      >
        <div className="w-14 h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-purple-gradient flex items-center justify-center cover-pattern-overlay dark:shadow-sm">
          {coverSrc ? (
            <img src={coverSrc} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-5 h-5 text-white/50" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
            {book.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", categoryColors[category])}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-lib-purple-50 dark:bg-white/10 text-lib-purple dark:text-lib-purple-300 text-[10px] font-medium">
                  {tag}
                </span>
              ))}
              {book.subject && tags.length === 0 && (
                <span className="px-2 py-0.5 rounded-full bg-lib-purple-50 dark:bg-white/10 text-lib-purple dark:text-lib-purple-300 text-[10px] font-medium">
                  {book.subject}
                </span>
              )}
              {book.availableCopies !== undefined && book.totalCopies !== undefined && (
                <span className={cn(
                  "flex items-center gap-1 text-[10px] font-medium",
                  book.availableCopies > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    book.availableCopies > 0 ? "bg-green-500" : "bg-red-400"
                  )} />
                  {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies}` : 'Out'}
                </span>
              )}
            </div>
          )}
        </div>
      </Component>
    )
  }

  // default / compact horizontal list item (e.g. trending rankings)
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full py-3 hover:bg-lib-purple-50/50 dark:hover:bg-white/5 active:bg-lib-purple-50 dark:active:bg-white/10 transition-colors rounded-2xl px-1"
    >
      {rank !== undefined && (
        <span className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
          rank <= 3 ? "bg-lib-purple text-white" : "bg-lib-purple-50 dark:bg-white/10 text-lib-purple dark:text-lib-purple-300"
        )}>
          {rank}
        </span>
      )}
      <div className="flex-1 text-left min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{book.title}</h4>
        <p className="text-[10px] text-muted-foreground">{book.author}</p>
      </div>
      {borrows !== undefined && (
        <span className="text-[10px] font-medium text-muted-foreground flex-shrink-0">
          {borrows} borrows
        </span>
      )}
    </button>
  )
}

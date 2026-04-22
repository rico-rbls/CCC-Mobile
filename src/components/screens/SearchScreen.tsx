'use client'

import { useAppStore, type ResourceItem } from '@/lib/store'
import { Search, BookOpen, FileText, Newspaper, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useState, useMemo, useEffect, useCallback } from 'react'

const categories = [
  { id: 'all' as const, label: 'All', icon: Search },
  { id: 'book' as const, label: 'Books', icon: BookOpen },
  { id: 'research' as const, label: 'Research', icon: FileText },
  { id: 'magazine' as const, label: 'Magazines', icon: Newspaper },
]

const categoryColors: Record<string, string> = {
  book: 'bg-lib-purple-50 text-lib-purple',
  research: 'bg-blue-50 text-blue-700',
  magazine: 'bg-orange-50 text-orange-700',
}

export default function SearchScreen() {
  const { searchQuery, setSearchQuery, searchCategory, setSearchCategory, setCurrentScreen, setSelectedBookId } = useAppStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const fetchResources = useCallback(async (query: string, category: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set('search', query)
      if (category !== 'all') params.set('category', category)
      params.set('limit', '50')
      const res = await fetch(`/api/resources?${params.toString()}`)
      const data = await res.json()
      if (res.ok && data.resources) {
        const items: ResourceItem[] = data.resources.map((r: Record<string, unknown>) => ({
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
        setResources(items)
      }
    } catch (e) {
      console.error('Failed to fetch resources:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchResources(searchQuery, searchCategory)
  }, [searchCategory, fetchResources])

  // Debounced search
  const handleSearchChange = (value: string) => {
    setLocalQuery(value)
    setSearchQuery(value)
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      fetchResources(value, searchCategory)
    }, 300)
    setDebounceTimer(timer)
  }

  const filtered = useMemo(() => {
    if (!localQuery.trim() && searchCategory === 'all') return resources
    return resources
  }, [resources, localQuery, searchCategory])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white px-4 pt-4 pb-3 space-y-3">
        <h2 className="font-bold text-foreground text-lg">Search Catalog</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books, research, magazines..."
            value={localQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-11 pl-9 rounded-xl border-gray-200 focus:border-lib-purple focus:ring-lib-purple/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = searchCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSearchCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-lib-purple text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-lib-purple-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-lib-purple animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-lib-purple-50 flex items-center justify-center mb-3">
              <Search className="w-8 h-8 text-lib-purple" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map((resource, index) => (
              <motion.button
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => { setSelectedBookId(resource.id); setCurrentScreen('book-detail') }}
                className="w-full bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 text-left hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-18 rounded-lg bg-purple-gradient flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">{resource.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{resource.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[resource.category] || 'bg-gray-100 text-gray-600'}`}>
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${
                      resource.availableCopies > 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${resource.availableCopies > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                      {resource.availableCopies > 0 ? `${resource.availableCopies}/${resource.totalCopies} available` : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  )
}

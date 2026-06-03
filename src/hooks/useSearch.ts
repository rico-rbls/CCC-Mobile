'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppStore, type ResourceItem } from '@/lib/store'

export function useSearch() {
  const { searchQuery, setSearchQuery, searchCategory, setSearchCategory, user } = useAppStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<ResourceItem[]>([])
  const [recommendations, setRecommendations] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const mapResource = (r: Record<string, any>): ResourceItem => ({
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
  })

  const fetchResources = useCallback(async (query: string, category: string) => {
    setLoading(true)
    try {
      let url = `/api/resources?search=${encodeURIComponent(query)}`
      if (category !== 'all') {
        url += `&category=${encodeURIComponent(category)}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok && data.resources) {
        setResources(data.resources.map(mapResource))
      }
    } catch (e) {
      console.error('Failed to fetch resources:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentlyViewed = useCallback(async () => {
    try {
      const res = await fetch('/api/resources?limit=4')
      const data = await res.json()
      if (res.ok && data.resources) {
        setRecentlyViewed(data.resources.map(mapResource))
      }
    } catch {
      // silently fail
    }
  }, [])

  const fetchRecommendations = useCallback(async () => {
    try {
      const program = user?.program || ''
      let programResources: ResourceItem[] = []
      if (program) {
        const progRes = await fetch(`/api/resources?subject=${encodeURIComponent(program)}&limit=6`)
        const progData = await progRes.json()
        if (progRes.ok && progData.resources) {
          programResources = progData.resources.map(mapResource)
        }
      }
      const genRes = await fetch('/api/resources?limit=6')
      const genData = await genRes.json()
      let generalResources: ResourceItem[] = []
      if (genRes.ok && genData.resources) {
        generalResources = genData.resources.map(mapResource)
      }
      const seen = new Set(programResources.map(r => r.id))
      const merged = [...programResources, ...generalResources.filter(r => !seen.has(r.id))].slice(0, 6)
      setRecommendations(merged.length > 0 ? merged : generalResources)
    } catch {
      // silently fail
    }
  }, [user?.program])

  // Initial loading and refetching when settings/categories change
  useEffect(() => {
    fetchResources(searchQuery, searchCategory)
    fetchRecentlyViewed()
    fetchRecommendations()
  }, [searchCategory, fetchResources, fetchRecentlyViewed, fetchRecommendations])

  // Debounced search trigger
  const triggerDebouncedSearch = useCallback((query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    if (!query.trim()) {
      setSearchQuery('')
      fetchResources('', searchCategory)
      return
    }
    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(query)
      fetchResources(query, searchCategory)
    }, 300)
  }, [searchCategory, setSearchQuery, fetchResources])

  const handleSearchChange = useCallback((query: string) => {
    setLocalQuery(query)
    triggerDebouncedSearch(query)
  }, [triggerDebouncedSearch])

  const handleQuickSearch = useCallback((term: string) => {
    setLocalQuery(term)
    setSearchQuery(term)
    fetchResources(term, searchCategory)
  }, [searchCategory, setSearchQuery, fetchResources])

  const clearSearch = useCallback(() => {
    setLocalQuery('')
    setSearchQuery('')
    fetchResources('', searchCategory)
  }, [searchCategory, setSearchQuery, fetchResources])

  const filtered = useMemo(() => {
    return resources
  }, [resources])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  return {
    localQuery,
    searchCategory,
    setSearchCategory,
    resources,
    recentlyViewed,
    recommendations,
    loading,
    filtered,
    handleSearchChange,
    handleQuickSearch,
    clearSearch,
    refetch: () => fetchResources(localQuery, searchCategory),
  }
}

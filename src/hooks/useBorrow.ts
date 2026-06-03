'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

export function useBorrow() {
  const { user } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const borrowBook = async (resourceId: string, bookTitle: string) => {
    if (!user?.id) return false
    setIsLoading(true)
    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, resourceId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({
          title: 'Cannot Borrow',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return false
      }
      toast({
        title: 'Book Borrowed!',
        description: `${bookTitle} has been checked out to you.`,
      })
      return true
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const returnBook = async (borrowId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/borrow/${borrowId}/return`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        toast({
          title: 'Cannot Return',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return false
      }
      return true
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to return book. Please try again.',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    borrowBook,
    returnBook,
    isLoading,
  }
}

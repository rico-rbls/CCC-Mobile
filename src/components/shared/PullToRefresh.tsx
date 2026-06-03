'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  refreshing: boolean
  children: React.ReactNode
}

export default function PullToRefresh({
  onRefresh,
  refreshing,
  children,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    // Find closest scrollable ancestor to check scroll position
    const scrollParent = e.currentTarget.closest('.overflow-y-auto') || e.currentTarget.closest('div')
    if (!scrollParent || scrollParent.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
    } else {
      touchStartY.current = 0
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0) return
    const diff = e.touches[0].clientY - touchStartY.current
    if (diff > 0 && diff < 100) {
      setPullDistance(diff)
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !refreshing) {
      onRefresh()
    }
    setPullDistance(0)
    touchStartY.current = 0
  }

  return (
    <div
      className="flex flex-col w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: Math.min(pullDistance * 0.5, 45), opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm flex-shrink-0"
          >
            <Loader2 className={`w-4 h-4 text-lib-purple ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-[11px] text-lib-purple dark:text-lib-purple-300 ml-1.5 font-medium">
              {refreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}

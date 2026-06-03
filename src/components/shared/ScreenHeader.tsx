'use client'

import { ArrowLeft } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightElement?: React.ReactNode
}

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightElement,
}: ScreenHeaderProps) {
  return (
    <div className="bg-card px-4 pt-4 pb-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-lib-purple-50 dark:hover:bg-white/5 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div>
          <h2 className="font-bold text-foreground text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
    </div>
  )
}

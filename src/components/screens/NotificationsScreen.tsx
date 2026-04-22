'use client'

import { useAppStore, type NotificationItem } from '@/lib/store'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, BookOpen, Megaphone, CheckCheck, Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const typeConfig: Record<string, { icon: typeof Calendar; color: string; bg: string }> = {
  due_date: { icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
  reservation: { icon: BookOpen, color: 'text-lib-purple', bg: 'bg-lib-purple-50' },
  announcement: { icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
}

export default function NotificationsScreen() {
  const { user, goBack, setUnreadCount } = useAppStore()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`)
      const data = await res.json()
      if (res.ok && data.notifications) {
        const items: NotificationItem[] = data.notifications.map((n: Record<string, unknown>) => ({
          id: n.id as string,
          type: n.type as 'due_date' | 'reservation' | 'announcement',
          title: n.title as string,
          message: n.message as string,
          isRead: n.isRead as boolean,
          createdAt: n.createdAt as string,
        }))
        setNotifications(items)
        const unread = items.filter(n => !n.isRead).length
        setUnreadCount(unread)
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
    } finally {
      setLoading(false)
    }
  }, [user?.id, setUnreadCount])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAllRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.isRead)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    // Mark each unread notification as read via API
    for (const n of unreadNotifs) {
      fetch(`/api/notifications/${n.id}/read`, { method: 'PUT' }).catch(() => {})
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHrs < 1) return 'Just now'
    if (diffHrs < 24) return `${diffHrs}h ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const hasUnread = notifications.some(n => !n.isRead)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-lib-purple-50">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-bold text-foreground text-lg">Notifications</h2>
        </div>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-lib-purple font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-lib-purple animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-lib-purple-50 flex items-center justify-center mb-3">
              <BookOpen className="w-8 h-8 text-lib-purple" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground text-center">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, index) => {
              const config = typeConfig[notif.type] || typeConfig.announcement
              const Icon = config.icon
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 border-l-4 ${
                    notif.isRead ? 'border-transparent' : 'border-lib-purple'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold leading-tight text-foreground">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-lib-purple flex-shrink-0 mt-1.5" />
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  )
}

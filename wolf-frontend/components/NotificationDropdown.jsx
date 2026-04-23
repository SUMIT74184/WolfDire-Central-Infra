"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { notificationApi, authApi } from "@/lib/api-client"

export default function NotificationDropdown() {
  const queryClient = useQueryClient()

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    retry: false
  })

  const userId = me?.userId || me?.id

  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadCount', userId],
    queryFn: () => notificationApi.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000,
  })

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationApi.listByUser(userId, 0, 5, true),
    enabled: !!userId,
    refetchInterval: 30000,
  })

  const unreadCount = unreadCountData?.count || 0
  const notifications = notificationsData?.content || []

  const markReadMutation = useMutation({
    mutationFn: (notifId) => notificationApi.markRead(userId, [notifId]),
    // Optimistic update
    onMutate: async (notifId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications', userId] })
      await queryClient.cancelQueries({ queryKey: ['unreadCount', userId] })
      
      const previousNotifs = queryClient.getQueryData(['notifications', userId])
      const previousCount = queryClient.getQueryData(['unreadCount', userId])

      queryClient.setQueryData(['notifications', userId], (old) => {
        if (!old) return old
        return { ...old, content: old.content?.filter((n) => n.id !== notifId) }
      })

      queryClient.setQueryData(['unreadCount', userId], (old) => {
        if (!old) return old
        return { ...old, count: Math.max(0, (old.count || 0) - 1) }
      })

      return { previousNotifs, previousCount }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['notifications', userId], context.previousNotifs)
      queryClient.setQueryData(['unreadCount', userId], context.previousCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount', userId] })
    }
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount', userId] })
    }
  })

  const handleMarkAsRead = (notifId) => {
    if (!userId) return
    markReadMutation.mutate(notifId)
  }

  const handleMarkAllRead = () => {
    if (!userId) return
    markAllReadMutation.mutate()
  }

  // If not logged in, just don't show or show a grayed out version
  if (!userId) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="font-semibold text-sm">Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={handleMarkAllRead}>
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-4 cursor-default whitespace-normal break-words" onSelect={(e) => e.preventDefault()}>
                <span className="text-sm font-medium">{notif.title || notif.type}</span>
                <span className="text-sm text-muted-foreground">{notif.message}</span>
                <div className="mt-2 w-full flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleMarkAsRead(notif.id)}>
                    Dismiss
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

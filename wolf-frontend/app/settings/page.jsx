"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi, notificationApi, socialApi } from "@/lib/api-client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, UserX, Shield, Bell, Lock, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const queryClient = useQueryClient()

  const [deactivateConfirm, setDeactivateConfirm] = useState("")

  const { data: preferences, isLoading: prefsLoading } = useQuery({
    queryKey: ['notificationPreferences', user?.userId],
    queryFn: () => notificationApi.getPreferences(user?.userId || ""),
    enabled: !!user?.userId
  })

  const { data: blockedUsersData, isLoading: blockedLoading } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: () => socialApi.getBlockedUsers(),
    enabled: !!user?.userId
  })

  const blockedUsers = blockedUsersData && Array.isArray(blockedUsersData.content) ? blockedUsersData.content : []

  const updatePrefsMutation = useMutation({
    mutationFn: (newPrefs) => notificationApi.updatePreferences(user?.userId || "", newPrefs),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['notificationPreferences', user?.userId], updatedData)
    }
  })

  const unblockMutation = useMutation({
    mutationFn: (blockedId) => socialApi.unblockUser(blockedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] })
    }
  })

  const deactivateMutation = useMutation({
    mutationFn: () => authApi.deactivateAccount(),
    onSuccess: () => {
      logout() // Force clear frontend state and redirect to login
    }
  })

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>
  
  if (!user) return <div className="p-8 text-center text-red-500">You must be logged in to access settings.</div>

  const handleTogglePref = (key) => {
    if (!preferences) return
    updatePrefsMutation.mutate({
      ...preferences,
      [key]: !preferences[key]
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex gap-2"><Bell className="w-4 h-4"/> Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="flex gap-2"><Shield className="w-4 h-4"/> Privacy & Blocks</TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2"><Lock className="w-4 h-4"/> Account Security</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose how and when you want to be notified.</p>
            
            {prefsLoading ? <p>Loading preferences...</p> : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch 
                    checked={preferences?.emailEnabled} 
                    onCheckedChange={() => handleTogglePref('emailEnabled')} 
                    disabled={updatePrefsMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch 
                    checked={preferences?.pushEnabled} 
                    onCheckedChange={() => handleTogglePref('pushEnabled')} 
                    disabled={updatePrefsMutation.isPending}
                  />
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="font-medium mb-4">Activity Alerts</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Comments & Replies</span>
                      <Switch 
                        checked={preferences?.commentNotifications} 
                        onCheckedChange={() => handleTogglePref('commentNotifications')} 
                        disabled={updatePrefsMutation.isPending}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Upvotes on your posts</span>
                      <Switch 
                        checked={preferences?.upvoteNotifications} 
                        onCheckedChange={() => handleTogglePref('upvoteNotifications')} 
                        disabled={updatePrefsMutation.isPending}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mentions</span>
                      <Switch 
                        checked={preferences?.mentionNotifications} 
                        onCheckedChange={() => handleTogglePref('mentionNotifications')} 
                        disabled={updatePrefsMutation.isPending}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Blocked Users</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Users on this list cannot see your posts or interact with you.</p>

            {blockedLoading ? <p>Loading blocked users...</p> : (
              <div className="space-y-4">
                {blockedUsers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>You haven't blocked any users yet.</p>
                  </div>
                ) : (
                  blockedUsers.map((block) => (
                    <div key={block.id} className="flex items-center justify-between p-4 border border-border rounded-md">
                      <div>
                        {/* the backend blocked API returns blockedId and reason, typically we'd fetch profile info or use ID for now */}
                        <p className="font-medium">User ID: {block.blockedId}</p>
                        <p className="text-xs text-muted-foreground">Blocked on: {new Date(block.blockedAt).toLocaleDateString()}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => unblockMutation.mutate(block.blockedId)}
                        disabled={unblockMutation.isPending}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Account Security Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="rounded-lg border border-destructive/50 bg-card p-6 shadow-sm text-destructive-foreground">
            <div className="flex items-center gap-2 mb-4 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Danger Zone</h2>
            </div>
            
            <div className="space-y-4 bg-muted/50 p-4 rounded-md border border-border">
              <h3 className="font-semibold text-foreground">Deactivate Account</h3>
              <p className="text-sm text-muted-foreground">
                Deactivating your account will make your profile and posts invisible to other users. You will be logged out immediately. Your data will be preserved in case you decide to reactivate later.
              </p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold mb-2">Type "deactivate" to confirm:</p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm max-w-sm"
                    placeholder="deactivate"
                    value={deactivateConfirm}
                    onChange={(e) => setDeactivateConfirm(e.target.value)}
                  />
                  <Button 
                    variant="destructive"
                    disabled={deactivateConfirm !== "deactivate" || deactivateMutation.isPending}
                    onClick={() => deactivateMutation.mutate()}
                  >
                    {deactivateMutation.isPending ? "Deactivating..." : "Deactivate Account"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

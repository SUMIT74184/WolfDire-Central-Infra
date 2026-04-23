"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { authApi, socialApi, postApi, analyticsApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MapPin,
  Link as LinkIcon,
  Edit2,
  Settings,
  Share2,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Activity
} from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")

  const { data: me, isLoading: meLoading, error: meError } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  })

  const userId = me?.userId || me?.id || ""

  const { data: followersData } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => socialApi.followers(userId),
    enabled: !!userId,
  })

  const { data: followingData } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => socialApi.following(userId),
    enabled: !!userId,
  })

  const { data: analytics } = useQuery({
    queryKey: ['analytics', userId],
    queryFn: () => {
      const now = new Date()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(now.getDate() - 30)
      return analyticsApi.user(userId, thirtyDaysAgo.toISOString(), now.toISOString())
    },
    enabled: !!userId,
  })

  const { data: postsData } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postApi.list(0, 10),
  })

  const userProfile = {
    name: me ? (`${me.firstName || ""} ${me.lastName || ""}`.trim() || me.email) : "",
    username: me ? (me.email?.split("@")[0] || "user") : "user",
    avatar: me?.avatar || "/diverse-user-avatars.png",
    bio: me?.bio || "WolfDire member",
    location: me?.location || "",
    website: me?.website || "",
    email: me?.email || "",
    followers: followersData ? (Array.isArray(followersData) ? followersData.length : followersData.count || 0) : 0,
    following: followingData ? (Array.isArray(followingData) ? followingData.length : followingData.count || 0) : 0,
    joinDate: me?.createdAt ? `Joined ${new Date(me.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "",
    karma: me?.karma || 0,
    posts: me?.postCount || 0,
  }

  const userPosts = postsData ? (Array.isArray(postsData) ? postsData : postsData.content || []).map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    community: p.subredditName || "General",
    likes: p.upvotes || 0,
    comments: p.commentCount || 0,
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  })) : []

  const loading = meLoading
  const error = meError ? meError.message || "Failed to load profile" : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading profile...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : (
          <>
        {/* Header Banner */}
        <div className="mb-6 h-32 rounded-lg bg-gradient-to-r from-primary to-accent" />

        {/* Profile Card */}
        <div className="mb-6 -mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
              <p className="text-muted-foreground">u/{userProfile.username}</p>
              <p className="mt-2 text-sm text-muted-foreground">{userProfile.joinDate}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <p className="mb-4 text-foreground">{userProfile.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {userProfile.location}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href={`https://${userProfile.website}`} className="text-primary hover:underline">
                  {userProfile.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {userProfile.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Posts", value: userProfile.posts, icon: MessageCircle },
            { label: "Followers", value: userProfile.followers.toLocaleString(), icon: TrendingUp },
            { label: "Following", value: userProfile.following, icon: Bookmark },
            { label: "Karma", value: userProfile.karma.toLocaleString(), icon: TrendingUp },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Content Tabs */}
        <Card className="border-border">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted w-full justify-start">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === "posts" && (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Link key={post.id} href={`/post/${post.id}`}>
                    <div className="rounded-lg border border-border p-4 hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground hover:text-primary">
                            {post.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <Badge variant="outline">c/{post.community}</Badge>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> {post.comments}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No saved posts yet</p>
              </div>
            )}

            {activeTab === "communities" && (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Join communities to see them here</p>
              </div>
            )}
            
            {activeTab === "analytics" && (
              <div className="py-8">
                <h3 className="text-lg font-semibold mb-4">Your 30-Day Activity</h3>
                {analytics ? (
                  <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-lg border border-border p-4">
                        <span className="text-xs text-muted-foreground block">Profile Views</span>
                        <span className="text-xl font-bold">{analytics.totalViews || 0}</span>
                     </div>
                     <div className="rounded-lg border border-border p-4">
                        <span className="text-xs text-muted-foreground block">Content Interactions</span>
                        <span className="text-xl font-bold">{analytics.totalInteractions || 0}</span>
                     </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                     <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                     <p>Analytics unavailable at this time</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  )
}

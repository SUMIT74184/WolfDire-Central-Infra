"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
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
  MessageCircle,
  Bookmark,
  TrendingUp,
  UserPlus,
  UserMinus,
  Loader2
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params?.id
  const queryClient = useQueryClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")

  // Get current user to see if this is MY profile
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  })

  // If this is my ID, redirect to /profile
  if (me && (me.userId === userId || me.id === userId)) {
    router.push('/profile')
  }

  // Get target user info - since there's no direct "getPublicProfile", 
  // we'll try to infer it from their posts or use a generic fetch if it exists.
  // Actually, let's check if ConnectionController has something.
  // Based on previous analysis, we'll use postApi.getUserPosts to at least get some context.
  
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => postApi.getUserPosts(userId, 0, 20),
    enabled: !!userId,
  })

  // Try to get followers/following for this user
  // Note: These might fail if the API requires the token user to be the one requesting their OWN stats.
  // But usually public stats are allowed.
  const { data: followersData } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => socialApi.followers(), // This might need a userId param in the future
    enabled: false, // Disabling for now as the API seems to only return current user's followers
  })

  const { data: followingData } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => socialApi.following(),
    enabled: false,
  })

  const posts = postsData ? (Array.isArray(postsData) ? postsData : postsData.content || []) : []
  
  // Extract user info from the first post if available
  const userFromPost = posts.length > 0 ? {
    username: posts[0].username,
    avatar: posts[0].userAvatar,
    bio: posts[0].userBio
  } : null

  const userProfile = {
    name: userFromPost?.username || "User",
    username: userFromPost?.username || "user",
    avatar: userFromPost?.avatar || "/diverse-user-avatars.png",
    bio: userFromPost?.bio || "WolfDire member",
    followers: 0,
    following: 0,
    posts: posts.length,
  }

  const followMutation = useMutation({
    mutationFn: () => socialApi.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] })
    }
  })

  if (postsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header Banner */}
        <div className="mb-6 h-32 rounded-lg bg-gradient-to-r from-primary/50 to-accent/50" />

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
            </div>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button className="gap-2" onClick={() => followMutation.mutate()}>
              <UserPlus className="h-4 w-4" />
              Follow
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <p className="mb-4 text-foreground">{userProfile.bio}</p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Posts", value: userProfile.posts, icon: MessageCircle },
            { label: "Followers", value: userProfile.followers, icon: TrendingUp },
            { label: "Following", value: userProfile.following, icon: Bookmark },
            { label: "Karma", value: 0, icon: TrendingUp },
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
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === "posts" && (
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <div className="rounded-lg border border-border p-4 hover:bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground hover:text-primary">
                              {post.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <Badge variant="outline">c/{post.communityName || "General"}</Badge>
                              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {post.score || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> {post.commentCount || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    This user hasn't posted anything yet.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

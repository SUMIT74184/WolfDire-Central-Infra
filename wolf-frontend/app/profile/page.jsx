"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { authApi, socialApi, postApi, analyticsApi, communityApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: me, isLoading: meLoading, error: meError } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  })

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    website: "",
    profilePictureUrl: ""
  })

  // Initialize form when data loads
  if (me && editFormData.firstName === "" && editFormData.lastName === "") {
    setEditFormData({
      firstName: me.firstName || "",
      lastName: me.lastName || "",
      bio: me.bio || "",
      location: me.location || "",
      website: me.website || "",
      profilePictureUrl: me.profilePictureUrl || ""
    })
  }

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setIsEditProfileOpen(false)
    }
  })

  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(editFormData)
  }

  const userId = me?.userId || me?.id || ""

  const { data: followersData } = useQuery({
    queryKey: ['followers'],
    queryFn: () => socialApi.followers(),
    enabled: !!userId,
  })

  const { data: followingData } = useQuery({
    queryKey: ['following'],
    queryFn: () => socialApi.following(),
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
    queryKey: ['userPosts', userId],
    queryFn: () => postApi.getUserPosts(userId, 0, 10),
    enabled: !!userId,
  })

  const { data: communitiesData } = useQuery({
    queryKey: ['myCommunities'],
    queryFn: () => communityApi.myCommunities(),
  })

  const { data: savedPostsData } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: () => postApi.getSavedPosts(0, 50),
  })

  const unsavePostMutation = useMutation({
    mutationFn: (postId) => postApi.unsavePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] })
    }
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
    community: p.communityName || p.subredditName || "General",
    likes: p.score || p.upvotes || 0,
    comments: p.commentCount || 0,
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  })) : []

  const savedPosts = savedPostsData ? (Array.isArray(savedPostsData) ? savedPostsData : savedPostsData.content || []).map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    community: p.communityName || p.subredditName || "General",
    likes: p.score || p.upvotes || 0,
    comments: p.commentCount || 0,
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  })) : []

  const myCommunities = communitiesData ? (Array.isArray(communitiesData) ? communitiesData : communitiesData.content || []) : []

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
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editFormData.firstName}
                        onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editFormData.lastName}
                        onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={editFormData.website}
                      onChange={(e) => setEditFormData({...editFormData, website: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePictureUrl">Avatar URL</Label>
                    <Input
                      id="profilePictureUrl"
                      type="url"
                      value={editFormData.profilePictureUrl}
                      onChange={(e) => setEditFormData({...editFormData, profilePictureUrl: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
              <div className="space-y-4">
                {savedPosts.length > 0 ? (
                  savedPosts.map((post) => (
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
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary" 
                            onClick={(e) => {
                              e.preventDefault()
                              unsavePostMutation.mutate(post.id)
                            }}
                            disabled={unsavePostMutation.isPending}
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </Button>
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
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No saved posts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "communities" && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {myCommunities.length > 0 ? (
                  myCommunities.map((community) => (
                    <Link key={community.id} href={`/c/${community.name || community.id}`}>
                      <Card className="h-full border-border hover:bg-secondary cursor-pointer transition-colors">
                        <CardContent className="p-4 text-center">
                          <Avatar className="mx-auto mb-3 h-12 w-12 text-lg font-bold">
                            <AvatarFallback>
                              {(community.name || "C")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{community.name || "Community"}</h3>
                          <Badge variant="secondary" className="mt-2">Member</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Join communities to see them here</p>
                  </div>
                )}
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

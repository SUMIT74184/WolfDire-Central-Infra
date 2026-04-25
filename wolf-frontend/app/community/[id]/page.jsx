"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { communityApi, postApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Bell, Share2, Heart, MessageCircle, PenSquare, Calendar, Globe, Loader2 } from "lucide-react"

const members = [
  { name: "Sarah Chen", avatar: "/woman-developer.png", role: "Admin", posts: 47 },
  { name: "David Park", avatar: "/asian-male-data-scientist.jpg", role: "Admin", posts: 38 },
  { name: "Marcus Johnson", avatar: "/professional-man.png", role: "Moderator", posts: 29 },
  { name: "Emma Williams", avatar: "/woman-designer.png", role: "Member", posts: 23 },
]

export default function CommunityPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("posts")

  const { data: community, isLoading: isCommLoading } = useQuery({
    queryKey: ["community", id],
    queryFn: () => communityApi.getById(id),
  })

  // Provide fallback objects so destructuring continues working until fetched
  const cData = community || {}

  const { data: rawPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["community-posts", id],
    queryFn: () => postApi.getCommunityPosts(id).then((res) => res.content || res),
  })

  const posts = Array.isArray(rawPosts) ? rawPosts : []

  const followMutation = useMutation({
    mutationFn: () => communityApi.follow(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community", id] }),
  })

  const rules = cData.rules || ["Be respectful and constructive", "No spam or self-promotion", "Stay on topic", "Credit original sources", "No NSFW content"]
  const admins = cData.admins || [{ name: "Sarah Chen", avatar: "/woman-developer.png" }]


  if (isCommLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-muted sm:h-64">
        <img src={cData.cover || "/placeholder.svg"} alt={cData.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Community Header */}
        <div className="-mt-16 relative z-10 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
            <AvatarImage src={cData.image || "/placeholder.svg"} />
            <AvatarFallback>{cData.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{cData.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {cData.memberCount || 0} members
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {cData.createdAt || "Recently"}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Public
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-transparent">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
               variant={cData.isJoined ? "secondary" : "default"} 
               onClick={() => followMutation.mutate()}
               disabled={followMutation.isPending}
            >
              {cData.isJoined ? "Joined" : "Join Community"}
            </Button>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="mt-6">
          <p className="text-muted-foreground">{cData.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(cData.tags || ["Programming", "AI", "Cloud"]).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <div className="flex items-center justify-between border-b border-border">
            <TabsList className="bg-transparent border-0">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            {cData.isJoined && (
              <Button className="gap-2">
                <PenSquare className="h-4 w-4" />
                Write Post
              </Button>
            )}
          </div>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {isPostsLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/></div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No posts found in this community yet.</div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="group overflow-hidden border-border">
                      {post.pinned && (
                        <div className="bg-primary/10 px-4 py-2 text-sm font-medium text-primary">Pinned Post</div>
                      )}
                      <div className="flex gap-4 p-4">
                        <div className="hidden aspect-square w-32 shrink-0 overflow-hidden rounded-lg sm:block">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            <Link href={`/post/${post.id}`}>{post.title}</Link>
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content || post.excerpt}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                                <AvatarFallback>{(post.username || "U")[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {post.username} · {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center gap-1 text-sm">
                                <Heart className="h-4 w-4" /> {post.likes || 0}
                              </span>
                              <span className="flex items-center gap-1 text-sm">
                                <MessageCircle className="h-4 w-4" /> {post.commentCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <h3 className="font-semibold text-foreground">Community Rules</h3>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {rules.map((rule, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium text-foreground">{index + 1}.</span>
                          {rule}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <h3 className="font-semibold text-foreground">Admins & Moderators</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {admins.map((admin) => (
                      <div key={admin.name} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{admin.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{admin.name}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card key={member.name} className="border-border">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.role} · {member.posts} posts
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">About {cData.name}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{cData.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{(cData.memberCount || 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{(posts.length).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{admins.length}</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Bell, Share2, Heart, MessageCircle, PenSquare, Calendar, Globe } from "lucide-react"

const community = {
  id: 1,
  name: "Tech Enthusiasts",
  description:
    "A community for developers, engineers, and tech lovers to share knowledge and discuss the latest trends in technology. From web development to AI, we cover it all.",
  members: 45200,
  posts: 12450,
  image: "/vibrant-tech-community.png",
  cover: "/tech-community-cover.png",
  tags: ["Programming", "Web Dev", "AI/ML", "Cloud", "DevOps"],
  isJoined: true,
  createdAt: "March 2020",
  admins: [
    { name: "Sarah Chen", avatar: "/woman-developer.png" },
    { name: "David Park", avatar: "/asian-male-data-scientist.jpg" },
  ],
  rules: [
    "Be respectful and constructive",
    "No spam or self-promotion",
    "Stay on topic",
    "Credit original sources",
    "No NSFW content",
  ],
}

const posts = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2025",
    excerpt: "Explore the upcoming trends in web development, from AI-powered tools to new frameworks.",
    author: { name: "Sarah Chen", avatar: "/woman-developer.png" },
    readTime: "8 min read",
    likes: 2453,
    comments: 189,
    image: "/futuristic-web-development.png",
    date: "Dec 15, 2025",
    pinned: true,
  },
  {
    id: 2,
    title: "Understanding Machine Learning: A Beginner's Guide",
    excerpt: "Demystifying AI and machine learning concepts for developers.",
    author: { name: "David Park", avatar: "/asian-male-data-scientist.jpg" },
    readTime: "12 min read",
    likes: 3241,
    comments: 234,
    image: "/ml-neural-network-visualization.png",
    date: "Dec 14, 2025",
    pinned: false,
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    excerpt: "Best practices for creating robust and performant backend services.",
    author: { name: "Marcus Johnson", avatar: "/professional-man.png" },
    readTime: "10 min read",
    likes: 1876,
    comments: 95,
    image: "/node-api-architecture.png",
    date: "Dec 13, 2025",
    pinned: false,
  },
]

const members = [
  { name: "Sarah Chen", avatar: "/woman-developer.png", role: "Admin", posts: 47 },
  { name: "David Park", avatar: "/asian-male-data-scientist.jpg", role: "Admin", posts: 38 },
  { name: "Marcus Johnson", avatar: "/professional-man.png", role: "Moderator", posts: 29 },
  { name: "Emma Williams", avatar: "/woman-designer.png", role: "Member", posts: 23 },
  { name: "Alex Rivera", avatar: "/male-developer.png", role: "Member", posts: 18 },
  { name: "Jordan Lee", avatar: "/female-engineer-working.png", role: "Member", posts: 15 },
]

export default function CommunityPage() {
  const [isJoined, setIsJoined] = useState(community.isJoined)
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-muted sm:h-64">
        <img src={community.cover || "/placeholder.svg"} alt={community.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Community Header */}
        <div className="-mt-16 relative z-10 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
            <AvatarImage src={community.image || "/placeholder.svg"} />
            <AvatarFallback>{community.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{community.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {community.members.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {community.createdAt}
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
            <Button variant={isJoined ? "secondary" : "default"} onClick={() => setIsJoined(!isJoined)}>
              {isJoined ? "Joined" : "Join Community"}
            </Button>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="mt-6">
          <p className="text-muted-foreground">{community.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {community.tags.map((tag) => (
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
            {isJoined && (
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
                {posts.map((post) => (
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
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {post.author.name} · {post.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1 text-sm">
                              <Heart className="h-4 w-4" /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              <MessageCircle className="h-4 w-4" /> {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <h3 className="font-semibold text-foreground">Community Rules</h3>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {community.rules.map((rule, index) => (
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
                    {community.admins.map((admin) => (
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
                <h3 className="text-lg font-semibold text-foreground">About {community.name}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{community.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{community.members.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{community.posts.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{community.admins.length}</p>
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

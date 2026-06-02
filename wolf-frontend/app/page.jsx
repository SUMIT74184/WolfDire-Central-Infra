"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { postApi, communityApi, analyticsApi } from "@/lib/api-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, TrendingUp, Users, BookOpen, Zap, Heart, MessageCircle, Star, Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [physicsItems, setPhysicsItems] = useState([
    { id: 1, label: 'card1', text: 'AI Agents are rising fast 🚀', tag: 'Tech Trend', x: 12, y: 22, vx: 0.05, vy: -0.04, r: -5, vr: 0.03 },
    { id: 2, label: 'card2', text: 'Sleek Neomorphism is back in 2026', tag: 'Design', x: 72, y: 16, vx: -0.04, vy: 0.03, r: 6, vr: -0.02 },
    { id: 3, label: 'card3', text: 'Join Pack +', type: 'join', x: 14, y: 68, vx: 0.03, vy: 0.05, r: 0, vr: 0.02 },
    { id: 4, label: 'card4', text: '#antigravity', type: 'hashtag', x: 74, y: 64, vx: -0.04, vy: -0.04, r: -10, vr: -0.04 }
  ])

  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    mousePosRef.current = mousePos
  }, [mousePos])

  useEffect(() => {
    if (!isMounted) return

    let animationFrameId
    let items = [
      { id: 1, label: 'card1', text: 'AI Agents are rising fast 🚀', tag: 'Tech Trend', x: 12, y: 22, vx: 0.05, vy: -0.04, r: -5, vr: 0.03 },
      { id: 2, label: 'card2', text: 'Sleek Neomorphism is back in 2026', tag: 'Design', x: 72, y: 16, vx: -0.04, vy: 0.03, r: 6, vr: -0.02 },
      { id: 3, label: 'card3', text: 'Join Pack +', type: 'join', x: 14, y: 68, vx: 0.03, vy: 0.05, r: 0, vr: 0.02 },
      { id: 4, label: 'card4', text: '#wolf-is-live', type: 'hashtag', x: 74, y: 64, vx: -0.04, vy: -0.04, r: -10, vr: -0.04 }
    ]

    const updatePhysics = () => {
      const currentMouse = mousePosRef.current
      const mousePctX = 50 + (currentMouse.x * 100)
      const mousePctY = 50 + (currentMouse.y * 100)

      items = items.map(item => {
        let newX = item.x + item.vx
        let newY = item.y + item.vy
        let newR = item.r + item.vr

        // Bounce off bounds (X between 3% and 82%, Y between 10% and 75%)
        let newVx = item.vx
        let newVy = item.vy
        if (newX < 3) {
          newVx = Math.abs(item.vx)
          newX = 3
        } else if (newX > 82) {
          newVx = -Math.abs(item.vx)
          newX = 82
        }

        if (newY < 10) {
          newVy = Math.abs(item.vy)
          newY = 10
        } else if (newY > 75) {
          newVy = -Math.abs(item.vy)
          newY = 75
        }

        // Repel from mouse cursor
        const dx = newX - mousePctX
        const dy = newY - mousePctY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 22) { // repulsion distance
          const force = (22 - dist) / 22
          newVx += (dx / (dist || 1)) * force * 0.05
          newVy += (dy / (dist || 1)) * force * 0.05
        } else {
          // Gently guide back to base speed if pushed too fast
          const baseSpeed = Math.sqrt(item.vx * item.vx + item.vy * item.vy)
          const currSpeed = Math.sqrt(newVx * newVx + newVy * newVy)
          if (currSpeed > baseSpeed * 1.5) {
            newVx = newVx * 0.95 + item.vx * 0.05
            newVy = newVy * 0.95 + item.vy * 0.05
          }
        }

        return {
          ...item,
          x: newX,
          y: newY,
          r: newR,
          vx: newVx,
          vy: newVy
        }
      })

      setPhysicsItems(items)
      animationFrameId = requestAnimationFrame(updatePhysics)
    }

    animationFrameId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isMounted])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["trending-posts"],
    queryFn: () => postApi.trending(0, 3),
  })

  const { data: communitiesData, isLoading: communitiesLoading } = useQuery({
    queryKey: ["top-communities"],
    queryFn: () => communityApi.list(0, 4),
  })

  const { data: trendingTopicsData } = useQuery({
    queryKey: ["trending-topics"],
    queryFn: () => analyticsApi.trending(),
    retry: false,
  })

  const trendingPosts = (Array.isArray(postsData?.content) && postsData.content.length > 0) ? postsData.content : [
    {
      id: 1,
      title: "The Future of Web Development: What to Expect in 2025",
      excerpt: "Explore the upcoming trends in web development, from AI-powered tools to new frameworks.",
      authorName: "Sarah Chen",
      communityName: "Technology",
      voteCount: 2453,
      commentCount: 189,
      mediaUrl: "/futuristic-web-development.png",
    },
    {
      id: 2,
      title: "Building Sustainable Habits for Long-term Success",
      excerpt: "Learn the science-backed strategies for creating habits that stick.",
      authorName: "Marcus Johnson",
      communityName: "Productivity",
      voteCount: 1876,
      commentCount: 95,
      mediaUrl: "/productivity-habits.png",
    },
    {
      id: 3,
      title: "The Art of Minimalist Design in Modern Applications",
      excerpt: "Discover how less can be more when it comes to creating beautiful interfaces.",
      authorName: "Emma Williams",
      communityName: "Design",
      voteCount: 1543,
      commentCount: 67,
      mediaUrl: "/minimalist-design.png",
    },
  ]

  const trendingTopics = (Array.isArray(trendingTopicsData?.data?.topics) && trendingTopicsData.data.topics.length > 0)
    ? trendingTopicsData.data.topics.slice(0, 6).map(t => ({
        name: t.topic,
        posts: t.mentionCount || 0
      }))
    : [
        { name: "Artificial Intelligence", posts: 12453 },
        { name: "Web Development", posts: 9876 },
        { name: "Productivity", posts: 7654 },
        { name: "Design Systems", posts: 5432 },
        { name: "Career Growth", posts: 4321 },
      ]

  const communities = (Array.isArray(communitiesData?.content) && communitiesData.content.length > 0) ? communitiesData.content : [
    { name: "Tech Enthusiasts", memberCount: 45200, image: "/vibrant-tech-community.png" },
    { name: "Creative Writers", memberCount: 32100, image: "/writing-community.jpg" },
    { name: "Startup Founders", memberCount: 28900, image: "/vibrant-startup-community.png" },
    { name: "Design Hub", memberCount: 25600, image: "/vibrant-design-community.png" },
  ]
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden border-b border-border bg-background py-20 sm:py-28 lg:py-36 cursor-default animate-fade-in"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent dark:from-purple-900/10" />

        {/* Interactive Floating Background Objects (Antigravity Space) */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Glowing Orbs */}
            <div
              className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-drift-slow transition-transform duration-700 ease-out"
              style={{
                transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`
              }}
            />
            <div
              className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-drift-reverse transition-transform duration-700 ease-out"
              style={{
                transform: `translate(${mousePos.x * 35}px, ${mousePos.y * 35}px)`
              }}
            />

            {/* Cyber Grid Overlay */}
            <div className="absolute inset-0 hero-grid-pattern opacity-40 dark:opacity-60" />

            {/* Dynamic Physics Floating Cards */}
            {physicsItems.map((item) => {
              if (item.label === 'card1') {
                return (
                  <div
                    key={item.id}
                    className="absolute hidden xl:block glass-card p-4 rounded-xl shadow-2xl transition-all duration-100 ease-out"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `rotate(${item.r}deg)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                      <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400">Tech Trend</span>
                    </div>
                    <p className="text-xs font-semibold max-w-[140px] leading-snug">{item.text}</p>
                  </div>
                )
              }
              if (item.label === 'card2') {
                return (
                  <div
                    key={item.id}
                    className="absolute hidden xl:block glass-card p-4 rounded-xl shadow-2xl transition-all duration-100 ease-out"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `rotate(${item.r}deg)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[8px] py-0 px-1.5 bg-purple-500/20 text-purple-300 border-none">Design</Badge>
                    </div>
                    <p className="text-xs font-semibold max-w-[150px] leading-snug">{item.text}</p>
                  </div>
                )
              }
              if (item.type === 'join') {
                return (
                  <div
                    key={item.id}
                    className="absolute hidden xl:block glass-card p-3 rounded-full shadow-2xl transition-all duration-100 ease-out"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `rotate(${item.r}deg)`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-semibold">{item.text}</span>
                    </div>
                  </div>
                )
              }
              if (item.type === 'hashtag') {
                return (
                  <div
                    key={item.id}
                    className="absolute hidden xl:block glass-card p-3 rounded-xl shadow-2xl transition-all duration-100 ease-out"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `rotate(${item.r}deg)`,
                    }}
                  >
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{item.text}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center relative z-10">
            <Badge className="mb-6 py-1.5 px-4 glass-card border-purple-500/30 text-purple-600 dark:text-purple-300 hover:border-purple-500/60 transition-all duration-300 animate-pulse" variant="outline">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-purple-500 text-purple-500" /> Over 50,000 community members on WolfDire
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl select-none">
              <span className="relative inline-block hover:scale-[1.03] transition-transform duration-300 cursor-default">
                Join the Pack.
              </span>{" "}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-500 to-pink-500 dark:from-purple-400 dark:via-violet-400 dark:to-pink-400 text-glow">
                Find Your Tribe
              </span>
            </h1>

            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl leading-relaxed">
              A community-driven platform where ideas thrive, communities flourish, and voices are heard.
              Share, discuss, upvote, and discover content that matters to you.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 border-none">
                <Link href="/signup" className="flex items-center justify-center">
                  Join WolfDire
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass-card border-border hover:bg-muted/30 hover:-translate-y-0.5 transition-all duration-300">
                <Link href="/explore">Explore Stories</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:text-foreground hover:scale-105 transition-all duration-300">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="font-semibold">50K+ Members</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:text-foreground hover:scale-105 transition-all duration-300">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">500+ Communities</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:text-foreground hover:scale-105 transition-all duration-300">
                <Zap className="h-4 w-4 text-pink-500" />
                <span className="font-semibold">Discussions & Posts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="border-b border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
                <TrendingUp className="mr-1 h-3 w-3 animate-pulse" /> Featured
              </Badge>
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">Editor's Pick</h2>
            </div>
            <Button asChild variant="ghost" className="hover:text-purple-500">
              <Link href="/explore" className="flex items-center">
                View All <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Main Featured */}
            <Card className="group relative overflow-hidden rounded-2xl border border-purple-500/10 bg-black min-h-[440px] flex flex-col justify-end hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0">
                <img
                  src={trendingPosts[0].mediaUrl || "/futuristic-web-development.png"}
                  alt={trendingPosts[0].title}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              
              <div className="relative p-6 sm:p-8 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-500/25 text-purple-300 border border-purple-500/30">
                    {trendingPosts[0].communityName}
                  </Badge>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight group-hover:text-purple-300 transition-colors">
                  <Link href={`/post/${trendingPosts[0].id}`}>{trendingPosts[0].title}</Link>
                </h3>
                
                <p className="mt-3 text-sm text-purple-100/70 leading-relaxed line-clamp-2 max-w-xl">
                  {trendingPosts[0].excerpt}
                </p>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-white/20">
                      <AvatarFallback className="bg-purple-900 text-purple-200">
                        {trendingPosts[0].authorName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">{trendingPosts[0].authorName || "Anonymous"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-purple-200">
                    <span className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                      <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> {trendingPosts[0].voteCount || 0}
                    </span>
                    <span className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                      <MessageCircle className="h-3.5 w-3.5 text-blue-400" /> {trendingPosts[0].commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Secondary Featured */}
            <div className="flex flex-col gap-5">
              {trendingPosts.slice(1).map((post) => (
                <Card key={post.id} className="group flex overflow-hidden border border-purple-500/10 bg-card/40 hover:bg-card/75 hover:border-purple-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl">
                  <div className="relative aspect-video w-36 shrink-0 overflow-hidden sm:w-48 bg-black">
                    <img
                      src={post.mediaUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                  </div>
                  
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] py-0.5 px-2 bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {post.communityName}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-purple-500 transition-colors line-clamp-2 text-sm sm:text-base leading-snug">
                        <Link href={`/post/${post.id}`}>{post.title}</Link>
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 border-t border-border/40 pt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            {post.authorName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground font-medium">{post.authorName || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                        <span className="flex items-center gap-0.5"><Heart className="h-3 w-3 text-red-500" /> {post.voteCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending & Communities */}
      <section className="py-16 sm:py-20 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Trending Topics */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-purple-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-foreground">Trending Topics</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {trendingTopics.map((topic, index) => (
                  <Link
                    key={topic.name}
                    href={`/topic/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group"
                  >
                    <Card className="flex items-center justify-between p-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-lg hover:shadow-purple-500/5 glass-card">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-purple-500/20">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-purple-500 transition-colors">
                            {topic.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{topic.posts.toLocaleString()} posts</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500 animate-pulse" />
                  <h2 className="text-2xl font-bold text-foreground">Communities</h2>
                </div>
                <Button asChild variant="ghost" size="sm" className="hover:text-purple-500">
                  <Link href="/communities">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {communities.map((community) => (
                  <Link key={community.name} href={`/community/${community.id || community.slug || community.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Card className="flex items-center gap-4 p-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-lg hover:shadow-purple-500/5 glass-card">
                      <Avatar className="h-12 w-12 border border-purple-500/20">
                        <AvatarImage src={community.imageUrl || community.image || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-purple-900 text-purple-200">{community.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-purple-500 transition-colors">{community.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{(community.memberCount || community.members || 0).toLocaleString()} members</p>
                      </div>
                      <Button size="sm" variant="secondary" className="hover:bg-purple-600 hover:text-white transition-all duration-300">
                        Join
                      </Button>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Community CTA */}
      <section className="border-y border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-blue-950 p-8 sm:p-12 lg:p-16 border border-purple-500/20 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
            <div className="relative mx-auto max-w-2xl text-center">
              <Badge className="mb-4 bg-purple-500/20 text-purple-200 border border-purple-500/30 hover:bg-purple-500/30">
                Community Moderators
              </Badge>
              <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
                Lead Your Community
              </h2>
              <p className="mt-4 text-pretty text-lg text-purple-200/80 leading-relaxed">
                Create and moderate communities around topics you're passionate about. Build engaged communities,
                foster discussions, and shape conversations that matter.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild className="hover:-translate-y-0.5 transition-all duration-300">
                  <Link href="/become-author">
                    Create Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent hover:-translate-y-0.5 transition-all duration-300"
                  asChild
                >
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Members", value: "50K+", icon: Users },
              { label: "Posts & Comments", value: "500K+", icon: BookOpen },
              { label: "Monthly Active Users", value: "2M+", icon: TrendingUp },
              { label: "Communities", value: "500+", icon: Heart },
            ].map((stat, index) => (
              <Card key={stat.label} className="p-6 text-center glass-card hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300">
                <stat.icon className="mx-auto h-8 w-8 text-purple-500 mb-4 animate-float-1" style={{ animationDelay: `${index * 0.5}s` }} />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

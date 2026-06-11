"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { postApi, communityApi, analyticsApi } from "@/lib/api-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, TrendingUp, Users, BookOpen, Zap, Heart, MessageCircle, Star, Loader2, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-dynamic"

export default function HomePage() {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Clean, Professional Hero Section */}
      <section className="border-b border-border bg-card/50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1 text-sm font-medium">
            Over 50,000 active members
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Find your <span className="text-primary">Tribe</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A clean, distraction-free space to share ideas, discuss topics, and build communities. No algorithms, just pure community-driven content.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold">
              <Link href="/signup">Join WolfDire</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
              <Link href="/explore">Explore Communities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Layout - Social Media Style (Feed + Sidebar) */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Column: Trending Feed */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Trending Posts
                </h2>
              </div>

              <div className="space-y-4">
                {trendingPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden border border-border shadow-sm hover:shadow transition-shadow">
                    <div className="p-4 sm:p-5">
                      {/* Post Header */}
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">{post.communityName?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground hover:underline cursor-pointer">c/{post.communityName}</span>
                        <span>•</span>
                        <span>Posted by u/{post.authorName}</span>
                      </div>

                      {/* Post Body */}
                      <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
                            <Link href={`/post/${post.id}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        </div>
                        {post.mediaUrl && (
                          <div className="hidden sm:block shrink-0 w-32 h-24 rounded-md overflow-hidden bg-muted border border-border">
                            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5 bg-secondary/50 hover:bg-secondary rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer">
                          <Heart className="h-4 w-4" />
                          <span>{post.voteCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-secondary/50 hover:bg-secondary rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.commentCount} Comments</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar (Topics & Communities) */}
            <div className="w-full lg:w-80 space-y-8">

              {/* Communities Widget */}
              <Card className="border border-border shadow-sm">
                <div className="p-4 border-b border-border bg-muted/20">
                  <h3 className="font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Top Communities
                  </h3>
                </div>
                <div className="p-0">
                  {communities.map((community, idx) => (
                    <div key={community.name} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium text-muted-foreground w-4">{idx + 1}</span>
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{community.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <Link href={`/community/${community.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm font-semibold text-foreground hover:underline truncate">
                            c/{community.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">{(community.memberCount || 0).toLocaleString()} members</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="h-7 px-3 text-xs rounded-full">Join</Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-muted/20 border-t border-border">
                  <Button variant="ghost" className="w-full text-sm font-medium text-primary hover:bg-primary/10">View All Communities</Button>
                </div>
              </Card>

              {/* Trending Topics Widget */}
              <Card className="border border-border shadow-sm">
                <div className="p-4 border-b border-border bg-muted/20">
                  <h3 className="font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    Trending Topics
                  </h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Link key={topic.name} href={`/topic/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm font-normal">
                        {topic.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Simple Footer/Links Widget */}
              <div className="text-xs text-muted-foreground space-y-4 px-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <Link href="/about" className="hover:underline">About</Link>
                  <Link href="/careers" className="hover:underline">Careers</Link>
                  <Link href="/terms" className="hover:underline">Terms</Link>
                  <Link href="/privacy" className="hover:underline">Privacy</Link>
                </div>
                <p>WolfDire © 2026. All rights reserved.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/20 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about WolfDire and how it works.</p>
          </div>
          <Card className="border border-border shadow-sm p-2 sm:p-6 bg-card">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold hover:text-primary">What is WolfDire?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  WolfDire is a community-driven platform where people can share ideas, discuss niche topics, and build thriving communities without the distraction of algorithms. Think of it as the front page for your specific interests.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold hover:text-primary">How do I create a community?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Creating a community is easy! Once you create an account and verify your email, simply navigate to the "Explore" page and click on "Create Community". From there, you can set the rules, upload a banner, and start inviting members.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold hover:text-primary">Is WolfDire free to use?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, joining communities, posting, and participating in discussions is completely free. We do offer premium features for advanced community management, but the core experience will always remain free.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold hover:text-primary">How is content moderated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Each community is moderated by its creators and appointed moderators. We also have global platform guidelines to ensure a safe, respectful environment. Users can report posts that violate these guidelines for review by our admin team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </section>
    </div>
  )
}

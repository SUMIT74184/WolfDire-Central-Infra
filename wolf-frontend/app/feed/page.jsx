"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  BookmarkPlus,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  Filter,
  Loader2,
  Compass,
  ArrowUp
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { feedApi, postApi } from "@/lib/api-client"

export default function FeedPage() {
  const [sortBy, setSortBy] = useState("latest")

  // Try personalized feed first
  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: () => feedApi.getFeed(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  })

  // Fallback: trending posts (always loaded in background)
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-fallback'],
    queryFn: () => postApi.trending(0, 20),
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  })

  // Personalized feed items (from FeedSvc)
  const feedItems = feedData
    ? (Array.isArray(feedData) ? feedData : feedData.items || feedData.content || [])
    : []

  // Trending posts (from PostSvc) — used as fallback
  const trendingPosts = trendingData
    ? (Array.isArray(trendingData) ? trendingData : trendingData.content || [])
    : []

  // Decide which data to show
  const hasFeedItems = feedItems.length > 0
  const isLoading = feedLoading || (feedItems.length === 0 && trendingLoading)

  // Normalize feed items from FeedSvc format
  const normalizedFeedItems = feedItems.map(item => ({
    id: item.postId || item.id,
    title: item.title || "Untitled",
    excerpt: item.content ? item.content.substring(0, 150) + "..." : "",
    community: item.communityId || "General",
    author: { name: item.authorId || "Unknown", avatar: null },
    likes: Math.round((item.popularityScore || 0) * 100),
    comments: 0,
    image: item.mediaUrl || "/placeholder.svg",
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    isFeed: true,
  }))

  // Normalize trending posts from PostSvc format
  const normalizedTrending = trendingPosts.map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    excerpt: p.content ? p.content.substring(0, 150) + "..." : "",
    community: p.communityName || p.communityId || "General",
    author: { name: p.username || p.authorId || "Unknown", avatar: null },
    likes: (p.upvotes || p.upVotes || 0) - (p.downvotes || p.downVotes || 0),
    comments: p.commentCount || 0,
    image: p.mediaUrl || p.thumbnailUrl || "/placeholder.svg",
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    isFeed: false,
  }))

  const posts = hasFeedItems ? normalizedFeedItems : normalizedTrending

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Feed Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Feed</h1>
          <p className="mt-2 text-muted-foreground">
            {hasFeedItems
              ? "Personalized posts from communities you follow"
              : "Discover trending posts — follow people and communities to personalize your feed"}
          </p>
          {!hasFeedItems && !feedLoading && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <Compass className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Showing trending posts while your feed is being built.{" "}
                <Link href="/communities" className="text-primary underline underline-offset-2">
                  Join communities
                </Link>{" "}
                to see personalized content here.
              </p>
            </div>
          )}
        </div>

        {/* Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={sortBy} onValueChange={setSortBy} className="w-full sm:w-auto">
            <TabsList className="bg-card">
              <TabsTrigger value="latest" className="gap-1">
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-1">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="top" className="gap-1">
                <Heart className="h-4 w-4" />
                Top
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="bg-transparent gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Compass className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">Nothing to show yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Join communities and follow users to build your feed.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button asChild>
                  <Link href="/communities">Browse Communities</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/explore">Explore Posts</Link>
                </Button>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="border-border hover:border-primary/50 transition-colors overflow-hidden"
              >
                <div className="flex">
                  {/* Voting Sidebar */}
                  <div className="flex w-12 flex-col items-center justify-start bg-muted py-3 gap-1">
                    <button className="rounded hover:bg-secondary p-1 transition-colors">
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <span className="py-0.5 text-xs font-semibold text-foreground">
                      {post.likes}
                    </span>
                    <button className="rounded hover:bg-secondary p-1 transition-colors">
                      <ArrowUp className="h-4 w-4 text-muted-foreground rotate-180" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-4">
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      {post.image && post.image !== "/placeholder.svg" && (
                        <div className="hidden sm:block shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-20 w-20 rounded object-cover"
                          />
                        </div>
                      )}

                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 flex-wrap">
                          <span className="font-semibold text-foreground">c/{post.community}</span>
                          <span>·</span>
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={post.author?.avatar} />
                            <AvatarFallback className="text-[9px]">
                              {post.author?.name?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{post.author?.name || "Unknown"}</span>
                          {post.date && <><span>·</span><span>{post.date}</span></>}
                        </div>

                        <Link href={`/post/${post.id}`}>
                          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors mb-1 line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{post.comments} comments</span>
                          </button>
                          <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                            <BookmarkPlus className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </button>
                          <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full bg-transparent">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

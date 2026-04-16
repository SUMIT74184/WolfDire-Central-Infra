"use client"

import { useState, useEffect } from "react"
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
  Loader2
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { feedApi } from "@/lib/api-client"

export default function FeedPage() {
  const [sortBy, setSortBy] = useState("latest")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      try {
        setIsLoading(true)
        const response = await feedApi.getFeed()
        const fetchedPosts = Array.isArray(response) ? response : response.content || []
        setPosts(fetchedPosts)
      } catch (err) {
        console.error("Failed to fetch feed:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeed()
  }, [sortBy])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Feed Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Feed</h1>
          <p className="mt-2 text-muted-foreground">Personalized posts from communities you follow</p>
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
            <div className="py-12 text-center text-muted-foreground">
              <p>No posts in your feed yet.</p>
            </div>
          ) : (
            posts.map((post) => (
            <Card
              key={post.id}
              className="border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              <div className="flex">
                {/* Voting Sidebar */}
                <div className="flex w-12 flex-col items-center justify-start bg-muted py-2">
                  <button className="rounded hover:bg-secondary p-1 transition-colors">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <span className="py-1 text-xs font-medium text-foreground">
                    {Math.floor(post.likes / 100)}
                  </span>
                  <button className="rounded hover:bg-secondary p-1 transition-colors">
                    <TrendingUp className="h-4 w-4 text-muted-foreground rotate-180" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-4">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="hidden sm:block">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-20 w-20 rounded object-cover"
                      />
                    </div>

                    {/* Post Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="font-semibold">c/{post.community}</span>
                        <span>Posted by</span>
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={post.author?.avatar} />
                          <AvatarFallback>{post.author?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span>{post.author?.name || 'Unknown'}</span>
                        <span>{post.date || 'Just now'}</span>
                      </div>

                      <Link href={`/post/${post.id}`}>
                        <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                          <BookmarkPlus className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        <button className="flex items-center gap-1 hover:bg-secondary rounded px-2 py-1 transition-colors">
                          <Share2 className="h-4 w-4" />
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
        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full bg-transparent">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  )
}

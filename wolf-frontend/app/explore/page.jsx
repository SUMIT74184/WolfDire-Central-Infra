"use client"
import { useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { postApi, communityApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, MessageCircle, BookmarkPlus, TrendingUp, Clock, Filter } from "lucide-react"

// Standard categories removed - fetching from communityApi instead


export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCommunityId, setSelectedCommunityId] = useState("All")
  const [sortBy, setSortBy] = useState("trending")

  const { data: communitiesData } = useQuery({
    queryKey: ['communities'],
    queryFn: () => communityApi.getAll(0, 100)
  })

  const communities = communitiesData ? (Array.isArray(communitiesData) ? communitiesData : communitiesData.content || []) : []

  const { data, isLoading: loading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery({
    queryKey: ['explore-posts', sortBy, selectedCommunityId, searchQuery],
    queryFn: ({ pageParam = 0 }) => {
      if (searchQuery) {
        return postApi.search(searchQuery, pageParam, 20)
      }
      
      if (selectedCommunityId !== "All") {
        if (sortBy === "trending") {
          return postApi.hot(selectedCommunityId, pageParam, 20)
        }
        return postApi.getCommunityPosts(selectedCommunityId, pageParam, 20)
      }

      if (sortBy === "trending") {
        return postApi.trending(pageParam, 20)
      }

      return postApi.list(pageParam, 20)
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage && !Array.isArray(lastPage) && lastPage.last 
      return (lastPage && !isLast) ? allPages.length : undefined
    }
  })

  const posts = data ? data.pages.flatMap(page => Array.isArray(page) ? page : page?.content || []).map((p, i) => ({
    id: p.id || i,
    title: p.title || "Untitled",
    excerpt: p.content ? p.content.substring(0, 150) + "..." : "",
    author: {
      name: p.username || "Unknown",
      avatar: "/diverse-user-avatars.png",
      role: "Member",
    },
    category: p.communityName || p.subredditName || "General",
    readTime: `${Math.max(1, Math.ceil((p.content?.length || 0) / 1000))} min read`,
    likes: p.upvotes || p.score || 0,
    comments: p.commentCount || 0,
    image: p.mediaUrl || p.thumbnailUrl || "/placeholder.svg",
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  })) : []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Communities & Posts</h1>
          <p className="mt-2 text-muted-foreground">Discover, discuss, and join communities that matter to you</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-border"
            />
          </div>
          <Tabs value={sortBy} onValueChange={setSortBy} className="w-full sm:w-auto">
            <TabsList className="bg-card">
              <TabsTrigger value="trending">Hot</TabsTrigger>
              <TabsTrigger value="latest">New</TabsTrigger>
              <TabsTrigger value="top">Top</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCommunityId === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCommunityId("All")}
            className={selectedCommunityId === "All" ? "rounded-full" : "rounded-full bg-transparent"}
          >
            All Communities
          </Button>
          {communities.map((community) => (
            <Button
              key={community.id}
              variant={selectedCommunityId === community.id.toString() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCommunityId(community.id.toString())}
              className={selectedCommunityId === community.id.toString() ? "rounded-full" : "rounded-full bg-transparent"}
            >
              c/{community.name}
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading posts...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedCommunityId("All")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Reddit-style Posts */}
            <div className="space-y-2">
              {posts.map((post) => (
                <Card key={post.id} className="border-border hover:border-primary/50 transition-colors overflow-hidden">
                  <div className="flex">
                    {/* Voting Sidebar */}
                    <div className="flex w-12 flex-col items-center justify-start bg-muted py-2">
                      <button className="rounded hover:bg-secondary p-1 transition-colors">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <span className="py-1 text-xs font-medium text-foreground">{Math.floor(post.likes / 100)}</span>
                      <button className="rounded hover:bg-secondary p-1 transition-colors">
                        <TrendingUp className="h-4 w-4 text-muted-foreground rotate-180" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 p-4">
                      <div className="flex gap-3">
                        <div className="hidden sm:block">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="h-20 w-20 rounded object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span className="font-semibold">c/{post.category}</span>
                            <span>Posted by</span>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.name}</span>
                            <span>{post.date}</span>
                          </div>

                          <Link href={`/post/${post.id}`}>
                            <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors mb-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>

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
                              <Heart className="h-4 w-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="mt-8 text-center">
                <Button variant="outline" className="rounded-full bg-transparent" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? "Loading..." : "Load More Posts"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


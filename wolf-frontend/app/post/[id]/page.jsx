"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Twitter,
  Facebook,
  Linkedin,
  LinkIcon,
  MoreHorizontal,
  ThumbsUp,
  Loader2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { postApi } from "@/lib/api-client"
import CommentSection from "@/components/CommentSection"
// Mock data removed in favor of dynamic API fetch



export default function PostPage() {
  const params = useParams()
  const postId = params?.id

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getById(postId),
    enabled: !!postId,
  })

  const { data: relatedData } = useQuery({
    queryKey: ['posts', 'related'],
    queryFn: () => postApi.list(0, 3),
  })

  // get dynamically fetched related posts based on recent posts
  const dynamicRelatedPosts = relatedData ? (Array.isArray(relatedData) ? relatedData : relatedData.content || []) : []
  const displayRelatedPosts = dynamicRelatedPosts.map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    author: p.author?.name || "Unknown",
    readTime: "5 min read",
    image: p.image || "/placeholder.svg",
  }))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-muted sm:h-[50vh]">
        <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <div className="-mt-32 relative z-10">
          <Badge variant="secondary" className="mb-4">
            {post.category || "Uncategorized"}
          </Badge>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight text-balance">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/author/${post.author?.name}`} className="font-medium text-foreground hover:text-primary">
                  {post.author?.name || 'Unknown Author'}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {post.date || 'Recently'} · {post.readTime || '5 min read'}
                </p>
              </div>
            </div>
            <Button
              variant={isFollowing ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <Link key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                <Badge variant="outline" className="hover:bg-secondary">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <article
          className="prose-blog mt-12 max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Actions */}
        <div className="mt-12 flex items-center justify-between border-y border-border py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              {(post.likes || 0) + (isLiked ? 1 : 0)}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              {post.comments || 0}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={isBookmarked ? "text-primary" : ""}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report Article</DropdownMenuItem>
                <DropdownMenuItem>Hide from Feed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Author Card */}
        <Card className="mt-8 border-border">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{post.author?.name || 'Unknown Author'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{post.author?.bio}</p>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>{(post.author?.followers || 0).toLocaleString()} followers</span>
                <span>{post.author?.articles || 0} articles</span>
              </div>
            </div>
            <Button variant={isFollowing ? "secondary" : "default"} onClick={() => setIsFollowing(!isFollowing)}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection postId={post.id} />

        {/* Related Posts */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {displayRelatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/post/${relatedPost.id}`}>
                <Card className="group overflow-hidden border-border">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {relatedPost.author} · {relatedPost.readTime}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

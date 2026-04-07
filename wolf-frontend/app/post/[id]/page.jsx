"use client"

import { useState } from "react"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const post = {
  id: 1,
  title: "The Future of Web Development: What to Expect in 2025",
  content: `
    <p>The landscape of web development is constantly evolving, and 2025 promises to bring exciting changes that will reshape how we build and interact with the web. From AI-powered development tools to new frameworks and paradigms, developers need to stay ahead of the curve to remain competitive.</p>
    
    <h2>The Rise of AI-Assisted Development</h2>
    <p>Artificial intelligence is no longer just a buzzword—it's becoming an integral part of the development workflow. AI-powered code completion, automated testing, and intelligent debugging tools are revolutionizing how developers write and maintain code.</p>
    <p>Tools like GitHub Copilot and ChatGPT have already demonstrated the potential of AI in development. In 2025, we can expect these tools to become even more sophisticated, offering context-aware suggestions and automating repetitive tasks that currently consume valuable developer time.</p>
    
    <h2>Server Components and the New React Paradigm</h2>
    <p>React Server Components have fundamentally changed how we think about building React applications. By moving more logic to the server, we can create faster, more efficient applications that provide better user experiences while reducing the JavaScript payload sent to the client.</p>
    <p>This shift towards server-side rendering with the benefits of component-based architecture is just the beginning. Expect to see more frameworks adopting similar patterns and pushing the boundaries of what's possible with modern web development.</p>
    
    <h2>The Edge Computing Revolution</h2>
    <p>Edge computing is transforming how we deploy and run applications. By moving computation closer to users, we can dramatically reduce latency and improve performance. Platforms like Vercel, Cloudflare Workers, and Deno Deploy are making edge deployment more accessible than ever.</p>
    
    <h2>Looking Ahead</h2>
    <p>The future of web development is bright, filled with opportunities for innovation and improvement. By staying informed about emerging trends and technologies, developers can position themselves at the forefront of this exciting evolution.</p>
  `,
  author: {
    name: "Sarah Chen",
    avatar: "/woman-developer.png",
    bio: "Senior Frontend Developer at TechCorp. Writing about web development, React, and the future of technology.",
    followers: 12500,
    articles: 47,
  },
  category: "Technology",
  readTime: "8 min read",
  likes: 2453,
  comments: 189,
  image: "/futuristic-web-development.png",
  date: "December 15, 2025",
  tags: ["Web Development", "AI", "React", "JavaScript", "Future Tech"],
}

const comments = [
  {
    id: 1,
    author: { name: "Alex Rivera", avatar: "/male-developer.png" },
    content:
      "Great article! I'm particularly excited about the AI-assisted development tools. They've already transformed my workflow.",
    date: "2 hours ago",
    likes: 45,
  },
  {
    id: 2,
    author: { name: "Jordan Lee", avatar: "/female-engineer-working.png" },
    content:
      "The section on Server Components really resonated with me. We've been migrating our app and the performance gains are incredible.",
    date: "4 hours ago",
    likes: 32,
  },
  {
    id: 3,
    author: { name: "Taylor Kim", avatar: "/tech-professional.png" },
    content: "Would love to see a follow-up article diving deeper into edge computing patterns!",
    date: "6 hours ago",
    likes: 18,
  },
]

const relatedPosts = [
  {
    id: 2,
    title: "Understanding Machine Learning: A Beginner's Guide",
    author: "David Park",
    readTime: "12 min read",
    image: "/machine-learning-concept.png",
  },
  {
    id: 3,
    title: "The Art of Minimalist Design in Modern Applications",
    author: "Emma Williams",
    readTime: "6 min read",
    image: "/minimalist-design.png",
  },
  {
    id: 4,
    title: "Building Sustainable Habits for Long-term Success",
    author: "Marcus Johnson",
    readTime: "5 min read",
    image: "/productivity-habits.png",
  },
]

export default function PostPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)

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
            {post.category}
          </Badge>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight text-balance">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/author/${post.author.name}`} className="font-medium text-foreground hover:text-primary">
                  {post.author.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {post.date} · {post.readTime}
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
            {post.tags.map((tag) => (
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
              {post.likes + (isLiked ? 1 : 0)}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              {post.comments}
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
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{post.author.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{post.author.bio}</p>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>{post.author.followers.toLocaleString()} followers</span>
                <span>{post.author.articles} articles</span>
              </div>
            </div>
            <Button variant={isFollowing ? "secondary" : "default"} onClick={() => setIsFollowing(!isFollowing)}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <div className="mt-6 flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="mt-2 flex justify-end">
                <Button disabled={!commentText.trim()}>Post Comment</Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="mt-8 space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{comment.author.name}</span>
                    <span className="text-sm text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="mt-1 text-foreground">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      {comment.likes}
                    </button>
                    <button className="text-sm text-muted-foreground hover:text-foreground">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
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

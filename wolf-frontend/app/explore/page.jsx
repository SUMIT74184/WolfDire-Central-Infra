"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { postApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, MessageCircle, BookmarkPlus, TrendingUp, Clock, Filter } from "lucide-react"

const categories = ["All", "Technology", "Design", "Productivity", "Business", "Lifestyle", "Science", "Health"]

const posts = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2025",
    excerpt:
      "Explore the upcoming trends in web development, from AI-powered tools to new frameworks that will shape how we build.",
    author: { name: "Sarah Chen", avatar: "/woman-developer.png", role: "Senior Developer" },
    category: "Technology",
    readTime: "8 min read",
    likes: 2453,
    comments: 189,
    image: "/futuristic-web-development.png",
    date: "Dec 15, 2025",
  },
  {
    id: 2,
    title: "Building Sustainable Habits for Long-term Success",
    excerpt: "Learn the science-backed strategies for creating habits that stick and transform your productivity.",
    author: { name: "Marcus Johnson", avatar: "/professional-man.png", role: "Life Coach" },
    category: "Productivity",
    readTime: "5 min read",
    likes: 1876,
    comments: 95,
    image: "/productivity-habits.png",
    date: "Dec 14, 2025",
  },
  {
    id: 3,
    title: "The Art of Minimalist Design in Modern Applications",
    excerpt: "Discover how less can be more when it comes to creating beautiful, user-friendly interfaces.",
    author: { name: "Emma Williams", avatar: "/woman-designer.png", role: "UX Designer" },
    category: "Design",
    readTime: "6 min read",
    likes: 1543,
    comments: 67,
    image: "/minimalist-design.png",
    date: "Dec 13, 2025",
  },
  {
    id: 4,
    title: "Understanding Machine Learning: A Beginner's Guide",
    excerpt: "Demystifying AI and machine learning concepts for developers who want to get started in the field.",
    author: { name: "David Park", avatar: "/asian-male-data-scientist.jpg", role: "ML Engineer" },
    category: "Technology",
    readTime: "12 min read",
    likes: 3241,
    comments: 234,
    image: "/ml-neural-network-visualization.png",
    date: "Dec 12, 2025",
  },
  {
    id: 5,
    title: "Remote Work: Building a Productive Home Office",
    excerpt:
      "Essential tips and setups for creating an environment that boosts your productivity while working from home.",
    author: { name: "Lisa Thompson", avatar: "/professional-interior-designer.png", role: "Interior Designer" },
    category: "Lifestyle",
    readTime: "7 min read",
    likes: 892,
    comments: 45,
    image: "/modern-home-office.png",
    date: "Dec 11, 2025",
  },
  {
    id: 6,
    title: "The Psychology of Color in Brand Design",
    excerpt: "How colors influence perception and emotion in branding, and how to use them effectively.",
    author: { name: "Michael Ross", avatar: "/creative-director-male.jpg", role: "Creative Director" },
    category: "Design",
    readTime: "9 min read",
    likes: 1234,
    comments: 78,
    image: "/color-psychology-brand-design.jpg",
    date: "Dec 10, 2025",
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("trending")
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await postApi.list(page, 20)
        const fetchedPosts = Array.isArray(response) ? response : response?.content || []
        setPosts(fetchedPosts.map((p, i) => ({
          id: p.id || i,
          title: p.title || "Untitled",
          excerpt: p.content ? p.content.substring(0, 150) + "..." : "",
          author: {
            name: p.username || "Unknown",
            avatar: "/diverse-user-avatars.png",
            role: "Member",
          },
          category: p.subredditName || "General",
          readTime: `${Math.max(1, Math.ceil((p.content?.length || 0) / 1000))} min read`,
          likes: p.upvotes || p.score || 0,
          comments: p.commentCount || 0,
          image: p.mediaUrl || p.thumbnailUrl || "/placeholder.svg",
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
        })))
      } catch (err) {
        setError(err.message || "Failed to load posts")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "rounded-full" : "rounded-full bg-transparent"}
            >
              {category === "All" ? "All Communities" : `c/${category}`}
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading posts...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Reddit-style Posts */}
            <div className="space-y-2">
              {filteredPosts.map((post) => (
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
            <div className="mt-8 text-center">
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setPage(p => p + 1)}>
                Load More Posts
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


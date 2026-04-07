"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, TrendingUp, Plus, CheckCircle } from "lucide-react"

const communities = [
  {
    id: 1,
    name: "Tech Enthusiasts",
    description:
      "A community for developers, engineers, and tech lovers to share knowledge and discuss the latest trends.",
    members: 45200,
    posts: 12450,
    image: "/vibrant-tech-community.png",
    tags: ["Programming", "Web Dev", "AI/ML"],
    isJoined: true,
    trending: true,
  },
  {
    id: 2,
    name: "Creative Writers",
    description: "Share your stories, get feedback, and connect with fellow writers passionate about the craft.",
    members: 32100,
    posts: 8920,
    image: "/writing-community.jpg",
    tags: ["Fiction", "Poetry", "Non-Fiction"],
    isJoined: false,
    trending: true,
  },
  {
    id: 3,
    name: "Startup Founders",
    description: "A hub for entrepreneurs to share experiences, seek advice, and collaborate on ventures.",
    members: 28900,
    posts: 6540,
    image: "/vibrant-startup-community.png",
    tags: ["Business", "Funding", "Growth"],
    isJoined: false,
    trending: false,
  },
  {
    id: 4,
    name: "Design Hub",
    description: "Explore design trends, share portfolios, and discuss UX/UI with fellow designers.",
    members: 25600,
    posts: 7890,
    image: "/vibrant-design-community.png",
    tags: ["UI/UX", "Branding", "Typography"],
    isJoined: true,
    trending: true,
  },
  {
    id: 5,
    name: "Data Science Guild",
    description: "Dive into data analysis, machine learning, and statistics with experts and enthusiasts.",
    members: 19800,
    posts: 4560,
    image: "/data-science-community.png",
    tags: ["Analytics", "Python", "Statistics"],
    isJoined: false,
    trending: false,
  },
  {
    id: 6,
    name: "Mindful Living",
    description: "Explore wellness, productivity, and personal growth with a supportive community.",
    members: 22400,
    posts: 5670,
    image: "/wellness-community.png",
    tags: ["Wellness", "Mindfulness", "Health"],
    isJoined: false,
    trending: false,
  },
]

const categories = ["All", "Technology", "Writing", "Business", "Design", "Science", "Lifestyle"]

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filter, setFilter] = useState("all")
  const [joinedCommunities, setJoinedCommunities] = useState(communities.filter((c) => c.isJoined).map((c) => c.id))

  const handleJoinToggle = (communityId) => {
    setJoinedCommunities((prev) =>
      prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId],
    )
  }

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "joined" && joinedCommunities.includes(community.id)) ||
      (filter === "trending" && community.trending)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Communities</h1>
              <p className="mt-2 text-muted-foreground">Join communities that match your interests</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="joined" className="gap-2">
                  <CheckCircle className="h-4 w-4" /> Joined
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="h-4 w-4" /> Trending
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "" : "bg-transparent"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <Card key={community.id} className="flex flex-col border-border overflow-hidden">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={community.image || "/placeholder.svg"}
                  alt={community.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                {community.trending && (
                  <Badge className="absolute right-3 top-3 gap-1">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Link href={`/community/${community.id}`} className="hover:text-primary transition-colors">
                    {community.name}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{community.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="flex flex-wrap gap-1">
                  {community.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {community.members.toLocaleString()}
                  </span>
                  <span>{community.posts.toLocaleString()} posts</span>
                </div>
                <Button
                  variant={joinedCommunities.includes(community.id) ? "secondary" : "default"}
                  size="sm"
                  onClick={() => handleJoinToggle(community.id)}
                >
                  {joinedCommunities.includes(community.id) ? "Joined" : "Join"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No communities found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

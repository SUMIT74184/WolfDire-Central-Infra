"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { communityApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Users, TrendingUp, Plus, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CommunitiesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filter, setFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const { data: rawCommunities, isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: () => communityApi.list(0, 50).then((res) => res.content || res),
  })

  // Normalize API data structure
  const communities = (Array.isArray(rawCommunities) ? rawCommunities : []).map(c => ({
    id: c.id,
    name: c.name || "Unknown",
    description: c.description || "No description",
    members: c.memberCount || 0,
    posts: 0,
    image: "/vibrant-tech-community.png",
    tags: [],
    isJoined: false, // Could track actual connection
    trending: false,
  }))

  const [joinedCommunities, setJoinedCommunities] = useState([])

  const createMutation = useMutation({
    mutationFn: communityApi.create,
    onSuccess: () => {
      toast.success("Community created successfully!")
      setIsDialogOpen(false)
      setFormData({ name: "", description: "" })
      queryClient.invalidateQueries({ queryKey: ["communities"] })
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create community")
    },
  })

  const followMutation = useMutation({
    mutationFn: communityApi.follow,
    onSuccess: (_, communityId) => {
      setJoinedCommunities((prev) => 
        prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId]
      )
      toast.success("Follow updated successfully!")
      // optionally trigger refetch: queryClient.invalidateQueries({ queryKey: ["communities"] })
    },
    onError: (err) => toast.error(err?.message || "Could not join community")
  })

  const handleJoinToggle = (communityId) => {
    followMutation.mutate(communityId)
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Community
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new Community</DialogTitle>
                  <DialogDescription>
                    Build a space for people to share and connect.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="e.g. Technology"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="What is this community about?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={createMutation.isPending || !formData.name}
                    onClick={() => createMutation.mutate(formData)}
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
                  disabled={followMutation.isPending}
                >
                  {joinedCommunities.includes(community.id) ? "Joined" : "Join"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        )}

        {!isLoading && filteredCommunities.length === 0 && (
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

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, TrendingUp, Users, BookOpen, Zap, Heart, MessageCircle, Star } from "lucide-react"

const featuredPosts = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2025",
    excerpt:
      "Explore the upcoming trends in web development, from AI-powered tools to new frameworks that will shape how we build for the web.",
    author: { name: "Sarah Chen", avatar: "/woman-developer.png", role: "Senior Developer" },
    category: "Technology",
    readTime: "8 min read",
    likes: 2453,
    comments: 189,
    image: "/futuristic-web-development.png",
    featured: true,
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
  },
]

const trendingTopics = [
  { name: "Artificial Intelligence", posts: 12453 },
  { name: "Web Development", posts: 9876 },
  { name: "Productivity", posts: 7654 },
  { name: "Design Systems", posts: 5432 },
  { name: "Career Growth", posts: 4321 },
]

const communities = [
  { name: "Tech Enthusiasts", members: 45200, image: "/vibrant-tech-community.png" },
  { name: "Creative Writers", members: 32100, image: "/writing-community.jpg" },
  { name: "Startup Founders", members: 28900, image: "/vibrant-startup-community.png" },
  { name: "Design Hub", members: 25600, image: "/vibrant-design-community.png" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6" variant="secondary">
              <Star className="mr-1 h-3 w-3" /> Over 50,000 community members on WolfDire
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Join the Pack
              <span className="text-primary"> Find Your Tribe</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl leading-relaxed">
              A community-driven platform where ideas thrive, communities flourish, and voices are heard.
              Share, discuss, upvote, and discover content that matters to you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Join WolfDire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/explore">Explore Stories</Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50K+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>500+ Communities</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Discussions & Posts</span>
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
              <Badge variant="outline" className="mb-2">
                <TrendingUp className="mr-1 h-3 w-3" /> Featured
              </Badge>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Editor's Pick</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/explore">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Main Featured */}
            <Card className="group overflow-hidden border-border">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={featuredPosts[0].image || "/placeholder.svg"}
                  alt={featuredPosts[0].title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{featuredPosts[0].category}</Badge>
                  <span className="text-sm text-muted-foreground">{featuredPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/post/${featuredPosts[0].id}`}>{featuredPosts[0].title}</Link>
                </h3>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">{featuredPosts[0].excerpt}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={featuredPosts[0].author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{featuredPosts[0].author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{featuredPosts[0].author.name}</p>
                    <p className="text-xs text-muted-foreground">{featuredPosts[0].author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4" /> {featuredPosts[0].likes}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <MessageCircle className="h-4 w-4" /> {featuredPosts[0].comments}
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Secondary Featured */}
            <div className="flex flex-col gap-6">
              {featuredPosts.slice(1).map((post) => (
                <Card key={post.id} className="group flex overflow-hidden border-border">
                  <div className="aspect-square w-32 shrink-0 overflow-hidden sm:w-48">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/post/${post.id}`}>{post.title}</Link>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{post.author.name}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending & Communities */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Trending Topics */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Trending Topics</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {trendingTopics.map((topic, index) => (
                  <Link
                    key={topic.name}
                    href={`/topic/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group"
                  >
                    <Card className="flex items-center gap-3 p-4 transition-colors hover:border-primary">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {topic.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{topic.posts.toLocaleString()} posts</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Communities</h2>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/communities">View All</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {communities.map((community) => (
                  <Link key={community.name} href={`/community/${community.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Card className="flex items-center gap-4 p-4 transition-colors hover:border-primary">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={community.image || "/placeholder.svg"} />
                        <AvatarFallback>{community.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{community.name}</p>
                        <p className="text-sm text-muted-foreground">{community.members.toLocaleString()} members</p>
                      </div>
                      <Button size="sm" variant="secondary">
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
      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />
            <div className="relative mx-auto max-w-2xl text-center">
              <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                Community Moderators
              </Badge>
              <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
                Lead Your Community
              </h2>
              <p className="mt-4 text-pretty text-lg text-primary-foreground/80 leading-relaxed">
                Create and moderate communities around topics you're passionate about. Build engaged communities,
                foster discussions, and shape conversations that matter.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/become-author">
                    Create Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
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
            ].map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary mb-4" />
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

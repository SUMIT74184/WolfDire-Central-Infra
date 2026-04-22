"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Eye, MessageSquare, Download } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const data = await analyticsApi.dashboard()
        setDashboardData(data)
      } catch (err) {
        setError(err.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const growthData = dashboardData?.growthData || [
    { month: "Jan", users: 12400, posts: 2400, views: 24000 },
    { month: "Feb", users: 18900, posts: 3200, views: 38000 },
    { month: "Mar", users: 22100, posts: 4500, views: 52000 },
    { month: "Apr", users: 28900, posts: 5900, views: 78000 },
    { month: "May", users: 35450, posts: 7200, views: 98000 },
    { month: "Jun", users: 42300, posts: 8900, views: 124000 },
  ]

  const dailyStats = [
    { day: "Mon", visitors: 4200, engagement: 240, posts: 120 },
    { day: "Tue", visitors: 5100, engagement: 320, posts: 145 },
    { day: "Wed", visitors: 4800, engagement: 280, posts: 135 },
    { day: "Thu", visitors: 6200, engagement: 390, posts: 165 },
    { day: "Fri", visitors: 7100, engagement: 420, posts: 189 },
    { day: "Sat", visitors: 5900, engagement: 350, posts: 156 },
    { day: "Sun", visitors: 4400, engagement: 260, posts: 125 },
  ]

  const topCommunities = [
    { name: "Technology", value: 18500 },
    { name: "Design", value: 12300 },
    { name: "Business", value: 9800 },
    { name: "Lifestyle", value: 7400 },
    { name: "Other", value: 4200 },
  ]

  const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"]

  const metrics = [
    {
      label: "Total Page Views",
      value: "2.4M",
      change: "+12.5%",
      icon: Eye,
    },
    {
      label: "User Engagement",
      value: "68.2%",
      change: "+4.8%",
      icon: Users,
    },
    {
      label: "Posts Created",
      value: "18.2K",
      change: "+9.3%",
      icon: MessageSquare,
    },
    {
      label: "Growth Rate",
      value: "23.4%",
      change: "+2.1%",
      icon: TrendingUp,
    },
  ]

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading analytics...</div>
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and user insights</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <div className="inline-flex rounded-lg bg-primary/10 p-2">
                  <metric.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600 mt-2">{metric.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="daily">Daily Activity</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>6-Month Growth Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                    <Line type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                    <Line type="monotone" dataKey="views" stroke="#d946ef" strokeWidth={2} dot={{ fill: "#d946ef" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                    <Bar dataKey="visitors" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="engagement" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Top Communities by Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topCommunities} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {topCommunities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Communities Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Community Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCommunities.map((community, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="font-medium">{community.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{community.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Active members</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

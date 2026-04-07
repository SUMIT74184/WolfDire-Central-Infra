"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  FileText,
  Eye,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  DollarSign,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { LLMModelSelector } from "@/components/llm-model-selector"

const adminStats = [
  { name: "Total Users", value: "52,489", change: "+12.5%", icon: Users },
  { name: "Total Articles", value: "198,432", change: "+8.2%", icon: FileText },
  { name: "Total Views", value: "12.4M", change: "+23.1%", icon: Eye },
  { name: "Revenue", value: "$89,432", change: "+18.7%", icon: DollarSign },
]

const chartData = [
  { name: "Jan", users: 4000, articles: 2400 },
  { name: "Feb", users: 3000, articles: 1398 },
  { name: "Mar", users: 5000, articles: 3800 },
  { name: "Apr", users: 2780, articles: 2908 },
  { name: "May", users: 1890, articles: 3800 },
  { name: "Jun", users: 6390, articles: 4300 },
]

const pieData = [
  { name: "Technology", value: 400 },
  { name: "Design", value: 300 },
  { name: "Business", value: 200 },
  { name: "Lifestyle", value: 150 },
  { name: "Other", value: 100 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const pendingArticles = [
  {
    id: 1,
    title: "Introduction to Quantum Computing",
    author: { name: "John Smith", avatar: "/male-developer.png" },
    category: "Technology",
    submittedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "The Psychology of Design Systems",
    author: { name: "Emily Davis", avatar: "/woman-designer.png" },
    category: "Design",
    submittedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Scaling Your Startup: Lessons Learned",
    author: { name: "Mike Brown", avatar: "/professional-man.png" },
    category: "Business",
    submittedAt: "1 day ago",
  },
]

const recentUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "/woman-developer.png",
    role: "Author",
    status: "active",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus@example.com",
    avatar: "/professional-man.png",
    role: "Reader",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Williams",
    email: "emma@example.com",
    avatar: "/woman-designer.png",
    role: "Author",
    status: "pending",
  },
  {
    id: 4,
    name: "David Park",
    email: "david@example.com",
    avatar: "/asian-male-data-scientist.jpg",
    role: "Admin",
    status: "active",
  },
]

const reportedContent = [
  { id: 1, type: "Article", title: "Misleading Information About Health", reports: 15, severity: "high" },
  { id: 2, type: "Comment", title: "Spam comment on 'Web Dev Tips'", reports: 8, severity: "medium" },
  { id: 3, type: "User", title: "Suspicious account activity", reports: 5, severity: "low" },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground">Platform analytics and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Activity className="h-4 w-4" />
            View Reports
          </Button>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* LLM Model Selector */}
      <LLMModelSelector />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.name} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <Badge className="gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </Badge>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>User and article growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="articles" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
            <CardDescription>Distribution of published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation & Users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Articles */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Review</CardTitle>
              <CardDescription>Articles awaiting approval</CardDescription>
            </div>
            <Badge variant="secondary">{pendingArticles.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {article.author.name} · {article.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reported Content */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Items flagged for review</CardDescription>
            </div>
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {reportedContent.length} reports
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedContent.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          item.severity === "high"
                            ? "destructive"
                            : item.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.type}</span>
                    </div>
                    <h4 className="mt-1 font-medium text-foreground line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.reports} reports</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </div>
          <Button variant="outline" className="bg-transparent">
            View All Users
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

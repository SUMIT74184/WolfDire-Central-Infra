"use client"
import { useState, useEffect } from "react"
import { moderationApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Trash2, Eye, MessageSquare } from "lucide-react"

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState("flagged")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flaggedContent, setFlaggedContent] = useState([])

  useEffect(() => {
    async function fetchFlagged() {
      try {
        setLoading(true)
        const data = await moderationApi.getFlaggedQueue()
        const items = Array.isArray(data) ? data : data?.content || []
        setFlaggedContent(items.map((item, i) => ({
          id: item.id || i,
          type: item.contentType || "post",
          title: item.title || item.reason || "Flagged content",
          author: item.reportedUser || `User #${item.authorId || "unknown"}`,
          reports: item.reportCount || 1,
          severity: item.severity || "medium",
          reason: item.reason || "Reported",
          date: item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "",
        })))
      } catch (err) {
        setError(err.message || "Failed to load moderation queue")
        // Fallback to mock data
        setFlaggedContent([
          { id: 1, type: "post", title: "Misleading Health Information", author: "User #2456", reports: 15, severity: "high", reason: "Misinformation", date: "2024-04-05" },
          { id: 2, type: "comment", title: "Spam Comments on Tech Article", author: "User #3421", reports: 8, severity: "medium", reason: "Spam", date: "2024-04-04" },
          { id: 3, type: "post", title: "Inappropriate Content", author: "User #1234", reports: 12, severity: "high", reason: "Inappropriate", date: "2024-04-03" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchFlagged()
  }, [])

  const handleApprove = async (id) => {
    try {
      await moderationApi.approveContent(String(id))
      setFlaggedContent(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Failed to approve:", err)
    }
  }

  const handleReject = async (id) => {
    try {
      await moderationApi.rejectContent(String(id))
      setFlaggedContent(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Failed to reject:", err)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading moderation queue...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-muted-foreground">Review and manage flagged content and user violations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Medium Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              Banned Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Total banned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="users">Banned Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Flagged Content Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.author}</TableCell>
                        <TableCell className="text-sm">{item.reason}</TableCell>
                        <TableCell>{item.reports}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(item.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleReject(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Banned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "user_1", name: "User #2456", reason: "Spam/Harassment", date: "2024-04-01" },
                  { id: "user_2", name: "User #3789", reason: "Misinformation", date: "2024-03-28" },
                  { id: "user_3", name: "User #5012", reason: "Inappropriate Content", date: "2024-03-25" },
                ].map((user) => (
                  <div key={user.id} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <p className="text-sm text-muted-foreground">{user.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-2">{user.date}</div>
                      <Button size="sm" variant="outline">
                        Unban
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Moderation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, title: "Weekly Moderation Summary", generated: "2024-04-05" },
                  { id: 2, title: "User Behavior Analysis", generated: "2024-04-04" },
                  { id: 3, title: "Content Quality Report", generated: "2024-04-01" },
                ].map((report) => (
                  <div key={report.id} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0">
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <p className="text-sm text-muted-foreground">Generated {report.generated}</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

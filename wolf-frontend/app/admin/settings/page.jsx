"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Key, Lock, Bell, Database } from "lucide-react"

export default function AdminSettingsPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Content Moderation Agent",
      key: "sk_test_4eC39HqLyjWDarht",
      status: "active",
      created: "2024-01-15",
      lastUsed: "2024-04-05",
    },
    {
      id: 2,
      name: "Email Service Integration",
      key: "sk_test_9dE52RtKzDjbcde",
      status: "active",
      created: "2024-02-10",
      lastUsed: "2024-04-04",
    },
    {
      id: 3,
      name: "Analytics Agent",
      key: "sk_test_2fB18RmJzDjcfgh",
      status: "inactive",
      created: "2024-03-01",
      lastUsed: "2024-03-28",
    },
  ])

  const [newApiKey, setNewApiKey] = useState({ name: "", type: "moderation" })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and integrations</p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Settings className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>API Keys Management</CardTitle>
              <CardDescription>Manage API keys for third-party integrations and agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Key Form */}
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <h4 className="font-semibold text-foreground">Add New API Key</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    placeholder="Agent/Service Name"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  />
                  <select
                    value={newApiKey.type}
                    onChange={(e) => setNewApiKey({ ...newApiKey, type: e.target.value })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  >
                    <option value="moderation">Moderation Agent</option>
                    <option value="analytics">Analytics Agent</option>
                    <option value="email">Email Service</option>
                    <option value="payment">Payment Service</option>
                    <option value="other">Other</option>
                  </select>
                  <Button>Generate Key</Button>
                </div>
              </div>

              {/* Existing Keys Table */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Active Keys</h4>
                {apiKeys.map((key) => (
                  <Card key={key.id} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{key.name}</span>
                            <Badge className={key.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
                              {key.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <code className="bg-background px-2 py-1 rounded text-sm text-muted-foreground">{key.key}****</code>
                            <Button variant="ghost" size="sm">
                              Copy
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {key.created} · Last used: {key.lastUsed}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Rotate
                          </Button>
                          <Button variant="destructive" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>AI Agents Configuration</CardTitle>
              <CardDescription>Configure and manage AI agents for content moderation and analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  name: "Content Moderation Agent",
                  description: "Automatically detects and flags inappropriate content",
                  status: "enabled",
                  apiKey: "sk_test_4eC39HqLyjWDarht",
                },
                {
                  name: "Spam Detection Agent",
                  description: "Identifies spam posts and comments in real-time",
                  status: "enabled",
                  apiKey: "sk_test_5dE52RtKzDjbcde",
                },
                {
                  name: "Misinformation Checker",
                  description: "Flags potentially false or misleading information",
                  status: "disabled",
                  apiKey: "sk_test_6dE52RtKzDjbcde",
                },
                {
                  name: "User Behavior Analyzer",
                  description: "Analyzes user behavior patterns for suspicious activity",
                  status: "enabled",
                  apiKey: "sk_test_7dE52RtKzDjbcde",
                },
              ].map((agent) => (
                <Card key={agent.name} className="border-border bg-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-foreground">{agent.name}</span>
                          <Badge className={agent.status === "enabled" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                        <div className="text-xs text-muted-foreground">API Key: {agent.apiKey}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {agent.status === "enabled" ? "Disable" : "Enable"}
                        </Button>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alerts and notifications for admin actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "High-priority content flags", enabled: true },
                { label: "User ban notifications", enabled: true },
                { label: "Daily digest report", enabled: true },
                { label: "Weekly analytics summary", enabled: false },
              ].map((notification, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <label className="text-foreground">{notification.label}</label>
                  <input type="checkbox" defaultChecked={notification.enabled} className="rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <label className="font-medium text-foreground">Two-Factor Authentication</label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <label className="font-medium text-foreground">IP Whitelist</label>
                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <label className="font-medium text-foreground">Session Timeout</label>
                    <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">Admin Accounts</h4>
                <div className="space-y-3">
                  {[
                    { name: "Admin User", role: "Super Admin", status: "active" },
                    { name: "Moderator 1", role: "Content Moderator", status: "active" },
                    { name: "Moderator 2", role: "User Manager", status: "inactive" },
                  ].map((admin, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 bg-muted rounded">
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-muted-foreground">{admin.role}</div>
                      </div>
                      <Badge className={admin.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
                        {admin.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

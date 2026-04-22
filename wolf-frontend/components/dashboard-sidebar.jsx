"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  PenSquare,
  Bookmark,
  Heart,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react"

const userNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Articles", href: "/dashboard/articles", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Followers", href: "/dashboard/followers", icon: Users },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Liked", href: "/dashboard/liked", icon: Heart },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const adminNavigation = [
  { name: "Admin Overview", href: "/admin", icon: LayoutDashboard },
  { name: "All Articles", href: "/admin/articles", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Moderation", href: "/admin/moderation", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function DashboardSidebar({ isAdmin = false }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()
  const navigation = isAdmin ? adminNavigation : userNavigation

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        {!collapsed && (
          <span className="text-sm font-semibold text-foreground">{isAdmin ? "Admin Panel" : "Dashboard"}</span>
        )}
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-4">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full gap-2">
              <Link href="/write">
                <PenSquare className="h-4 w-4" />
                Write Article
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button asChild size="icon" className="w-full">
              <Link href="/write">
                <PenSquare className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="w-full" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}


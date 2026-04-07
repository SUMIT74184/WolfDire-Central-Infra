import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar isAdmin />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  )
}

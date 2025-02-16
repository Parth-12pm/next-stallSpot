// app/dashboard/page.tsx
"use client"

import { useAuth } from "@/hooks/useAuth"
import { OrganizerDashboard } from "@/components/dashboard/OrganizerDashboard"
import { VendorDashboard } from "@/components/dashboard/VendorDashboard"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { session, status } = useAuth()

  // Add this console.log for debugging
  console.log("Dashboard Session:", {
    status,
    role: session?.user?.role,
    user: session?.user,
  })

  if (status === "loading") {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  if (!session?.user?.role) {
    return null
  }

  // More explicit role check
  switch (session.user.role) {
    case "organizer":
      return <OrganizerDashboard user={session.user} />
    case "vendor":
      return <VendorDashboard user={session.user} />
    case "admin":
      return <AdminDashboard user={session.user} />
    default:
      return null
  }
}


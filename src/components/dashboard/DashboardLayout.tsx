"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Store, CreditCard } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { NavItem, ExtendedSession } from "./types"

const organizerNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview and key metrics",
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: CalendarDays,
    description: "Manage your exhibitions and events",
  },
  {
    title: "Vendor Applications",
    href: "/dashboard/applications",
    icon: Store,
    description: "Review and manage vendor applications",
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    description: "Track and manage all payments",
  },
]

const vendorNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your vendor dashboard",
  },
  {
    title: "My Bookings",
    href: "/dashboard/bookings",
    icon: Store,
    description: "View your booth bookings",
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: CalendarDays,
    description: "Manage your event applications",
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    description: "View and manage your payment history",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null
    status: "loading" | "authenticated" | "unauthenticated"
  }
  const pathname = usePathname()

  console.log("DashboardLayout Full Session:", {
    status,
    sessionData: session,
    userRole: session?.user?.role,
  })

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // No session or no user
  if (!session?.user) {
    return null
  }

  const userRole = session.user.role
  const isOrganizer = userRole === "organizer"
  const navItems = isOrganizer ? organizerNavItems : vendorNavItems
  const dashboardTitle = isOrganizer ? "Organizer Dashboard" : "Vendor Dashboard"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6">
            <div className="flex h-14 items-center">
              <h2 className="font-semibold">{dashboardTitle}</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.description}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg">
                      <Avatar>
                        <AvatarImage src={session.user.image || '/placeholder.svg'} alt={session.user.name || ''} />
                        <AvatarFallback>
                          {session.user.name
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="font-medium truncate">{session.user.name}</span>
                        <span className="text-xs text-muted-foreground">View profile</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem asChild>
                      <Link href="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4  bg-background px-6">
          <SidebarTrigger />
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}


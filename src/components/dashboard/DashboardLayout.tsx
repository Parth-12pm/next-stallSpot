// components/dashboard/DashboardLayout.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Store,
  Menu,
  CreditCard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProfileSection } from "./profile-section"
import type { NavItem, ExtendedSession } from "./types"


const organizerNavItems: NavItem[] = [
  { 
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Dashboard overview and key metrics'
  },
  { 
    title: 'Events',
    href: '/dashboard/events',
    icon: CalendarDays,
    description: 'Manage your exhibitions and events'
  },
  { 
    title: 'Vendor Applications',
    href: '/dashboard/applications',
    icon: Store,
    description: 'Review and manage vendor applications'
  },
  { 
    title: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    description: 'Track and manage all payments'
  }
];

const vendorNavItems: NavItem[] = [
  { 
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Your vendor dashboard'
  },
  { 
    title: 'My Bookings',
    href: '/dashboard/bookings',
    icon: Store,
    description: 'View your booth bookings'
  },
  { 
    title: 'Applications',
    href: '/dashboard/applications',
    icon: CalendarDays,
    description: 'Manage your event applications'
  },
  { 
    title: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    description: 'View and manage your payment history'
  }
];


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Use the configured session type
  const { data: session, status } = useSession() as { 
    data: ExtendedSession | null; 
    status: "loading" | "authenticated" | "unauthenticated" 
  };
  const pathname = usePathname();

  console.log("DashboardLayout Full Session:", {
    status,
    sessionData: session,
    userRole: session?.user?.role
  });

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // No session or no user
  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;
  const isOrganizer = userRole === 'organizer';
  const navItems = isOrganizer ? organizerNavItems : vendorNavItems;
  const dashboardTitle = isOrganizer ? 'Organizer Dashboard' : 'Vendor Dashboard';


  const NavList = ({ className }: { className?: string }) => (
    <nav className={cn("space-y-1", className)}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            "group relative"
          )}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Mobile Navigation Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden fixed bottom-4 right-4 z-50 shadow-lg"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex flex-col h-full py-4">
            <h2 className="font-semibold text-lg px-4 mb-2">{dashboardTitle}</h2>
            <div className="px-3">
              <NavList />
            </div>
            <ProfileSection user={session.user} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-card">
        <div className="flex h-14 items-center border-b px-6">
          <h2 className="font-semibold">{dashboardTitle}</h2>
        </div>
        <div className="flex-1 overflow-auto py-4 px-3">
          <NavList />
        </div>
        <ProfileSection user={session.user} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
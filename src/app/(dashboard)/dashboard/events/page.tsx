// src/app/(dashboard)/dashboard/events/page.tsx
'use client';

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventsTable } from "@/components/events/EventsTable";
import { EventsTable as AdminEventsTable } from "@/components/admin/EventsTable";


export default function EventsPage() {
  const { session } = useAuth();
  const isOrganizer = (session?.user as { role?: string })?.role === 'organizer';
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {isOrganizer ? 'Manage Events' : 'Browse Events'}
        </h1>
        {isOrganizer && (
          <Button asChild>
            <Link href="/dashboard/events/create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-md border">{isAdmin ? <AdminEventsTable /> : <EventsTable />}</div>
    </div>
  );
}
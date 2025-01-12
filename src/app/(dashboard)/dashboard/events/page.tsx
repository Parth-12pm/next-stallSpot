// src/app/(dashboard)/dashboard/events/page.tsx
'use client';

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const { session } = useAuth();
  const isOrganizer = (session?.user as { role?: string })?.role === 'organizer';

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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Events will be listed here */}
      </div>
    </div>
  );
}
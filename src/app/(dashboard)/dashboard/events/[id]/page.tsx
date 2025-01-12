// src/app/(dashboard)/dashboard/events/[id]/page.tsx
'use client';

import { useAuth } from "@/hooks/useAuth";
import EventPreview from "@/components/events/EventPreview";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from "lucide-react";
import Link from "next/link";


export default function EventDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { session } = useAuth();
  const isOrganizer = (session?.user as { role?: string })?.role === 'organizer';

  return (
    <div className="relative">
      {isOrganizer && (
        <div className="absolute right-6 top-6 flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/events/${params.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/events/${params.id}/stalls`}>
              <Settings className="w-4 h-4 mr-2" />
              Manage Stalls
            </Link>
          </Button>
        </div>
      )}
      <EventPreview eventId={params.id} />
    </div>
  );
}
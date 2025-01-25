// app/(main)/exhibitions/[id]/stalls/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StallForm from "@/components/events/StallForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Event, Stall } from "@/components/events/types/types";
import { useEffect, useState } from 'react';

export default function ExhibitionStallsPage() {
  const params = useParams(); // Use useParams hook instead
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Access id from params object
        const res = await fetch(`/api/exhibitions/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        if (data.status !== 'published') {
          router.push('/exhibitions');
          return;
        }
        setEvent(data);
      } catch (error) {
        console.error('[EVENT_GET]', error);
        router.push('/exhibitions');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, router]);

  const handleStallSelect = (stall: Stall) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    if (stall.status === 'available') {
      router.push(`/exhibitions/${params.id}/application?stall=${stall.stallId}`);
    }
  };

  if (loading || !event) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with back button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/exhibitions/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event Details
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">Select a stall to view details and apply</p>
          </div>
        </div>
      </div>

      {/* Stall Selection Form */}
      <StallForm
        eventId={params.id as string}
        eventDetails={{
          category: event.category,
          numberOfStalls: event.numberOfStalls,
          layout: event.layout || ''
        }}
        readOnly
        isOrganizer={false}
        onStallSelect={handleStallSelect}
      />
    </div>
  );
}
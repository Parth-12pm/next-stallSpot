// app/(main)/exhibitions/[id]/stalls/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StallForm from "@/components/events/StallForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IEvent, IStall } from "@/models/Event";
import { useEffect, useState } from 'react';

export default function ExhibitionStallsPage() {
  const params = useParams();
  const eventId = params.id as string; // Extract id once
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      router.push('/exhibitions');
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/exhibitions/${eventId}`);
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

    fetchEvent();
  }, [eventId, router]);

  const handleStallSelect = (stall: IStall) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    if (stall.status === 'available') {
      router.push(`/exhibitions/${params.id}/application?stall=${stall.stallId}`);
    }
  };

// In the loading section, replace the existing skeleton with:

if (loading || !event) {
  return (
    <div className="min-h-screen bg-gradient-to-b p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" /> {/* Back button */}
            <Skeleton className="h-10 w-[300px]" /> {/* Title */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Layout Skeleton */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg rounded-xl">
              <Skeleton className="h-8 w-[200px] mb-4" /> {/* Section title */}
              <Skeleton className="w-full aspect-video mb-6" /> {/* Layout image */}
              
              {/* Stall Grid Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Details Skeleton */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg rounded-xl">
              <Skeleton className="h-8 w-[250px] mb-6" /> {/* Details title */}
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with back button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/exhibitions/${params.id}`}>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event Details
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground text-sm">
              Select a stall to view details and apply
            </p>
          </div>
        </div>
      </div>

      {/* Stall Selection Form wrapped in a card */}
      <Card className="p-6">
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
      </Card>
    </div>
  );
}
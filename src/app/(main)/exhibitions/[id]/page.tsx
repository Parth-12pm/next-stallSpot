/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(main)/exhibitions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import EventPreview from "@/components/events/EventPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getEvent(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/exhibitions/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
  } catch (error) {
    console.error('[EVENT_GET]', error);
    return null;
  }
}

export default async function ExhibitionPage({ params, searchParams }: PageProps) {
  const session = await getServerSession();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    return notFound();
  }

  // Only published events are visible to vendors
  if (!session?.user && event.status !== 'published') {
    return notFound();
  }

  // Organizer can see their own events regardless of status
  const isOrganizer = (session?.user as any)?.role === 'organizer';
  if (isOrganizer && event.organizerId !== session?.user?.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>You don&apos;t have permission to view this event.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200" />
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="h-8 w-[300px] animate-pulse rounded-md bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="grid gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-[200px] animate-pulse rounded-md bg-gray-200" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-24 w-full animate-pulse rounded-md bg-gray-200" />
                </div>

                <div className="space-y-4">
                  <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="h-4 w-[140px] animate-pulse rounded-md bg-gray-200" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EventPreview 
          eventId={resolvedParams.id} 
          isOrganizer={isOrganizer}
      />
    </Suspense>
  </div>
  );
}
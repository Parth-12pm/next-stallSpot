/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(main)/exhibitions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import EventPreview from "@/components/events/EventPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export default async function ExhibitionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  const event = await getEvent(params.id);

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
      <EventPreview 
        eventId={params.id} 
        isOrganizer={isOrganizer}
      />
    </div>
  );
}
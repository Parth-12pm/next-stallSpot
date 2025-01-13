// app/(dashboard)/dashboard/events/[id]/stalls/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import StallForm from "@/components/events/StallForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Stall } from '@/components/events/types/types';

interface EventDetails {
  _id: string;
  title: string;
  category: string;
  numberOfStalls: number;
  configurationComplete: boolean;
}

export default function StallManagementPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  const { session, status } = useAuth(['organizer']);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        setEventDetails({
          _id: data._id,
          title: data.title,
          category: data.category,
          numberOfStalls: data.numberOfStalls,
          configurationComplete: data.configurationComplete
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchEventDetails();
    }
  }, [params.id, session]);

  // Handle authentication loading state
  if (status === 'loading') {
    return <LoadingState />;
  }

  // Handle authentication
  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  // Handle data loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle error state
  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Failed to load event details'}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  const handleStallsSave = async (stalls: Stall[]) => {
    try {
      const response = await fetch(`/api/events/${params.id}/stalls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stalls }),
      });

      if (!response.ok) {
        throw new Error('Failed to save stall configuration');
      }

      router.push(`/dashboard/events/${params.id}`);
    } catch (err) {
      console.error('Error saving stalls:', err);
      setError(err instanceof Error ? err.message : 'Failed to save stall configuration');
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold">{eventDetails.title}</h1>
            <p className="text-muted-foreground">Configure stall layout and details</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

<StallForm 
      eventId={params.id}
      eventDetails={{
        category: eventDetails.category,
        numberOfStalls: eventDetails.numberOfStalls
      }}
      onSave={handleStallsSave}
      isOrganizer={true}
    />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="space-y-4 mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  );
}
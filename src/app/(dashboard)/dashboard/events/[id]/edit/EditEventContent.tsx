// src/app/(dashboard)/dashboard/events/[id]/edit/EditEventContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import EventForm from "@/components/events/EventForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Event } from '@/components/events/types/types';

type Props = {
  id: string;
};

export default function EditEventContent({ id }: Props) {
  const router = useRouter();
  const { session } = useAuth(['organizer']);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchEvent();
    }
  }, [id, session]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }

      router.push(`/dashboard/events/${id}`);
    } catch (err) {
      console.error('Error updating event:', err);
      throw err; // Let EventForm handle the error
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Form Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-[250px] animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-[400px] animate-pulse rounded-md bg-gray-100" />
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Form Actions Skeleton */}
        <div className="flex gap-4 pt-6">
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-gray-200" />
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }


  if (error || !event) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Failed to load event'}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <EventForm 
        initialData={event}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
}
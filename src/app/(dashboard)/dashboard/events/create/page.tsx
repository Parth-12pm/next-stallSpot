// src/app/(dashboard)/dashboard/events/create/page.tsx
'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import EventForm from "@/components/events/EventForm";
import { useToast } from "@/hooks/use-toast";

export default function CreateEventPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isOrganizer = (session?.user as { role?: string })?.role === 'organizer';

  if (!isOrganizer) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
      }

      const event = await response.json();
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Event created successfully",
        duration: 3000,
      });

      // Redirect to event page
      router.push(`/dashboard/events/${event._id}`);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: "destructive",
        duration: 5000,
      });
      throw error; // Re-throw to be caught by the form's error handling
    }
  };

  return (
    <div className="flex-1">
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
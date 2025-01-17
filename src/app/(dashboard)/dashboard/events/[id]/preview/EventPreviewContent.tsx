// src/app/(dashboard)/dashboard/events/[id]/preview/EventPreviewContent.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import EventPreview from "@/components/events/EventPreview";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";

type Props = {
  id: string;
};

export default function EventPreviewContent({ id }: Props) {
  const router = useRouter();
  const { session } = useAuth(['organizer']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);

      const response = await fetch(`/api/events/${id}/publish`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish event');
      }

      // Redirect to event details page after successful publish
      router.push(`/dashboard/events/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish event');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/events/${id}/stalls`)}
            >
              Configure Stalls
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        <div className="bg-background rounded-lg shadow-sm">
          <EventPreview eventId={id} isOrganizer={true} />
        </div>
      </div>
    </div>
  );
}
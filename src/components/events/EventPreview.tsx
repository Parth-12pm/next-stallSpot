"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon, Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IEvent } from "@/models/Event";

interface EventPreviewProps {
  eventId: string;
  isOrganizer?: boolean;
}

export default function EventPreview({ eventId, isOrganizer = false }: EventPreviewProps) {
  const router = useRouter();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (response.status === 401) {
          router.push(`/auth/login?callbackUrl=/exhibitions/${eventId}`);
          throw new Error("Please login to view this event");
        }

        if (response.status === 403) {
          throw new Error("You don't have permission to view this event");
        }

        if (response.status === 404) {
          throw new Error("Event not found or has been removed");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, router]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      if (!event?.configurationComplete) {
        throw new Error("Please complete stall configuration before publishing");
      }

      const response = await fetch(`/api/events/${eventId}/publish`, {
        method: "POST",
      });

      if (response.status === 401) {
        router.push('/auth/login?callbackUrl=/dashboard/events');
        throw new Error("Session expired. Please login again");
      }

      if (response.status === 403) {
        throw new Error("You don't have permission to publish this event");
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to publish event");
      }

      router.push("/dashboard/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish event");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
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
    );
  }


  if (error || !event) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>{error || "Failed to load event"}</span>
            {error?.includes("login") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/auth/login?callbackUrl=/exhibitions/${eventId}`)}
              >
                Login to Continue
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {isOrganizer && (
          <div className="mb-8">
            <Alert variant={event.configurationComplete ? "default" : "destructive"}>
              <AlertDescription>
                {event.configurationComplete 
                  ? "Event is ready to be published" 
                  : "Please complete stall configuration before publishing"}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Image */}
          <div className="h-fit">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              {event.thumbnail ? (
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No thumbnail available
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold tracking-tight">
                  {event.title}
                </h1>
                {event.status === 'draft' && (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <Badge>{event.category}</Badge>
                {event.entryFee && (
                  <Badge variant="outline">₹{event.entryFee} Entry Fee</Badge>
                )}
              </div>
            </div>

            {/* Details sections remain the same */}
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>
                  {new Date(event.startDate).toLocaleDateString("en-US")} -{" "}
                  {new Date(event.endDate).toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{event.numberOfStalls} Stalls Available</span>
              </div>
            </div>

            <Separator />

            {/* About Event and Facilities sections remain the same */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About Event</h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Facilities</h2>
              <div className="grid grid-cols-2 gap-4">
                {event.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons - Modified for vendor and organizer views */}
            <div className="pt-4 space-y-4">
              {isOrganizer ? (
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/events/${eventId}/stalls`)}
                  >
                    Configure Stalls
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePublish}
                    disabled={!event.configurationComplete || isPublishing}
                  >
                    {isPublishing ? "Publishing..." : "Publish Event"}
                  </Button>
                </div>
              ) : (
                event.status === 'published' && (
                  <div>
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Available Stalls</h3>
                          <p className="text-muted-foreground">
                            {event.stallConfiguration.filter(s => s.status === 'available').length} out of {event.numberOfStalls} stalls available
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Starting from ₹{Math.min(...event.stallConfiguration.map(s => parseInt(s.price))).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => router.push(`/exhibitions/${eventId}/stalls`)}
                    >
                      View Available Stalls
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
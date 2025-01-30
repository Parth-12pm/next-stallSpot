// app/(main)/exhibitions/[id]/application/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ApplicationForm } from './ApplicationForm';
import type { Event, Stall } from '@/components/events/types/types';
import type { ProfileFormData } from '@/components/profile/types/profile';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ApplicationPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const stallId = searchParams.get('stall');
  const router = useRouter();
  const { data: session } = useSession();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [vendorProfile, setVendorProfile] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventRes = await fetch(`/api/events/${params.id}`);
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Find selected stall
        if (stallId) {
          const stall = eventData.stallConfiguration.find(
            (s: Stall) => s.stallId.toString() === stallId
          );
          setSelectedStall(stall);
        }

        // Fetch vendor profile
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        setVendorProfile(profileData);

      } catch (error) {
        console.error('Error fetching data:', error);
        router.push(`/exhibitions/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [params.id, stallId, session, router]);

  if (loading) return <div>Loading...</div>;
  if (!event || !selectedStall || !vendorProfile) return null;

  return (
    <ApplicationForm
      event={event}
      stall={selectedStall}
      vendorProfile={vendorProfile}
    />
  );
}
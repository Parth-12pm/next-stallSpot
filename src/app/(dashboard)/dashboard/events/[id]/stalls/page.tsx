// src/app/(dashboard)/dashboard/events/[id]/stalls/page.tsx
'use client';

import { useAuth } from "@/hooks/useAuth";
import StallForm from "@/components/events/StallForm";
import { redirect } from "next/navigation";

export default function StallManagementPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { session } = useAuth(['organizer']);

  if (!session?.user) {
    return redirect('/auth/login');
  }

  return <StallForm eventId={params.id} />;
}
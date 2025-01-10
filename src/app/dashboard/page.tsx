'use client';

import { useAuth } from "@/hooks/useAuth";
import { OrganizerDashboard } from "@/components/dashboard/OrganizerDashboard";
import { VendorDashboard } from "@/components/dashboard/VendorDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { session, status } = useAuth();

  if (status === "loading") {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!session?.user) {
    return null; // The useAuth hook will handle the redirect
  }

  // Render the appropriate dashboard based on user role
  return (
    <>
      {session.user.role === 'organizer' ? (
        <OrganizerDashboard user={session.user} />
      ) : (
        <VendorDashboard user={session.user} />
      )}
    </>
  );
}
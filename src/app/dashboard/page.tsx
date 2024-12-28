'use client';

import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // If you have shadcn/ui skeleton component

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Welcome, {session?.user?.name}</h2>
      <p className="text-muted-foreground mt-2">Role: {session?.user?.role}</p>
    </div>
  );
}
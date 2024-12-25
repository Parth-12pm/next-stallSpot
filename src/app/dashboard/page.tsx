'use client';

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { session, status } = useAuth();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
}
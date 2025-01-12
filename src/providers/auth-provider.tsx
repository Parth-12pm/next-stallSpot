// providers/auth-provider.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export function AuthProvider({ 
  children,
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
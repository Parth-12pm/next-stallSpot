'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user && !session.user.role) {
      console.error('Invalid session state detected');
      signOut({ callbackUrl: '/auth/login' });
    }
  }, [session]);

  return <>{children}</>;
}
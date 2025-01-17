// lib/error-handling.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }
  
  return new ApiError('An unexpected error occurred', 500);
};

export function useSessionCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push('/auth/login');
    }

    // Check for session expiry
    if (session?.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const currentTime = new Date().getTime();
      
      if (expiryTime <= currentTime) {
        router.push('/auth/login?error=SessionExpired');
      }

      // Set up expiry warning
      const warningTime = expiryTime - (5 * 60 * 1000); // 5 minutes before expiry
      if (currentTime < warningTime) {
        const timeout = setTimeout(() => {
          alert('Your session will expire in 5 minutes. Please save your work.');
        }, warningTime - currentTime);

        return () => clearTimeout(timeout);
      }
    }
  }, [session, status, router]);

  return { session, status };
}
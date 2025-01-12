// hooks/useAuth.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(allowedRoles?: string[]) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // No session -> login
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // No role -> login (this is stricter than before)
    if (!session.user.role) {
      console.error("No role found in session");
      router.push("/auth/login");
      return;
    }

    // If specific roles are required, check them
    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router, allowedRoles]);

  return { session, status };
}
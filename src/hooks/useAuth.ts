import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(allowedRoles?: string[]) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
    } else if (allowedRoles && !allowedRoles.includes(session.user.role as string)) {
      router.push("/dashboard");
    }
  }, [session, status, router, allowedRoles]);

  return { session, status };
}
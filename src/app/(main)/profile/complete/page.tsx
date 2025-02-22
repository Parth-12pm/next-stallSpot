"use client"

import { useEffect } from "react"
import { Container } from "@/components/ui/container"
import { useAuth } from "@/hooks/useAuth"
import { MultiStepProfileForm } from "@/components/profile/MultiStepProfileForm"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfileCompletionPage() {
  const { status, session } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.profileComplete) {
      router.push("/profile")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <Container className="py-10">
        <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
      </Container>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
  }

  return (
    <Container className="py-10">
      <MultiStepProfileForm
        isCompletion
        onComplete={() => {
          toast({
            title: "Success",
            description: "Profile completed successfully",
          })
          router.push("/dashboard")
        }}
      />
    </Container>
  )
}


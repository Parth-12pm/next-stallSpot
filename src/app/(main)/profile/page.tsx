"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/ui/container"
import { useAuth } from "@/hooks/useAuth"
import { MultiStepProfileForm } from "@/components/profile/MultiStepProfileForm"
import { ProfileView } from "@/components/profile/ProfileView"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { ProfileFormData } from "@/components/profile/types/profile"
import { initialFormData } from "@/components/profile/utils/profile"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { status, session } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileFormData>(initialFormData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to login
            router.push("/auth/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchProfile()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [toast, status, router])

  if (status === "loading" || loading) {
    return (
      <Container className="py-10">
        <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
      </Container>
    )
  }

  if (!session?.user?.profileComplete) {
    router.push("/profile/complete")
    return null
  }

  return (
    <Container className="py-10">
      {isEditing ? (
        <MultiStepProfileForm
          initialData={profileData}
          onComplete={() => {
            setIsEditing(false)
            toast({
              title: "Success",
              description: "Profile updated successfully",
            })
          }}
        />
      ) : (
        <ProfileView data={profileData} onEdit={() => setIsEditing(true)} />
      )}
    </Container>
  )
}


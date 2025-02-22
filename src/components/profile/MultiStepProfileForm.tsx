"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { StepIndicator } from "./StepIndicator"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { CompanyDetailsStep } from "./steps/CompanyDetailsStep"
import { BankDetailsStep } from "./steps/BankDetailsStep"
import { AdditionalInfoStep } from "./steps/AdditionalInfoStep"
import { initialFormData } from "@/components/profile/utils/profile"
import { useFormPersistence } from "@/hooks/useFormPersistence"
import { useAutosave } from "@/hooks/useAutosave"
import { AutosaveIndicator } from "./AutosaveIndicator"
import type { ProfileFormData, FormStep } from "@/components/profile/types/profile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MultiStepProfileFormProps {
  isCompletion?: boolean
  initialData?: ProfileFormData
  onComplete?: () => void
}

export function MultiStepProfileForm({ isCompletion = false, initialData, onComplete }: MultiStepProfileFormProps) {
  const router = useRouter()
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const isOrganizer = session?.user?.role === "organizer"

  const {
    formData,
    currentStep,
    completedSteps,
    loading,
    setLoading,
    handleStepUpdate,
    handleNext,
    handlePrev,
    clearFormData,
    setCurrentStep,
  } = useFormPersistence(isCompletion, initialData || initialFormData)

  const { lastSaved, isSaving, hasChanges, clearDraft } = useAutosave(formData)

  // Handle navigation/refresh attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isCompletion && !loading && hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isCompletion, loading, hasChanges])

  // Handle browser back/forward
  useEffect(() => {
    const preventNavigation = () => {
      if (isCompletion && !loading && hasChanges) {
        setShowExitDialog(true)
        return false
      }
      return true
    }

    window.history.pushState(null, "", window.location.pathname)
    window.addEventListener("popstate", preventNavigation)

    return () => {
      window.removeEventListener("popstate", preventNavigation)
    }
  }, [isCompletion, loading, hasChanges])

  // Determine initial step when editing an existing profile
  useEffect(() => {
    if (!isCompletion && initialData) {
      let initialStep: FormStep = "basic"
      if (initialData.name && initialData.dateOfBirth && initialData.contact && initialData.address) {
        initialStep = "company"
        if (
          isOrganizer ||
          (initialData.companyDetails && Object.keys(initialData.companyDetails).length > 0) ||
          initialData.companyDetailsSkipped
        ) {
          initialStep = "bank"
          if (
            initialData.accountDetails.bankName &&
            initialData.accountDetails.accountNumber &&
            initialData.accountDetails.ifscCode
          ) {
            initialStep = "additional"
          }
        }
      }
      setCurrentStep(initialStep)
    }
  }, [isCompletion, initialData, setCurrentStep, isOrganizer])

  // Check if company step should be marked as complete for vendors
  useEffect(() => {
    if (!isOrganizer && currentStep === "bank" && !completedSteps.includes("company")) {
      const hasCompanyDetails = !!(
        formData.companyDetails?.companyName ||
        formData.companyDetails?.registrationNumber ||
        formData.companyDetails?.registrationType
      )
      const hasSkippedCompanyDetails = formData.companyDetailsSkipped

      if (hasCompanyDetails || hasSkippedCompanyDetails) {
        const newCompletedSteps = [...completedSteps, "company"] as FormStep[]
        handleStepUpdate({ _completedSteps: newCompletedSteps })
      }
    }
  }, [currentStep, completedSteps, formData, isOrganizer, handleStepUpdate])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload: Partial<ProfileFormData> = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      }

      if (session?.user?.role === "vendor") {
        if (formData.companyDetailsSkipped) {
          delete payload.companyDetails
        } else if (formData.companyDetails) {
          const { companyName, registrationNumber, registrationType } = formData.companyDetails
          if (!companyName || !registrationNumber || !registrationType) {
            delete payload.companyDetails
          }
        }
      }

      const response = await fetch("/api/auth/complete-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      // Clear form data and draft
      clearFormData()
      clearDraft()

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Update session with new profile status
      await update({ profileComplete: true })

      // Use onComplete callback if provided, otherwise redirect to dashboard
      if (onComplete) {
        onComplete()
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const currentStepComponent = () => {
    const isLastStep = currentStep === "additional"
    const stepProps = {
      data: formData,
      onUpdate: handleStepUpdate,
      onNext: handleNext,
      onPrev: handlePrev,
      isLastStep,
    }

    switch (currentStep) {
      case "basic":
        return <BasicInfoStep {...stepProps} />
      case "company":
        return <CompanyDetailsStep {...stepProps} />
      case "bank":
        return <BankDetailsStep {...stepProps} />
      case "additional":
        return <AdditionalInfoStep {...stepProps} onSubmit={handleSubmit} loading={loading} />
      default:
        return null
    }
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 relative">
          <AutosaveIndicator lastSaved={lastSaved} isSaving={isSaving} hasChanges={hasChanges} />
          <div className="mt-4">
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              isOrganizer={isOrganizer}
              formData={formData}
            />
            {currentStepComponent()}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Profile Completion?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress has been saved, but you need to complete your profile to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.back()}>Leave Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


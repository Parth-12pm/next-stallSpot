// components/profile/StepIndicator.tsx
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FORM_STEPS, type FormStep, type ProfileFormData } from "@/components/profile/types/profile"

interface StepIndicatorProps {
  currentStep: FormStep
  completedSteps: FormStep[]
  isOrganizer: boolean
  formData: ProfileFormData
}

export function StepIndicator({ currentStep, completedSteps, isOrganizer, formData }: StepIndicatorProps) {
  // Function to determine if a step should be shown
  const shouldShowStep = (stepId: FormStep): boolean => {
    if (stepId === "company" && !isOrganizer) {
      // For vendors, only show company step if they've started entering details
      return !!(
        formData.companyDetails?.companyName ||
        formData.companyDetails?.registrationNumber ||
        formData.companyDetails?.registrationType
      )
    }
    return true
  }

  // Filter steps based on role and state
  const visibleSteps = FORM_STEPS.filter((step) => shouldShowStep(step.id))

  return (
    <div className="relative mb-8">
      <div className="absolute top-5 left-1 right-1 h-0.5 bg-border" />
      <ol className="relative z-10 flex justify-between">
        {visibleSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id

          return (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  "transition-colors duration-200",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary",
                  !isCompleted && !isCurrent && "border-muted-foreground bg-background",
                )}
              >
                {isCompleted ? <Check className="h-6 w-6" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium">
                  {step.title}
                  {step.id === "company" && !isOrganizer && (
                    <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground hidden md:block">{step.description}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}


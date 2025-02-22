"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import type { StepProps } from "@/components/profile/types/profile"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { validateProfileData } from "@/components/profile/utils/profile"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AdditionalInfoStepProps extends StepProps {
  onSubmit: () => Promise<void>
  loading: boolean
}

export function AdditionalInfoStep({ data, onUpdate, onPrev, onSubmit, loading }: AdditionalInfoStepProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isOrganizer = session?.user?.role === "organizer"
  const maxLength = isOrganizer ? 1000 : 250

  const handleChange = (value: string) => {
    const trimmedValue = value.slice(0, maxLength)
    setErrors({})
    onUpdate({ selfDescription: trimmedValue })
  }

  const validateAndSubmit = async () => {
    const validationErrors = validateProfileData(data, "additional")
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach((error) => {
        errorMap.selfDescription = error
      })
      setErrors(errorMap)
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      })
      return
    }

    try {
      await onSubmit()
      // The redirection is now handled in the parent component (MultiStepProfileForm)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete profile",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="selfDescription">
            Professional Summary
            <span className="text-muted-foreground"> (required)</span>
          </Label>
          <Textarea
            id="selfDescription"
            value={data.selfDescription}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={
              isOrganizer
                ? "Describe your experience in organizing exhibitions and events..."
                : "Tell us about your business and what you offer..."
            }
            className={errors.selfDescription ? "border-destructive" : ""}
            rows={8}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>
              {data.selfDescription.length} / {maxLength} characters
            </p>
            {errors.selfDescription && <p className="text-sm text-destructive">{errors.selfDescription}</p>}
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Profile Completion Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • Be clear and concise about your {isOrganizer ? "event organization experience" : "business offerings"}
            </li>
            <li>• Mention your specialties and areas of expertise</li>
            <li>• Include relevant achievements and experience</li>
            <li>• Avoid using personal contact information</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={loading} className="w-24">
          Back
        </Button>
        <Button onClick={validateAndSubmit} disabled={loading} className="w-32">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete"
          )}
        </Button>
      </div>
    </div>
  )
}


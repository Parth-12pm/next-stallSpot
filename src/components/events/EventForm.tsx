//src\components\events\EventForm.tsx

"use client"

import { useState, type ChangeEvent, type FormEvent, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { IEvent } from "@/models/Event"
import { Save, FileImage, Calendar, Clock } from "lucide-react"

interface FormState {
  eventName: string
  description: string
  venue: string
  numberOfStalls: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  entryFee: string
  facilities: string[]
  category: string
  status: IEvent["status"]
}

interface EventFormProps {
  onSubmit?: (formData: globalThis.FormData) => Promise<void>
  initialData?: IEvent
  isEditing?: boolean
}

interface FormErrors {
  eventName?: string
  description?: string
  venue?: string
  startDate?: Date
  endDate?: Date
  startTime?: string
  endTime?: string
}

const facilities = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "security", label: "24/7 Security" },
  { id: "power", label: "Power Backup" },
  { id: "cleaning", label: "Cleaning Services" },
  { id: "catering", label: "Catering" },
]

export default function EventForm({ onSubmit, initialData, isEditing = false }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormState>(() => {
    if (initialData) {
      return {
        eventName: initialData.title,
        description: initialData.description,
        venue: initialData.venue,
        numberOfStalls: initialData.numberOfStalls.toString(),
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        entryFee: initialData.entryFee || "",
        facilities: initialData.facilities,
        category: initialData.category,
        status: initialData.status,
      }
    }

    return {
      eventName: "",
      description: "",
      venue: "",
      numberOfStalls: "10",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "",
      endTime: "",
      entryFee: "",
      facilities: [],
      category: "art",
      status: "draft",
    }
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const completionPercentage = useMemo(() => {
    const fields = [
      formData.eventName,
      formData.category,
      formData.venue,
      formData.startDate,
      formData.endDate,
      formData.startTime,
      formData.endTime,
      formData.numberOfStalls,
      formData.description,
    ]

    const filledFields = fields.filter(
      (field) => field && (typeof field === "string" ? field.trim() !== "" : true),
    ).length
    const hasFacilities = formData.facilities.length > 0

    return Math.round(((filledFields + (hasFacilities ? 1 : 0)) / (fields.length + 1)) * 100)
  }, [formData])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Date") ? new Date(value) : value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.eventName || formData.eventName.length < 2) {
      newErrors.eventName = "Event name must be at least 2 characters."
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters."
    }

    if (!formData.venue) {
      newErrors.venue = "Venue is required."
    }

    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(formData.startDate)
      const endDateTime = new Date(formData.endDate)

      const [startHours, startMinutes] = formData.startTime.split(":")
      const [endHours, endMinutes] = formData.endTime.split(":")

      startDateTime.setHours(Number.parseInt(startHours), Number.parseInt(startMinutes), 0)
      endDateTime.setHours(Number.parseInt(endHours), Number.parseInt(endMinutes), 0)

      const sameDay = startDateTime.toDateString() === endDateTime.toDateString()

      if (sameDay && formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be later than start time"
        toast({
          title: "Time Selection Error",
          description: "When dates are the same, end time must be later than start time",
          variant: "destructive",
        })
        return false
      }

      if (endDateTime <= startDateTime) {
        newErrors.endTime = "Event end must be after start"
        toast({
          title: "Date/Time Error",
          description: "Overall event end date/time must be after start date/time",
          variant: "destructive",
        })
        return false
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required."
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formDataToSend.append(key, v))
          } else {
            formDataToSend.append(key, value.toString())
          }
        })

        const layoutInput = document.getElementById("layout") as HTMLInputElement
        const thumbnailInput = document.getElementById("thumbnail") as HTMLInputElement

        if (layoutInput?.files?.[0]) {
          formDataToSend.append("layout", layoutInput.files[0])
        }
        if (thumbnailInput?.files?.[0]) {
          formDataToSend.append("thumbnail", thumbnailInput.files[0])
        }

        if (onSubmit) {
          await onSubmit(formDataToSend)
        } else {
          const response = await fetch("/api/events", {
            method: "POST",
            body: formDataToSend,
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || "Failed to create event")
          }

          if (data.success) {
            toast({
              title: "Success!",
              description: isEditing
                ? "Event updated successfully."
                : "Event created successfully. Redirecting to stall configuration...",
              duration: 3000,
            })

            setTimeout(() => {
              router.push(data.redirectUrl)
            }, 1500)
          } else {
            throw new Error(data.error || "Failed to create event")
          }
        }
      } catch (error) {
        console.error("Event creation error:", error)
        setSubmitError(error instanceof Error ? error.message : "Failed to create event")

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create event",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto  rounded-xl shadow-lg shadow-gray-600/10 p-8">
        <div className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {isEditing
                ? "Update your exhibition event details below."
                : "Fill in the details below to create a new exhibition event."}
            </p>
          </div>

          {submitError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Completion Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="eventName" className="text-lg font-semibold">
                Event Name
              </Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="Art Exhibition 2024"
                value={formData.eventName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.eventName && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.eventName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="category" className="text-lg font-semibold">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="digital">Digital Art</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="venue" className="text-lg font-semibold">
              Venue
            </Label>
            <Input
              id="venue"
              name="venue"
              placeholder="Exhibition Hall"
              value={formData.venue}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.venue && (
              <Alert variant="destructive">
                <AlertDescription>{errors.venue}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="startDate" className="text-lg font-semibold">
                Start Date
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate.toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.startDate && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.startDate?.toISOString().split("T")[0]}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="endDate" className="text-lg font-semibold">
                End Date
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate.toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  min={formData.startDate.toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.endDate && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.endDate?.toISOString().split("T")[0]}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="startTime" className="text-lg font-semibold">
                Start Time
              </Label>
              <div className="relative">
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.startTime && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.startTime}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="endTime" className="text-lg font-semibold">
                End Time
              </Label>
              <div className="relative">
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.endTime && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.endTime}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="thumbnail" className="text-lg font-semibold">
                Event Thumbnail
              </Label>
              <div className="relative">
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="layout" className="text-lg font-semibold">
                Event Layout
              </Label>
              <div className="relative">
                <Input
                  id="layout"
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="entryFee" className="text-lg font-semibold">
                Entry Fee (₹) (Optional)
              </Label>
              <Input
                id="entryFee"
                name="entryFee"
                type="number"
                min="0"
                placeholder="100"
                value={formData.entryFee}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="numberOfStalls" className="text-lg font-semibold">
                Number of Stalls
              </Label>
              <Input
                id="numberOfStalls"
                name="numberOfStalls"
                type="number"
                min="1"
                placeholder="10"
                value={formData.numberOfStalls}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="description" className="text-lg font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your event..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <Alert variant="destructive">
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Facilities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <Checkbox
                    id={facility.id}
                    checked={formData.facilities.includes(facility.id)}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        facilities: checked
                          ? [...prev.facilities, facility.id]
                          : prev.facilities.filter((id) => id !== facility.id),
                      }))
                    }}
                  />
                  <label
                    htmlFor={facility.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {facility.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting
                ? isEditing
                  ? "Updating Event..."
                  : "Creating Event..."
                : isEditing
                  ? "Update Event"
                  : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


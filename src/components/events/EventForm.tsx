// src/components/events/EventForm.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Event } from "./types/types";

interface FormState {
  eventName: string;
  description: string;
  venue: string;
  numberOfStalls: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  entryFee: string;
  facilities: string[];
  category: string;
}

interface EventFormProps {
  onSubmit?: (formData: globalThis.FormData) => Promise<void>;
}

// In EventForm.tsx
interface EventFormProps {
  onSubmit?: (formData: globalThis.FormData) => Promise<void>;
  initialData?: Event; // Add this for edit mode
  isEditing?: boolean; // Add this to toggle edit/create behavior
}

interface FormErrors {
  eventName?: string;
  description?: string;
  venue?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
}

const facilities = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "security", label: "24/7 Security" },
  { id: "power", label: "Power Backup" },
  { id: "cleaning", label: "Cleaning Services" },
  { id: "catering", label: "Catering" },
];

export default function EventForm({
  onSubmit,
  initialData,
  isEditing = false,
}: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      };
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
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

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
    ];

    const filledFields = fields.filter(
      (field) => field && (typeof field === 'string' ? field.trim() !== "" : true)
    ).length;
    const hasFacilities = formData.facilities.length > 0;

    return Math.round(
      ((filledFields + (hasFacilities ? 1 : 0)) / (fields.length + 1)) * 100
    );
  }, [formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Date") ? new Date(value) : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.eventName || formData.eventName.length < 2) {
      newErrors.eventName = "Event name must be at least 2 characters.";
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    
    if (!formData.venue) {
      newErrors.venue = "Venue is required.";
    }
    
  // Date validations with user-friendly messages
  if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
    const startDateTime = new Date(formData.startDate);
    const endDateTime = new Date(formData.endDate);
    
    const [startHours, startMinutes] = formData.startTime.split(':');
    const [endHours, endMinutes] = formData.endTime.split(':');
    
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
    
    // Check if dates are the same
    const sameDay = startDateTime.toDateString() === endDateTime.toDateString();
    
    if (sameDay && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be later than start time";
      toast({
        title: "Time Selection Error",
        description: "When dates are the same, end time must be later than start time",
        variant: "destructive"
      });
      return false;
    }
    
    if (endDateTime <= startDateTime) {
      newErrors.endTime = "Event end must be after start";
      toast({
        title: "Date/Time Error",
        description: "Overall event end date/time must be after start date/time",
        variant: "destructive"
      });
      return false;
    }
  }
  
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required.";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "End time is required.";
    }
  
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  // In EventForm.tsx, update the handleSubmit function

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const formDataToSend = new FormData();

        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formDataToSend.append(key, v));
          } else {
            formDataToSend.append(key, value.toString());
          }
        });

        // Add files
        const layoutInput = document.getElementById(
          "layout"
        ) as HTMLInputElement;
        const thumbnailInput = document.getElementById(
          "thumbnail"
        ) as HTMLInputElement;

        if (layoutInput?.files?.[0]) {
          formDataToSend.append("layout", layoutInput.files[0]);
        }
        if (thumbnailInput?.files?.[0]) {
          formDataToSend.append("thumbnail", thumbnailInput.files[0]);
        }

        if (onSubmit) {
          await onSubmit(formDataToSend);
        } else {
          const response = await fetch("/api/events", {
            method: "POST",
            body: formDataToSend,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to create event");
          }

          if (data.success) {
            // Show success notification
            toast({
              title: "Success!",
              description: isEditing
                ? "Event updated successfully."
                : "Event created successfully. Redirecting to stall configuration...",
              duration: 3000,
            });

            // Small delay for the toast to be visible
            setTimeout(() => {
              router.push(data.redirectUrl);
            }, 1500);
          } else {
            throw new Error(data.error || "Failed to create event");
          }
        }
      } catch (error) {
        console.error("Event creation error:", error);
        setSubmitError(
          error instanceof Error ? error.message : "Failed to create event"
        );

        // Show error notification
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to create event",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-2">
      <div className="max-w-[1400px] mx-auto bg-card rounded-xl shadow-lg p-6 sm:p-8">
        <div className="mb-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-4">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-muted-foreground text-lg">
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
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Completion Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* First Row: Event Name, Category, Venue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="Art Exhibition 2024"
                value={formData.eventName}
                onChange={handleInputChange}
              />
              {errors.eventName && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.eventName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                placeholder="Exhibition Hall"
                value={formData.venue}
                onChange={handleInputChange}
              />
              {errors.venue && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.venue}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Second Row: Start Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate.toISOString().split("T")[0]}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <Alert variant="destructive">
                  <AlertDescription>
                  {errors.startDate?.toISOString().split('T')[0]}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate.toISOString().split("T")[0]}
                onChange={handleInputChange}
                min={formData.startDate.toISOString().split("T")[0]}
              />
              {errors.endDate && (
                <Alert variant="destructive">
                  <AlertDescription>
                  {errors.endDate?.toISOString().split('T')[0]}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Third Row: Start Time and End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
              />
              {errors.startTime && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.startTime}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
              />
              {errors.endTime && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.endTime}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Fourth Row: Event Thumbnail and Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Event Thumbnail</Label>
              <Input id="thumbnail" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Event Layout</Label>
              <Input id="layout" type="file" accept="image/*" />
            </div>
          </div>

          {/* Fifth Row: Fees and Stalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (₹) (Optional)</Label>
              <Input
                id="entryFee"
                name="entryFee"
                type="number"
                min="0"
                placeholder="100"
                value={formData.entryFee}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfStalls">Number of Stalls</Label>
              <Input
                id="numberOfStalls"
                name="numberOfStalls"
                type="number"
                min="1"
                placeholder="10"
                value={formData.numberOfStalls}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Sixth Row: Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your event..."
              className="resize-none h-32"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <Alert variant="destructive">
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Seventh Row: Facilities */}
          <div className="space-y-4">
            <Label className="text-base">Facilities</Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg"
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
                      }));
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

          {/* Eighth Row: Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto h-12 px-12 text-lg"
              disabled={isSubmitting}
            >
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
  );
}

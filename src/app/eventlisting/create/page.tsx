"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

interface FormData {
  eventName: string;
  description: string;
  venue: string;
  numberOfStalls: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  charges: string;
  facilities: string[];
  category: string;
  layout?: File;
}

interface Errors {
  eventName?: string;
  description?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

const facilities = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "security", label: "24/7 Security" },
  { id: "power", label: "Power Backup" },
  { id: "cleaning", label: "Cleaning Services" },
  { id: "catering", label: "Catering" }
];

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    description: "",
    venue: "",
    numberOfStalls: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    charges: "",
    facilities: [],
    category: "art"
  });
  
  const [errors, setErrors] = useState<Errors>({});

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
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const hasFacilities = formData.facilities.length > 0;
    
    return Math.round((filledFields + (hasFacilities ? 1 : 0)) / (fields.length + 1) * 100);
  }, [formData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being changed
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.eventName || formData.eventName.length < 2) {
      newErrors.eventName = "Event name must be at least 2 characters.";
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    if (!formData.venue) {
      newErrors.venue = "Venue is required.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required.";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required.";
    }
    
    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const layoutInput = document.getElementById('layout') as HTMLInputElement;
        const layoutFile = layoutInput.files?.[0];
        const thumbnailInput = document.getElementById('thumbnail') as HTMLInputElement;
        const thumbnailFile = thumbnailInput.files?.[0];
        
        // Create FormData for file upload
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'layout') {
            formDataToSend.append(key, value.toString());
          }
        });
        
        if (layoutFile) {
          formDataToSend.append('layout', layoutFile);
        }
        if (thumbnailFile) {
          formDataToSend.append('thumbnail', thumbnailFile);
        }

        const response = await fetch('/api/events', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const result = await response.json();
        router.push(`/events/${result.id}`);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to create event');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background py-8 px-2">
        <div className="max-w-[1400px] mx-auto bg-card rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-10">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-4">Create New Event</h1>
              <p className="text-muted-foreground text-lg">Fill in the details below to create a new exhibition event.</p>
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
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
              </div>
            </div>

            {/* Fourth Row: Event Thumbnail and Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Event Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Event Layout</Label>
                <Input
                  id="layout"
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Fifth Row: Number of Stalls */}
            <div className="space-y-2">
              <Label htmlFor="numberOfStalls">Number of Stalls</Label>
              <Input
                id="numberOfStalls"
                name="numberOfStalls"
                type="number"
                min="1"
                placeholder="10"
                value="10"
                onChange={handleInputChange}
              />
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
            </div>

            {/* Seventh Row: Facilities */}
            <div className="space-y-4">
              <Label className="text-base">Facilities</Label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
                    <Checkbox
                      id={facility.id}
                      checked={formData.facilities.includes(facility.id)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          facilities: checked
                            ? [...prev.facilities, facility.id]
                            : prev.facilities.filter(id => id !== facility.id)
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
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}
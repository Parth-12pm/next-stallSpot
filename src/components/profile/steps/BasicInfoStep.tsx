'use client';

import { useState } from 'react';
import { StepProps } from '@/components/profile/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { validateProfileData, calculateAge } from '@/components/profile/utils/profile';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';

export function BasicInfoStep({
  data,
  onUpdate,
  onNext,
}: StepProps) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    onUpdate({ [field]: value });
  };

  const validateAndContinue = () => {
    const validationErrors = validateProfileData(data, 'basic');
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        const [field] = error.toLowerCase().split(' ');
        errorMap[field] = error;
      });
      setErrors(errorMap);
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }
    onNext?.();
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <ImageUpload
          value={data.profilePicture}
          onChange={(url) => handleChange('profilePicture', url)}
          onUpload={() => {
            toast({
              title: "Success",
              description: "Profile picture uploaded successfully"
            });
          }}
        />
      </div>

      {/* Basic Information Form */}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="relative">
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={errors.dateOfBirth ? 'border-destructive' : ''}
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {data.dateOfBirth && (
            <p className="text-sm text-muted-foreground">
              Age: {calculateAge(data.dateOfBirth)} years
            </p>
          )}
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            type="tel"
            value={data.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="Enter your contact number"
            className={errors.contact ? 'border-destructive' : ''}
          />
          {errors.contact && (
            <p className="text-sm text-destructive">{errors.contact}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter your full address"
            className={errors.address ? 'border-destructive' : ''}
            rows={3}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={validateAndContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
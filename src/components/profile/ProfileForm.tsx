'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

type CompanyDetails = {
  companyName: string;
  registrationNumber: string;
  website: string;
};

type AccountDetails = {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
};

type ProfileFormData = {
  name: string;
  email: string;
  role: 'organizer' | 'vendor';
  contact: string;
  address: string;
  companyDetails: CompanyDetails;
  accountDetails: AccountDetails;
  selfDescription: string;
  age?: number;
  profilePicture?: string;
  [key: string]: string | number | CompanyDetails | AccountDetails | undefined;
};

interface ProfileFormProps {
  mode: 'view' | 'edit';
  isCompletion?: boolean;
}

export function ProfileForm({ mode: initialMode, isCompletion = false }: ProfileFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    role: 'vendor',
    contact: '',
    address: '',
    companyDetails: {
      companyName: '',
      registrationNumber: '',
      website: '',
    },
    accountDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    },
    selfDescription: '',
  });

  const isOrganizer = session?.user?.role === 'organizer';
  const isEditing = mode === 'edit';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        const data = await response.json();
        setFormData({
          ...data,
          companyDetails: data.companyDetails || {
            companyName: '',
            registrationNumber: '',
            website: '',
          },
          accountDetails: data.accountDetails || {
            bankName: '',
            accountNumber: '',
            ifscCode: '',
          },
          selfDescription: data.selfDescription || '',
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [toast]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      if (isCompletion) {
        router.push('/dashboard');
      } else {
        setMode('view');
      }
      
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (field.includes('.')) {
        const [section, key] = field.split('.');
        if (section === 'companyDetails') {
          newData.companyDetails = {
            ...newData.companyDetails,
            [key]: value,
          };
        } else if (section === 'accountDetails') {
          newData.accountDetails = {
            ...newData.accountDetails,
            [key]: value,
          };
        }
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      {/* Avatar and Basic Info Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={formData.profilePicture} />
          <AvatarFallback>{formData.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{formData.name || 'Complete Your Profile'}</h2>
          <p className="text-muted-foreground">{formData.email}</p>
        </div>
        {!isCompletion && (
          <Button 
            onClick={() => setMode(isEditing ? 'view' : 'edit')}
            variant={isEditing ? "secondary" : "default"}
            className="ml-auto"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        )}
      </div>

      {/* Basic Information */}
      <section>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section>
        <h3 className="text-lg font-medium mb-4">Company Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyDetails.companyName}
              onChange={(e) => handleChange('companyDetails.companyName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={formData.companyDetails.registrationNumber}
              onChange={(e) => handleChange('companyDetails.registrationNumber', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.companyDetails.website}
              onChange={(e) => handleChange('companyDetails.website', e.target.value)}
              disabled={!isEditing}
              placeholder="https://"
            />
          </div>
        </div>
      </section>

      {/* Bank Details */}
      <section>
        <h3 className="text-lg font-medium mb-4">Bank Details</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.accountDetails.bankName}
              onChange={(e) => handleChange('accountDetails.bankName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountDetails.accountNumber}
              onChange={(e) => handleChange('accountDetails.accountNumber', e.target.value)}
              disabled={!isEditing}
              type={isEditing ? "text" : "password"}
            />
          </div>
          <div>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              value={formData.accountDetails.ifscCode}
              onChange={(e) => handleChange('accountDetails.ifscCode', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>

      {/* Organizer Specific Fields */}
      {isOrganizer && (
        <section>
          <h3 className="text-lg font-medium mb-4">Additional Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </section>
      )}

      {/* Self Description */}
      <section>
        <h3 className="text-lg font-medium mb-4">About</h3>
        <div>
          <Label htmlFor="selfDescription">Self Description</Label>
          <Textarea
            id="selfDescription"
            value={formData.selfDescription}
            onChange={(e) => handleChange('selfDescription', e.target.value)}
            disabled={!isEditing}
            rows={5}
            className="resize-none"
            maxLength={isOrganizer ? 1000 : 250}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.selfDescription.length} / {isOrganizer ? 1000 : 250} characters
          </p>
        </div>
      </section>

      {/* Submit Button */}
      {(isEditing || isCompletion) && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? "Saving..." : isCompletion ? "Complete Profile" : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
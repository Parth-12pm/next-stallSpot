// components/profile/ProfileView.tsx
'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfileFormData } from '@/components/profile/types/profile';

interface ProfileViewProps {
  data: ProfileFormData;
  onEdit: () => void;
}

export function ProfileView({ data, onEdit }: ProfileViewProps) {
  const { data: session } = useSession();
  const isOrganizer = session?.user?.role === 'organizer';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Details</CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Name" value={data.name} />
            <InfoItem label="Email" value={data.email} />
            <InfoItem label="Contact" value={data.contact} />
            <InfoItem 
              label="Date of Birth" 
              value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : undefined} 
            />
            <InfoItem label="Address" value={data.address} className="md:col-span-2" />
          </div>
        </div>

        {/* Company Details - Show for organizers or if vendor has company details */}
        {(isOrganizer || data.companyDetails?.companyName) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Company Name" value={data.companyDetails?.companyName} />
              <InfoItem label="Registration Type" value={data.companyDetails?.registrationType} />
              <InfoItem label="Registration Number" value={data.companyDetails?.registrationNumber} />
              {data.companyDetails?.website && (
                <InfoItem label="Website" value={data.companyDetails.website} />
              )}
            </div>
          </div>
        )}

        {/* Bank Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Bank Name" value={data.accountDetails.bankName} />
            <InfoItem 
              label="Account Number" 
              value={data.accountDetails.accountNumber} 
              mask
            />
            <InfoItem label="IFSC Code" value={data.accountDetails.ifscCode} />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Summary</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {data.selfDescription || 'No description provided'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ 
  label, 
  value, 
  mask = false,
  className = ''
}: { 
  label: string; 
  value?: string; 
  mask?: boolean;
  className?: string;
}) {
  const displayValue = value || 'Not provided';
  const maskedValue = value ? value.replace(/./g, '•').slice(0, -4) + value.slice(-4) : 'Not provided';

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{mask ? maskedValue : displayValue}</p>
    </div>
  );
}
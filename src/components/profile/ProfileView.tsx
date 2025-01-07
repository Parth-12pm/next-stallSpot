'use client';

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  Building2, CreditCard, Eye, EyeOff, Pencil, User } from 'lucide-react';
import { ProfileFormData } from '@/components/profile/types/profile';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileViewProps {
  data: ProfileFormData;
  onEdit: () => void;
}

export function ProfileView({ data, onEdit }: ProfileViewProps) {
  const [showAccount, setShowAccount] = useState(false);
  const session = useSession();
  const isOrganizer = session?.data?.user?.role === 'organizer';
  
  const initials = data.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '??';

  if (session.status === 'loading') {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="max-w-5xl mx-auto shadow-lg backdrop-blur-sm bg-background/95">
        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <div className="absolute -bottom-16 left-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src={data.profilePicture || '/placeholder.svg'} alt={data.name} />
              <AvatarFallback className="text-2xl bg-primary/5">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <Button 
            className="absolute right-6 bottom-4"
            size="sm"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <CardContent className="px-6 pt-20 pb-6">
          <h1 className="text-3xl font-bold mb-6">{data.name}</h1>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview">
                <User className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="details">
                <Building2 className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border">
                    <InfoItem label="Email" value={data.email} />
                    <InfoItem label="Phone" value={data.contact} />
                    <InfoItem label="Address" value={data.address} className="md:col-span-2" />
                    <InfoItem 
                      label="Date of Birth" 
                      value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : undefined} 
                    />
                  </div>
                </div>

                {data.selfDescription && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      About
                    </h3>
                    <div className="p-4 bg-muted/30 rounded-lg border">
                      <p className="text-muted-foreground leading-relaxed">
                        {data.selfDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Company Details */}
              {(isOrganizer || data.companyDetails?.companyName) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Company Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border">
                    <InfoItem label="Company" value={data.companyDetails?.companyName} />
                    <InfoItem label="Type" value={data.companyDetails?.registrationType} />
                    <InfoItem label="Registration No." value={data.companyDetails?.registrationNumber} />
                    {data.companyDetails?.website && (
                      <InfoItem label="Website" value={data.companyDetails.website} isLink />
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Payment Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Payment Information</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAccount(!showAccount)}
                  >
                    {showAccount ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showAccount ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border">
                  <InfoItem label="Bank Name" value={data.accountDetails.bankName} />
                  <InfoItem 
                    label="IFSC Code" 
                    value={data.accountDetails.ifscCode} 
                    mask={!showAccount} 
                  />
                  <InfoItem 
                    label="Account Number" 
                    value={data.accountDetails.accountNumber} 
                    mask={!showAccount}
                    className="md:col-span-2"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  mask = false,
  isLink = false,
  className = "",
}: { 
  label: string; 
  value?: string; 
  mask?: boolean;
  isLink?: boolean;
  className?: string;
}) {
  const displayValue = value || 'Not provided';
  const maskedValue = value ? value.replace(/./g, '•').slice(0, -4) + value.slice(-4) : 'Not provided';
  const finalValue = mask ? maskedValue : displayValue;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLink && value ? (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {finalValue}
        </a>
      ) : (
        <p className="break-all font-medium">{finalValue}</p>
      )}
    </div>
  );
}
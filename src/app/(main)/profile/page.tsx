// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/useAuth";
import { MultiStepProfileForm } from "@/components/profile/MultiStepProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ProfileFormData } from '@/components/profile/types/profile';
import { initialFormData } from '@/components/profile/utils/profile';

export default function ProfilePage() {
  const { status } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>(initialFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast, isEditing]);

  if (status === 'loading' || loading) {
    return (
      <Container className="py-10">
        <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {isEditing ? (
        <MultiStepProfileForm 
          initialData={profileData}
          onComplete={() => setIsEditing(false)} 
        />
      ) : (
        <ProfileView 
          data={profileData} 
          onEdit={() => setIsEditing(true)} 
        />
      )}
    </Container>
  );
}
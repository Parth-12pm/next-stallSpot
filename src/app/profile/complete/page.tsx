// app/profile/complete/page.tsx
'use client';

import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/useAuth";
import { MultiStepProfileForm } from "@/components/profile/MultiStepProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCompletionPage() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <Container className="py-10">
        <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <MultiStepProfileForm isCompletion />
    </Container>
  );
}
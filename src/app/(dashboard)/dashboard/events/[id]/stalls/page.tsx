/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/dashboard/events/[id]/stalls/page.tsx
import { Suspense } from 'react';
import StallManagementContent from './StallManagementContent';
import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StallManagementPage({
  params,
  searchParams
}: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StallManagementContent id={id} />
    </Suspense>
  );
}
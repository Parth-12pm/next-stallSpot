/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/dashboard/events/[id]/preview/page.tsx
import { Suspense } from 'react';
import EventPreviewContent from './EventPreviewContent';
import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventPreviewPage({ 
  params,
  searchParams 
}: PageProps) {
  const { id } = await params;
  // Can also await searchParams if needed
  // const searchParamsData = await searchParams;

  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <EventPreviewContent id={id} />
    </Suspense>
  );
}
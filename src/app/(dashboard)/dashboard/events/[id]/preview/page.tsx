// src/app/(dashboard)/dashboard/events/[id]/preview/page.tsx
import { Suspense } from 'react';
import EventPreviewContent from './EventPreviewContent';
import React from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function EventPreviewPage({ params }: PageProps) {
  // Await the params
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <EventPreviewContent id={id} />
    </Suspense>
  );
}
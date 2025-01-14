// src/app/(dashboard)/dashboard/events/[id]/preview/page.tsx
import { Suspense } from 'react';
import EventPreviewContent from './EventPreviewContent';

interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function EventPreviewPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <EventPreviewContent id={params.id} />
    </Suspense>
  );
}
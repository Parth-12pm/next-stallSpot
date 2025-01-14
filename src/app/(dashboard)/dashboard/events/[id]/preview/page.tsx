// app/(dashboard)/dashboard/events/[id]/preview/page.tsx
import { Suspense } from 'react';
import EventPreviewContent from './EventPreviewContent';

export default function EventPreviewPage({
  params
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <EventPreviewContent id={params.id} />
    </Suspense>
  );
}
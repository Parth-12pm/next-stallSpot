// src/app/(dashboard)/dashboard/events/[id]/edit/page.tsx
import { Suspense } from 'react';
import EditEventContent from './EditEventContent';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditEventPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditEventContent id={id} />
    </Suspense>
  );
}
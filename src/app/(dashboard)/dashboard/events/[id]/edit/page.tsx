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
    <Suspense
      fallback={
        <div className="p-6 space-y-8">
          <div className="mb-6">
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="space-y-4">
            <div className="h-8 w-[250px] animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-[400px] animate-pulse rounded-md bg-gray-100" />
          </div>

          <div className="space-y-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6">
            <div className="h-10 w-[100px] animate-pulse rounded-md bg-gray-200" />
            <div className="h-10 w-[100px] animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      }
    >
      <EditEventContent id={id} />
    </Suspense>
  );
}

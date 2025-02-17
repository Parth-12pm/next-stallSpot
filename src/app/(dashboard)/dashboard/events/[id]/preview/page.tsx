/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/dashboard/events/[id]/preview/page.tsx
import { Suspense } from 'react';
import EventPreviewContent from './EventPreviewContent';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventPreviewPage({ 
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen pb-10">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
              <div className="flex gap-4">
                <div className="h-10 w-[140px] animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-[120px] animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm p-6 space-y-8">
              <div className="space-y-4">
                <div className="h-8 w-[300px] animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-[200px] animate-pulse rounded-md bg-gray-100" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
                      <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
                    </div>
                  ))}
                </div>
                <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EventPreviewContent id={id} />
    </Suspense>
  );
}

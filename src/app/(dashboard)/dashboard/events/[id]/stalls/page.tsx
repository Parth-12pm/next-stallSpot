// /app/(dashboard)/dashboard/events/[id]/stalls/page.tsx
import { Suspense } from 'react';
import StallManagementContent from './StallManagementContent';

export default function StallManagementPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StallManagementContent id={params.id} />
    </Suspense>
  );
}
// src/app/cancel/page.tsx
import { CancelContent } from '@/components/shared/cancel/CancelContent';
import { CancelSkeleton } from '@/components/shared/cancel/CancelSkeleton';
import { Suspense } from 'react';

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CancelSkeleton />}>
        <CancelContent />
      </Suspense>
    </div>
  );
}

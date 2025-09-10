// src/app/404/page.tsx
import { NotFoundContent } from '@/components/shared/not-found/NotFoundContent';
import { NotFoundSkeleton } from '@/components/shared/not-found/NotFoundSkeleton';
import { Suspense } from 'react';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <Suspense fallback={<NotFoundSkeleton />}>
        <NotFoundContent />
      </Suspense>
    </div>
  );
}

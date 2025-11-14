// src/app/[...slug]/page.tsx
import { NotFoundRedirect } from '@/components/shared/NotFoundRedirect';
import { NotFoundSkeleton } from '@/components/shared/not-found/NotFoundSkeleton';
import { Suspense } from 'react';

export default function CatchAllPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <Suspense fallback={<NotFoundSkeleton />}>
        <NotFoundRedirect />
      </Suspense>
    </div>
  );
}

// src/app/_not-found/page.tsx
import { GlobalNotFoundContent } from '@/components/shared/global-not-found/GlobalNotFoundContent';
import { GlobalNotFoundSkeleton } from '@/components/shared/global-not-found/GlobalNotFoundSkeleton';
import { Suspense } from 'react';

export default function GlobalNotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <Suspense fallback={<GlobalNotFoundSkeleton />}>
        <GlobalNotFoundContent />
      </Suspense>
    </div>
  );
}

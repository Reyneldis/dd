// src/app/404/page.tsx
import { NotFoundClient } from '@/components/shared/not-found/NotFoundClient';
import { Suspense } from 'react';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <Suspense fallback={null}>
        <NotFoundClient />
      </Suspense>
    </div>
  );
}

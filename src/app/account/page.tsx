// src/app/account/page.tsx
import { AccountClient } from '@/components/shared/AccountClient';
import { Suspense } from 'react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <span className="text-blue-600 dark:text-blue-300">
              Cargando cuenta...
            </span>
          </div>
        }
      >
        <AccountClient />
      </Suspense>
    </div>
  );
}

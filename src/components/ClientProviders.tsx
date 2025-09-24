// src/components/ClientProviders.tsx
'use client';

import { useSyncUser } from '@/hooks/use-sync-user';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useSyncUser();

  return <>{children}</>;
}

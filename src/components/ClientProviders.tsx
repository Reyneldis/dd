// src/components/ClientProviders.tsx
'use client';

import { useSyncUser } from '@/hooks/use-sync-user';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  useSyncUser();

  return <>{children}</>;
}
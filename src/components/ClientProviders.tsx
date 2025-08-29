'use client';
import { useSyncCartWithBackend } from '@/hooks/use-cart';
import { useSyncUser } from '@/hooks/use-sync-user';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useSyncUser();
  useSyncCartWithBackend();
  return <>{children}</>;
}

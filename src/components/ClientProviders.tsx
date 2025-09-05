// src/components/ClientProviders.tsx
'use client';
import { CartProvider } from '@/contexts/cart-context';
import { useSyncUser } from '@/hooks/use-sync-user';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useSyncUser();
  return <CartProvider>{children}</CartProvider>;
}

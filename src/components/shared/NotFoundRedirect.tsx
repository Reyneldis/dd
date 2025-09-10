// src/components/NotFoundRedirect.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function NotFoundRedirect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página 404 con el parámetro "from"
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', pathname);

    router.replace(`/404?${params.toString()}`);
  }, [pathname, searchParams, router]);

  return null;
}

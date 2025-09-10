// src/app/404/page.tsx
import { NotFoundClient } from '@/components/shared/not-found/NotFoundClient';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <NotFoundClient />
    </div>
  );
}

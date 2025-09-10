// src/app/account/page.tsx
import { AccountClient } from '@/components/shared/AccountClient';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <AccountClient />
    </div>
  );
}

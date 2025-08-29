import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useUserRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN' | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<object | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (isLoaded && user) {
        setLoading(true);
        const res = await fetch(`/api/get-user?clerkId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
          setDbUser(data);
        } else {
          setRole(null);
          setDbUser(null);
        }
        setLoading(false);
      }
    }
    fetchUserRole();
  }, [isLoaded, user]);

  return { role, loading, dbUser };
}

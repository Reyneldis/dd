// src/types/clerk.ts
export interface ClerkUserData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
    verification: {
      status: string;
      strategy: string;
    };
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: number;
  updated_at: number;
}

export interface DbUser {
  id: string;
  email: string;
  clerkId: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  firstName: string | null;
  lastName: string | null;
  avatar: string | null; // Mantener como opcional en la interfaz
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyncCheckResult {
  message: string;
  user?: DbUser;
  clerkUserId: string;
  existsInDb: boolean;
}

export interface DbTestResult {
  message: string;
  userCount: number;
  firstUser: DbUser | null;
  timestamp: string;
  error?: string;
  details?: string;
}

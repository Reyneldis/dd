// src/types/clerk.ts

// Exportar todas las interfaces explícitamente
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
  avatar: string | null;
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

export interface SyncResponse {
  success: boolean;
  user?: DbUser;
  error?: string;
}

export interface DebugInfo {
  clerkUser: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  } | null;
  dbUser: DbTestResult | null;
  syncResult: SyncCheckResult | null;
  forceSyncResult: SyncResponse | null;
  connectionTest: string | null;
  error: string | null;
}

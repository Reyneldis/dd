import { z } from 'zod';

export const syncUserSchema = z.object({
  clerkId: z.string().min(1, 'El clerkId es requerido'),
  email: z.string().email('Email inválido'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url('La URL del avatar no es válida').optional(),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;

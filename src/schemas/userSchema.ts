import { z } from 'zod';

export const userSchema = z.object({
  clerkId: z.string().min(1, 'clerkId es requerido'),
  email: z.string().email('Email inválido'),
  firstName: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido es requerido'),
  role: z.string().optional(), // Puedes refinar con .default('USER') o un enum si lo deseas
  avatar: z.string().url('Avatar debe ser una URL válida').optional(),
});

export type UserInput = z.infer<typeof userSchema>;

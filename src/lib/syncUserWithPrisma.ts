import { prisma } from '@/lib/prisma';
import { UserResource } from '@clerk/types';

/**
 * Sincroniza el usuario Clerk con la base de datos Prisma.
 * @param clerkUser El usuario autenticado de Clerk
 * @returns El usuario de la base de datos
 */
export async function syncUserWithPrisma(clerkUser: UserResource) {
  if (!clerkUser) return null;

  // Buscar usuario por clerkId
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // Si no existe, crearlo
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl || null,
        role: 'USER', // Por defecto, puedes cambiarlo si tienes lógica de admin
      },
    });
  }

  return user;
}

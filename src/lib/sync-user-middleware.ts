// src/lib/sync-user-middleware.ts
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

// <-- CAMBIO: Renombramos la exportación para que coincida con la importación
export async function syncUserWithDatabase(userId: string) {
  if (!userId) {
    console.log('syncUserWithDatabase: No se proporcionó userId.');
    return;
  }

  try {
    console.log(
      `syncUserWithDatabase: Verificando usuario ${userId} en la BD...`,
    );

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      console.log(
        `syncUserWithDatabase: Usuario ${userId} ya existe en la BD.`,
      );
      return;
    }

    console.log(
      `syncUserWithDatabase: Usuario ${userId} no encontrado. Creando...`,
    );

    // <-- CAMBIO: Usamos await con clerkClient()
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl,
        role: 'USER',
        isActive: true,
      },
    });

    console.log(
      `syncUserWithDatabase: Usuario ${newUser.id} creado y sincronizado correctamente.`,
    );
    return newUser;
  } catch (error) {
    console.error(
      `syncUserWithDatabase: Error al sincronizar el usuario ${userId}:`,
      error,
    );
  }
}

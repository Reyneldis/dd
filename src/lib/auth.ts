// src/lib/auth.ts
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { transferCartToUser } from './cart-service';
import { prisma } from './prisma';

export async function handleAuth() {
  const { userId } = await auth();
  if (userId) {
    // Transferir carrito de localStorage a la base de datos
    await transferCartToUser(userId);
  }
  return { userId };
}

// Función para requerir autenticación de administrador
export async function requireAdminAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Obtener el usuario de la base de datos
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Si el usuario no existe en la base de datos, crearlo
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email as string;
    const firstName = sessionClaims?.firstName as string;
    const lastName = sessionClaims?.lastName as string;

    if (!email) {
      redirect('/sign-in');
    }

    await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        firstName,
        lastName,
        role: 'USER', // Rol por defecto
      },
    });

    // Si el usuario recién creado no es administrador, denegar acceso
    redirect('/unauthorized');
  }

  // Verificar si el usuario es administrador
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/unauthorized');
  }

  return { userId, user };
}

// Función genérica para requerir autenticación con roles específicos
export async function requireAuth(requiredRole?: string | string[]) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Obtener el usuario de la base de datos
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Si el usuario no existe en la base de datos, crearlo
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email as string;
    const firstName = sessionClaims?.firstName as string;
    const lastName = sessionClaims?.lastName as string;

    if (!email) {
      redirect('/sign-in');
    }

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        firstName,
        lastName,
        role: 'USER', // Rol por defecto
      },
    });
  }

  // Si se requiere un rol específico
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      redirect('/unauthorized');
    }
  }

  return { userId, user };
}

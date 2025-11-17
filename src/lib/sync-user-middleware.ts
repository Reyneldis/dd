// src/lib/sync-user-middleware.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function syncUserMiddleware(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return;
    }

    // Verificar si el usuario existe en la BD
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
      },
    });

    if (!existingUser) {
      // Si no existe, obtener datos de Clerk y crearlo
      console.log('User not found in DB, syncing:', userId);

      try {
        const clerkResponse = await fetch(
          `https://api.clerk.dev/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          },
        );

        if (clerkResponse.ok) {
          const clerkUser = await clerkResponse.json();

          await prisma.user.create({
            data: {
              clerkId: userId,
              email: clerkUser.email_addresses?.[0]?.email_address || '',
              firstName: clerkUser.first_name || '',
              lastName: clerkUser.last_name || '',
              avatar: clerkUser.image_url, // Incluir avatar
              role: 'USER',
              isActive: true,
            },
          });

          console.log('User synced successfully');
        } else {
          console.error('Failed to fetch user from Clerk');
        }
      } catch (fetchError) {
        console.error('Error fetching user from Clerk:', fetchError);
      }
    }
  } catch (error) {
    console.error('Sync middleware error:', error);
  }
}

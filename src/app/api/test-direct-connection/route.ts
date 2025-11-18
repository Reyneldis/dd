// src/app/api/test-direct-connection/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Probando conexión directa a Supabase...');

    // 1. Probar conexión básica
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Conexión básica:', result);

    // 2. Probar consulta a tabla users
    const userCount = await prisma.user.count();
    console.log('Total usuarios:', userCount);

    // 3. Probar obtener primer usuario
    const firstUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        clerkId: true,
        role: true,
        firstName: true,
        lastName: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      'Primer usuario:',
      firstUser
        ? {
            id: firstUser.id,
            email: firstUser.email,
            clerkId: firstUser.clerkId,
            role: firstUser.role,
            firstName: firstUser.firstName,
            lastName: firstUser.lastName,
            avatar: firstUser.avatar,
            isActive: firstUser.isActive,
          }
        : 'No hay usuarios',
    );

    // 4. Probar búsqueda por clerkId específico
    const testClerkId = 'test_clerk_id';
    const testUser = await prisma.user.findUnique({
      where: { clerkId: testClerkId },
    });

    console.log(
      'Búsqueda por clerkId de prueba:',
      testUser ? 'Encontrado' : 'No encontrado',
    );

    return NextResponse.json({
      success: true,
      message: 'Conexión a Supabase exitosa',
      userCount,
      firstUser: firstUser
        ? {
            id: firstUser.id,
            email: firstUser.email,
            clerkId: firstUser.clerkId,
            role: firstUser.role,
            firstName: firstUser.firstName,
            lastName: firstUser.lastName,
            avatar: firstUser.avatar,
            isActive: firstUser.isActive,
          }
        : null,
      testUserFound: !!testUser,
      timestamp: new Date().toISOString(),
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
    });
  } catch (error) {
    console.error('Error en test-direct-connection:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

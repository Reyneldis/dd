import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { userSchema } from '@/schemas/userSchema';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users - Obtener usuarios (solo admin)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role && role !== 'all') {
      where.role = role.toUpperCase();
    }
    if (isActive && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          createdAt: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 },
    );
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const { clerkId, email, firstName, lastName, role, avatar } = result.data;
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId }, { email }],
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 },
      );
    }
    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        role: (role as Role) || Role.USER,
        avatar,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 },
    );
  }
}

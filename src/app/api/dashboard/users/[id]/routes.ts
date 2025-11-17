// src/app/api/dashboard/users/[id]/route.ts
import { requireRole } from '@/lib/auth-guard';
import {
  getUserById,
  toggleUserActive,
  updateUser,
} from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getUserById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar permisos de administrador
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { id } = await params;
    const body = await request.json();

    const result = await updateUser(id, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating user:', error);

    // Manejar el error de autenticación
    if (error instanceof NextResponse) {
      return error;
    }

    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar permisos de administrador
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { id } = await params;
    const result = await toggleUserActive(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario desactivado correctamente',
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    // Manejar el error de autenticación
    if (error instanceof NextResponse) {
      return error;
    }

    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}

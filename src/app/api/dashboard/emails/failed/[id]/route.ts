// src/app/api/dashboard/emails/failed/[id]/route.ts - VERSIÓN MEJORADA
import { deleteFailedEmail, retryEmail } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`Iniciando reintento de email con ID: ${id}`);

    const result = await retryEmail(id);

    if (result.success) {
      console.log(`Email ${id} marcado para reintento correctamente`);
      return NextResponse.json({
        success: true,
        message: 'Email marcado para reintento correctamente',
      });
    } else {
      console.error(`Error al reintentar email ${id}:`, result.error);
      return NextResponse.json(
        { error: result.error || 'Error al reintentar el email' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(`Error inesperado al reintentar email:`, error);
    return NextResponse.json(
      { error: 'Error inesperado al reintentar el email' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`Eliminando email con ID: ${id}`);

    const result = await deleteFailedEmail(id);

    if (result.success) {
      console.log(`Email ${id} eliminado correctamente`);
      return NextResponse.json({
        success: true,
        message: 'Email eliminado correctamente',
      });
    } else {
      console.error(`Error al eliminar email ${id}:`, result.error);
      return NextResponse.json(
        { error: result.error || 'Error al eliminar el email' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(`Error inesperado al eliminar email:`, error);
    return NextResponse.json(
      { error: 'Error inesperado al eliminar el email' },
      { status: 500 },
    );
  }
}

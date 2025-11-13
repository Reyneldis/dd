export const runtime = 'edge';
// src/app/api/dashboard/emails/failed/[id]/route.ts

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
      console.log(`Email ${id} reintentado correctamente`);
      return NextResponse.json(result); // Devolvemos el resultado completo
    } else {
      console.error(`Error al reintentar email ${id}:`, result.error);
      return NextResponse.json(result, { status: 500 }); // Devolvemos el error con status 500
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

    const result = await deleteFailedEmail(id); // <-- Ahora esta función devuelve { success: ... }

    if (result.success) {
      console.log(`Email ${id} eliminado correctamente`);
      return NextResponse.json(result); // Devolvemos el resultado completo
    } else {
      console.error(`Error al eliminar email ${id}:`, result.error);
      return NextResponse.json(result, { status: 500 }); // Devolvemos el error con status 500
    }
  } catch (error) {
    console.error(`Error inesperado al eliminar email:`, error);
    return NextResponse.json(
      { error: 'Error inesperado al eliminar el email' },
      { status: 500 },
    );
  }
}

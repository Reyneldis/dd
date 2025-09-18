// src/app/api/dashboard/emails/failed/[id]/route.ts
import { retryEmail } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Desempaqueta los parámetros awaitándolos
    const { id } = await params;

    console.log(`Iniciando reintento de email con ID: ${id}`);
    const result = await retryEmail(id);

    if (result.success) {
      console.log(`Email ${id} marcado para reintento correctamente`);
      return NextResponse.json({ success: true });
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

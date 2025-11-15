// src/app/api/dashboard/categories/[id]/route.ts

import { requireRole } from '@/lib/auth-guard';
import { deleteCategory } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Verificar permisos. Si falla, lanzará un NextResponse.
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    // 2. Obtener el ID
    const { id } = await params;
    console.log('DELETE request received for category ID:', id);

    // 3. Llamar al servicio
    const result = await deleteCategory(id);
    console.log('Result from deleteCategory:', result);

    // 4. Manejar la respuesta del servicio
    if (!result.success) {
      console.error('Service returned an error:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    console.error('Error in DELETE API route:', error);

    // 5. MANEJO DE ERRORES MEJORADO
    // Si el error es un NextResponse (lanzado por requireRole), devuélvelo directamente.
    if (error instanceof NextResponse) {
      console.warn('Auth guard error, returning NextResponse directly.');
      return error;
    }

    // Manejar errores de restricción de clave foránea (si el service no lo hizo)
    if (
      error instanceof Error &&
      error.message.includes('foreign key constraint')
    ) {
      return NextResponse.json(
        {
          error:
            'No se puede eliminar la categoría porque tiene productos asociados',
        },
        { status: 400 },
      );
    }

    // Manejar cualquier otro error
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

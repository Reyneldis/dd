// src/app/api/dashboard/categories/[id]/route.ts

import { deleteCategory } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Desempaquetar la promesa para obtener el ID
    const { id } = await params;
    console.log('DELETE request received for category ID:', id);

    const result = await deleteCategory(id);
    console.log('Result from deleteCategory:', result);

    if (!result.success) {
      console.error('Error deleting category:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    console.error('Error in DELETE API route:', error);

    // Manejar error de restricción de clave foránea
    if (
      error instanceof Error &&
      error.message.includes('foreign key constraint')
    ) {
      console.error('Foreign key constraint error');
      return NextResponse.json(
        {
          error:
            'No se puede eliminar la categoría porque tiene productos asociados',
        },
        { status: 400 },
      );
    }

    // Manejar error de categoría no encontrada
    if (error instanceof Error && error.message.includes('not found')) {
      console.error('Category not found error');
      return NextResponse.json(
        { error: 'La categoría no existe' },
        { status: 404 },
      );
    }

    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la categoría' },
      { status: 500 },
    );
  }
}

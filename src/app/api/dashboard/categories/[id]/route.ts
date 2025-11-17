import { requireRole } from '@/lib/auth-guard';
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

// Función para manejar las peticiones GET (obtener detalles de una categoría)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Opcional: Puedes proteger esta ruta si lo deseas
    // await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const { id } = await params;

    const result = await getCategoryById(id);

    if (result.success) {
      // Si se encuentra la categoría, devolver los datos con un 200 OK
      return NextResponse.json(result.data, { status: 200 });
    } else {
      // Si la categoría no se encuentra, devolver un error 404
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('Error en GET API route for category:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// Función para manejar las peticiones DELETE (eliminar una categoría)
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

// <-- AÑADE ESTA FUNCIÓN COMPLETA PARA EDITAR -->
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Verificar permisos de administrador
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    // 2. Obtener el ID de la categoría
    const { id } = await params;

    // 3. Leer los datos del formulario (que viene como FormData)
    const formData = await request.formData();

    const categoryName = formData.get('categoryName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File | string | null;

    // 4. Construir el objeto para el servicio
    const updateData = {
      categoryName,
      slug,
      description,
      mainImage, // Puede ser un File (nueva imagen) o un string (URL existente) o null (eliminar imagen)
    };

    // 5. Llamar a la función del servicio para actualizar
    const result = await updateCategory(id, updateData);

    // 6. Devolver la respuesta al frontend
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error in PUT API route for category:', error);

    // Manejar el error de autenticación
    if (error instanceof NextResponse) {
      return error;
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

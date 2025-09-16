import { deleteCategory, updateCategory } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Usar formData en lugar de json porque estamos enviando archivos
    const formData = await request.formData();

    // Extraer los datos del formData
    const categoryName = formData.get('categoryName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File | string | null;

    // Construir objeto de la categoría
    const categoryData = {
      categoryName,
      slug,
      description,
      mainImage,
    };

    const result = await updateCategory(id, categoryData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error updating category' },
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

    const result = await deleteCategory(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error deleting category' },
      { status: 500 },
    );
  }
}

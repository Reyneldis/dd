import { createCategory, getCategories } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const filters = {
      search,
    };

    const result = await getCategories(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Usar formData en lugar de json porque estamos enviando archivos
    const formData = await request.formData();

    // Extraer los datos del formData
    const categoryName = formData.get('categoryName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File | null;

    // Construir objeto de la categoría
    const categoryData = {
      categoryName,
      slug,
      description,
      mainImage: mainImage || undefined, // Convertir null a undefined
    };

    const result = await createCategory(categoryData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 },
    );
  }
}

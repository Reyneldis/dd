export const runtime = 'edge';
// src/app/api/dashboard/products/route.ts
import { createProduct, getProducts } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status');
    const categoryId = searchParams.get('categoryId') || undefined;
    const featuredParam = searchParams.get('featured');

    // Validar y convertir el parámetro status
    let status: 'ACTIVE' | 'INACTIVE' | undefined;
    if (statusParam === 'ACTIVE' || statusParam === 'INACTIVE') {
      status = statusParam;
    }

    // Validar y convertir el parámetro featured
    let featured: boolean | undefined;
    if (featuredParam === 'true') {
      featured = true;
    } else if (featuredParam === 'false') {
      featured = false;
    }

    const filters = {
      page,
      limit,
      search,
      status,
      categoryId,
      featured,
    };

    const result = await getProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Usar formData en lugar de json porque estamos enviando archivos
    const formData = await request.formData();

    // Extraer los datos del formData
    const productName = formData.get('productName') as string;
    const slug = formData.get('slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE';
    const featured = formData.get('featured') === 'true';

    // Extraer características (viene como string JSON)
    let features: string[] = [];
    const featuresStr = formData.get('features') as string;
    if (featuresStr) {
      try {
        features = JSON.parse(featuresStr);
      } catch (e) {
        console.error('Error parsing features:', e);
      }
    }

    // Extraer imágenes
    const images = formData.getAll('images') as File[];

    // Construir objeto del producto
    const productData = {
      productName,
      slug,
      price,
      stock,
      description,
      categoryId,
      features,
      status,
      featured,
      images,
    };

    const result = await createProduct(productData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 },
    );
  }
}

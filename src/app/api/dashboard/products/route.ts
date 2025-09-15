// src/app/api/dashboard/products/route.ts
import { createProduct, getProducts } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const featured =
      searchParams.get('featured') === 'true'
        ? true
        : searchParams.get('featured') === 'false'
        ? false
        : undefined;

    const filters = {
      page,
      limit,
      search,
      status: status as any,
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
    const body = await request.json();

    const result = await createProduct(body);

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

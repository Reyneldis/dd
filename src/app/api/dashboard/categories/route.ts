// src/app/api/dashboard/categories/route.ts
import { getCategories } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const filters = {
      search,
      page,
      limit,
    };

    const categories = await getCategories(filters);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 },
    );
  }
}

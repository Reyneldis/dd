// src/app/api/dashboard/orders/route.ts
import { getOrders } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || undefined;

    const filters = {
      page,
      limit,
      search,
      status: status as any,
    };

    const result = await getOrders(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 },
    );
  }
}

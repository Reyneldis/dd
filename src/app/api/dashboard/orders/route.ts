export const runtime = 'edge';
// src/app/api/dashboard/orders/route.ts
import { getOrders } from '@/lib/dashboard-service';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10); // Reducimos a 10 para mejor rendimiento
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || undefined;

    const filters: OrderFilters = {
      page,
      limit,
      search,
      status: status as OrderStatus,
    };

    const result = await getOrders(filters);

    // Aseguramos que la respuesta tenga la estructura esperada
    return NextResponse.json({
      success: true,
      data: result.data || [],
      pagination: result.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error fetching orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

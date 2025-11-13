export const runtime = 'edge';
// src/app/api/dashboard/orders/[id]/route.ts
import { getOrderById } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await getOrderById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Error fetching order details' },
      { status: 500 },
    );
  }
}

export const runtime = 'edge';
// src/app/api/dashboard/products/[id]/route.ts
import { deleteProduct, updateProduct } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

interface UpdateProductData {
  productName?: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  features?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
  categoryId?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateProductData;

    const result = await updateProduct(id, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error updating product' },
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

    const result = await deleteProduct(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 },
    );
  }
}

// src/app/api/dashboard/products/[id]/route.ts

import { updateProduct } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // <-- CAMBIO CLAVE: Usar formData en lugar de json
    const formData = await request.formData();

    // Extraer todos los campos del formulario
    const productName = formData.get('productName') as string;
    const slug = formData.get('slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE';
    const featured = formData.get('featured') === 'true';

    // Extraer las características (viene como string JSON)
    let features: string[] = [];
    const featuresStr = formData.get('features') as string;
    if (featuresStr) {
      try {
        features = JSON.parse(featuresStr);
      } catch (e) {
        console.error('Error parsing features:', e);
      }
    }

    // Extraer las imágenes nuevas
    const images = formData.getAll('images') as File[];

    // Construir el objeto de datos para el servicio
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
      images, // <-- Le pasamos los archivos
    };

    const result = await updateProduct(id, productData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 200 });
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

// <-- Asegúrate de tener esta función importada o añadida al final del archivo
import { deleteProduct } from '@/lib/dashboard-service';

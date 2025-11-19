import { updateProduct } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Determinar si la solicitud es JSON o FormData
    const contentType = request.headers.get('content-type') || '';

    let productData;

    if (contentType.includes('multipart/form-data')) {
      // Procesar FormData para manejar archivos
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
      productData = {
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
    } else {
      // Procesar JSON normal
      productData = await request.json();
    }

    const result = await updateProduct(id, productData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
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

    // Lógica para eliminar el producto
    // ...

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 },
    );
  }
}

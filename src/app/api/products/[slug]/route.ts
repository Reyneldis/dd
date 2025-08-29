import { badRequest, notFound, okRaw, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { mapProductToDTO } from '@/lib/product/serializer';
import { productSchema } from '@/schemas/productSchema';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) {
    return notFound('Producto no encontrado');
  }
  return okRaw(mapProductToDTO(product));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireRole(['ADMIN']);
    const { slug } = await params;
    const body = await request.json();
    // Validar con Zod
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return badRequest('Datos inválidos', result.error.flatten());
    }
    const {
      productName,
      price,
      description,
      categoryId,
      features,
      images,
      status,
    } = result.data;
    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (!existingProduct) {
      return notFound('Producto no encontrado');
    }
    // Verificar si la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return badRequest('La categoría especificada no existe');
    }
    // Actualizar el producto y sus relaciones
    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        productName,
        price,
        description,
        categoryId,
        features,
        status,
        images: {
          deleteMany: {},
          create: images || [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    return okRaw(mapProductToDTO(updatedProduct));
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return serverError('Error al actualizar el producto');
  }
}

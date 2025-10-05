import { prisma } from '@/lib/prisma';

// Tipo mínimo para validar items del pedido (desacoplado del tipo del carrito/frontend)
interface OrderItemInput {
  slug: string;
  price: number;
  quantity: number;
}

export const validateOrderItems = async (items: OrderItemInput[]) => {
  try {
    // Obtener todos los productos de una vez para optimizar
    const products = await prisma.product.findMany({
      where: {
        slug: {
          in: items.map(item => item.slug),
        },
      },
      select: {
        id: true,
        slug: true,
        productName: true,
        price: true,
        stock: true,
        status: true,
      },
    });

    // Validar cada item
    const validationErrors: string[] = [];

    for (const item of items) {
      const product = products.find(p => p.slug === item.slug);

      if (!product) {
        validationErrors.push(`Producto no encontrado: ${item.slug}`);
        continue;
      }

      if (product.status !== 'ACTIVE') {
        validationErrors.push(`Producto no disponible: ${product.productName}`);
        continue;
      }

      // Convertir Decimal de Prisma a number para comparación segura
      if (Number(product.price) !== item.price) {
        validationErrors.push(
          `Precio inválido para ${product.productName}: ${item.price} (precio actual: ${product.price})`,
        );
        continue;
      }

      if (product.stock < item.quantity) {
        validationErrors.push(
          `Stock insuficiente para ${product.productName}: ${item.quantity} solicitados, ${product.stock} disponibles`,
        );
        continue;
      }
    }

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    return {
      valid: true,
      products: products.reduce(
        (acc, product) => ({
          ...acc,
          [product.slug]: product,
        }),
        {} as Record<string, (typeof products)[0]>,
      ),
    };
  } catch (error) {
    console.error('Error al validar items del pedido:', error);
    throw error;
  }
};

export const validateOrder = async (items: OrderItemInput[]) => {
  // Validar items
  const validation = await validateOrderItems(items);

  // Si la validación falló, se lanzará un error
  return validation;
};

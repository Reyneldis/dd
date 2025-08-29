import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function markFeaturedProducts() {
  try {
    // Obtener algunos productos para marcarlos como destacados
    const products = await prisma.product.findMany({
      take: 8, // Tomar los primeros 8 productos
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (products.length === 0) {
      console.log('No hay productos en la base de datos');
      return;
    }

    // Marcar los primeros 4 productos como destacados
    const featuredProductIds = products.slice(0, 4).map(p => p.id);

    await prisma.product.updateMany({
      where: {
        id: {
          in: featuredProductIds,
        },
      },
      data: {
        featured: true,
      },
    });

    console.log(
      `✅ ${featuredProductIds.length} productos marcados como destacados`,
    );

    // Verificar los productos destacados
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
      },
      select: {
        id: true,
        productName: true,
        featured: true,
      },
    });

    console.log('Productos destacados actuales:');
    featuredProducts.forEach(product => {
      console.log(`- ${product.productName} (ID: ${product.id})`);
    });
  } catch (error) {
    console.error('Error marcando productos como destacados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

markFeaturedProducts();

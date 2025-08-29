const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Configuración para diferentes entornos
const configs = {
  local: {
    DATABASE_URL: 'postgresql://postgres:root@localhost:5432/deliveryy_db',
    description: 'Base de datos local con pgAdmin',
  },
  neon: {
    DATABASE_URL:
      'postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    description: 'Base de datos Neon en la nube',
  },
};

async function syncToNeon() {
  try {
    console.log('🔄 Iniciando sincronización de local a Neon...');

    // 1. Conectar a la base de datos local
    console.log('📡 Conectando a base de datos local...');
    const localPrisma = new PrismaClient({
      datasources: {
        db: {
          url: configs.local.DATABASE_URL,
        },
      },
    });

    // 2. Exportar todos los datos de local
    console.log('📤 Exportando datos de local...');

    const categories = await localPrisma.category.findMany();
    const products = await localPrisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });
    const users = await localPrisma.user.findMany();
    const orders = await localPrisma.order.findMany({
      include: {
        items: true,
      },
    });
    const reviews = await localPrisma.review.findMany();

    console.log(`📊 Datos exportados:`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos: ${products.length}`);
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Pedidos: ${orders.length}`);
    console.log(`   - Reviews: ${reviews.length}`);

    // 3. Conectar a Neon
    console.log('📡 Conectando a Neon...');
    const neonPrisma = new PrismaClient({
      datasources: {
        db: {
          url: configs.neon.DATABASE_URL,
        },
      },
    });

    // 4. Limpiar datos existentes en Neon (opcional)
    console.log('🧹 Limpiando datos existentes en Neon...');
    await neonPrisma.review.deleteMany();
    await neonPrisma.orderItem.deleteMany();
    await neonPrisma.order.deleteMany();
    await neonPrisma.productImage.deleteMany();
    await neonPrisma.product.deleteMany();
    await neonPrisma.category.deleteMany();
    await neonPrisma.user.deleteMany();

    // 5. Sincronizar datos a Neon
    console.log('📥 Sincronizando datos a Neon...');

    // Usuarios
    for (const user of users) {
      await neonPrisma.user.create({
        data: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }
    console.log(`✅ ${users.length} usuarios sincronizados`);

    // Categorías
    for (const category of categories) {
      await neonPrisma.category.create({
        data: {
          id: category.id,
          categoryName: category.categoryName,
          slug: category.slug,
          description: category.description,
          mainImage: category.mainImage,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      });
    }
    console.log(`✅ ${categories.length} categorías sincronizadas`);

    // Productos
    for (const product of products) {
      await neonPrisma.product.create({
        data: {
          id: product.id,
          productName: product.productName,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          cost: product.cost,
          sku: product.sku,
          barcode: product.barcode,
          weight: product.weight,
          weightUnit: product.weightUnit,
          inventoryQuantity: product.inventoryQuantity,
          inventoryPolicy: product.inventoryPolicy,
          allowBackorder: product.allowBackorder,
          featured: product.featured,
          status: product.status,
          categoryId: product.categoryId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });

      // Imágenes del producto
      for (const image of product.images) {
        await neonPrisma.productImage.create({
          data: {
            id: image.id,
            productId: image.productId,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
            isPrimary: image.isPrimary,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
          },
        });
      }
    }
    console.log(`✅ ${products.length} productos sincronizados`);

    // Pedidos
    for (const order of orders) {
      await neonPrisma.order.create({
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          status: order.status,
          total: order.total,
          subtotal: order.subtotal,
          tax: order.tax || null,
          shipping: order.shipping || null,
          discount: order.discount || null,
          currency: order.currency || null,
          shippingAddress: order.shippingAddress || null,
          billingAddress: order.billingAddress || null,
          notes: order.notes || null,
          customerEmail: order.customerEmail || null,
          customerName: order.customerName || null,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });

      // Items del pedido
      for (const item of order.items) {
        await neonPrisma.orderItem.create({
          data: {
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
        });
      }
    }
    console.log(`✅ ${orders.length} pedidos sincronizados`);

    // Reviews
    for (const review of reviews) {
      await neonPrisma.review.create({
        data: {
          id: review.id,
          productId: review.productId,
          userId: review.userId,
          rating: review.rating,
          title: review.title,
          content: review.content,
          status: review.status,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        },
      });
    }
    console.log(`✅ ${reviews.length} reviews sincronizados`);

    // 6. Cerrar conexiones
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();

    console.log('🎉 ¡Sincronización completada exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos: ${products.length}`);
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Pedidos: ${orders.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
  }
}

syncToNeon();

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

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

async function deployToProduction() {
  try {
    console.log('🚀 Iniciando despliegue a producción...');
    console.log('');

    // 1. Sincronizar datos a Neon
    console.log('📤 Sincronizando datos locales a Neon...');
    const localPrisma = new PrismaClient({
      datasources: {
        db: {
          url: configs.local.DATABASE_URL,
        },
      },
    });

    const neonPrisma = new PrismaClient({
      datasources: {
        db: {
          url: configs.neon.DATABASE_URL,
        },
      },
    });

    // Exportar datos
    const categories = await localPrisma.category.findMany();
    const products = await localPrisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });
    const users = await localPrisma.user.findMany();
    const reviews = await localPrisma.review.findMany({
      include: {
        user: true,
        product: true,
      },
    });

    console.log(`📊 Datos a sincronizar:`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos: ${products.length}`);
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Reviews/Testimonios: ${reviews.length}`);

    // Limpiar y sincronizar (en orden correcto para evitar errores de FK)
    await neonPrisma.review.deleteMany();
    await neonPrisma.productImage.deleteMany();
    await neonPrisma.orderItem.deleteMany();
    await neonPrisma.order.deleteMany();
    await neonPrisma.cartItem.deleteMany();
    await neonPrisma.wishlistItem.deleteMany();
    await neonPrisma.product.deleteMany();
    await neonPrisma.category.deleteMany();
    await neonPrisma.user.deleteMany();

    // Sincronizar datos
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

    for (const review of reviews) {
      await neonPrisma.review.create({
        data: {
          id: review.id,
          productId: review.productId,
          userId: review.userId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          status: review.status,
          isApproved: review.isApproved,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        },
      });
    }

    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();

    console.log('✅ Datos sincronizados exitosamente a Neon');
    console.log('');

    // 2. Instrucciones de despliegue
    console.log('📋 Pasos para desplegar a Vercel:');
    console.log('');
    console.log('1. Asegúrate de que tu .env.local tenga la URL de Neon:');
    console.log(
      '   DATABASE_URL="postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"',
    );
    console.log('');
    console.log('2. Configura las variables de entorno en Vercel:');
    console.log('   - Ve a tu proyecto en Vercel Dashboard');
    console.log('   - Settings > Environment Variables');
    console.log('   - Agrega DATABASE_URL con la URL de Neon');
    console.log('   - Agrega las demás variables (CLERK_SECRET_KEY, etc.)');
    console.log('');
    console.log('3. Sube los cambios a GitHub:');
    console.log('   git add .');
    console.log('   git commit -m "Sincronizar datos con Neon"');
    console.log('   git push');
    console.log('');
    console.log('4. Vercel se desplegará automáticamente');
    console.log('');
    console.log(
      '🎉 ¡Tu aplicación estará disponible con los datos actualizados!',
    );
  } catch (error) {
    console.error('❌ Error durante el despliegue:', error);
  }
}

// Verificar si se ejecuta con argumentos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('🚀 Script de despliegue a producción');
  console.log('');
  console.log('Uso: node scripts/deploy-to-production.js');
  console.log('');
  console.log('Este script:');
  console.log('1. Sincroniza datos locales a Neon');
  console.log('2. Proporciona instrucciones para Vercel');
  console.log('');
  console.log('Opciones:');
  console.log('  --help, -h  Mostrar esta ayuda');
} else {
  deployToProduction();
}

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configurar Prisma para la base de datos local
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

// Configurar Prisma para Neon
const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Función para convertir features a array
function parseFeatures(features) {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [features];
    } catch {
      return [features];
    }
  }
  return [];
}

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de datos a Neon...');

    // Verificar qué tablas existen
    console.log('📊 Verificando tablas disponibles...');
    const tables = await localPrisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    const tableNames = tables.map(t => t.table_name);
    console.log('📋 Tablas encontradas:', tableNames);

    // Migrar solo las tablas que existen
    let migratedData = {};

    // Migrar categorías si existe
    if (tableNames.includes('categories')) {
      console.log('📂 Migrando categorías...');
      const categories = await localPrisma.$queryRaw`SELECT * FROM categories`;
      migratedData.categories = categories;
      console.log(`✅ ${categories.length} categorías exportadas`);
    }

    // Migrar productos si existe
    if (tableNames.includes('products')) {
      console.log('📦 Migrando productos...');
      const products = await localPrisma.$queryRaw`
        SELECT 
          id, slug, "productName", price, stock, description, features, 
          status, featured, "createdAt", "updatedAt", "categoryId"
        FROM products
      `;
      migratedData.products = products;
      console.log(`✅ ${products.length} productos exportados`);
    }

    // Migrar imágenes si existe
    if (tableNames.includes('product_images')) {
      console.log('🖼️ Migrando imágenes...');
      const images = await localPrisma.$queryRaw`SELECT * FROM product_images`;
      migratedData.images = images;
      console.log(`✅ ${images.length} imágenes exportadas`);
    }

    // Conectar a Neon
    console.log('🌐 Conectando a Neon...');
    await neonPrisma.$connect();
    console.log('✅ Conexión a Neon establecida');

    // Limpiar datos en Neon
    console.log('🧹 Limpiando datos existentes...');
    if (tableNames.includes('product_images'))
      await neonPrisma.productImage.deleteMany();
    if (tableNames.includes('products')) await neonPrisma.product.deleteMany();
    if (tableNames.includes('categories'))
      await neonPrisma.category.deleteMany();
    console.log('✅ Datos limpiados');

    // Migrar a Neon
    console.log('📥 Migrando a Neon...');

    // Migrar categorías
    if (migratedData.categories) {
      console.log(
        `📂 Migrando ${migratedData.categories.length} categorías a Neon...`,
      );
      for (const cat of migratedData.categories) {
        await neonPrisma.category.create({
          data: {
            id: cat.id,
            categoryName: cat.categoryName,
            slug: cat.slug,
            description: cat.description,
            mainImage: cat.mainImage,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
          },
        });
      }
      console.log('✅ Categorías migradas a Neon');
    }

    // Migrar productos
    if (migratedData.products) {
      console.log(
        `📦 Migrando ${migratedData.products.length} productos a Neon...`,
      );
      for (const product of migratedData.products) {
        const features = parseFeatures(product.features);
        await neonPrisma.product.create({
          data: {
            id: product.id,
            slug: product.slug,
            productName: product.productName,
            price: product.price,
            description: product.description,
            features: features,
            status: product.status?.toUpperCase() || 'ACTIVE',
            featured: product.featured,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          },
        });
      }
      console.log('✅ Productos migrados a Neon');
    }

    // Migrar imágenes
    if (migratedData.images) {
      console.log(
        `🖼️ Migrando ${migratedData.images.length} imágenes a Neon...`,
      );
      for (const image of migratedData.images) {
        await neonPrisma.productImage.create({
          data: {
            id: image.id,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
            isPrimary: image.isPrimary,
            productId: image.productId,
            createdAt: image.createdAt,
          },
        });
      }
      console.log('✅ Imágenes migradas a Neon');
    }

    console.log('🎉 ¡Migración completada exitosamente!');
    console.log('📊 Resumen:');
    if (migratedData.categories)
      console.log(`  - Categorías: ${migratedData.categories.length}`);
    if (migratedData.products)
      console.log(`  - Productos: ${migratedData.products.length}`);
    if (migratedData.images)
      console.log(`  - Imágenes: ${migratedData.images.length}`);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

// Ejecutar migración
migrateData()
  .then(() => {
    console.log('🚀 Migración finalizada');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Error en la migración:', error);
    process.exit(1);
  });

// src/lib/test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Probar conexión
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL exitosa');

    // Probar consulta simple
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('📅 Fecha y hora del servidor:', result);

    // Contar categorías
    const categoryCount = await prisma.category.count();
    console.log(`📦 Categorías en la base de datos: ${categoryCount}`);

    // Contar productos
    const productCount = await prisma.product.count();
    console.log(`🛍️ Productos en la base de datos: ${productCount}`);

    // Contar órdenes
    const orderCount = await prisma.order.count();
    console.log(`📋 Órdenes en la base de datos: ${orderCount}`);
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

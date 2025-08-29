const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('🔄 Exportando datos de la base de datos local...');

    // Exportar categorías
    const categories = await prisma.category.findMany();
    console.log(`📂 Categorías: ${categories.length}`);

    // Exportar productos
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });
    console.log(`📦 Productos: ${products.length}`);

    // Exportar usuarios
    const users = await prisma.user.findMany();
    console.log(`👥 Usuarios: ${users.length}`);

    // Exportar pedidos
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });
    console.log(`🛒 Pedidos: ${orders.length}`);

    // Exportar reviews
    const reviews = await prisma.review.findMany();
    console.log(`⭐ Reviews: ${reviews.length}`);

    // Crear objeto con todos los datos
    const exportData = {
      categories,
      products,
      users,
      orders,
      reviews,
      exportedAt: new Date().toISOString(),
    };

    // Guardar en archivo
    const fs = require('fs');
    fs.writeFileSync('exported-data.json', JSON.stringify(exportData, null, 2));

    console.log('✅ Datos exportados a exported-data.json');
    console.log('📊 Resumen:');
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos: ${products.length}`);
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Pedidos: ${orders.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
  } catch (error) {
    console.error('❌ Error exportando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();

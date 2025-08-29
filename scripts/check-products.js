const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 Verificando productos en la base de datos...');

    const products = await prisma.product.findMany();
    console.log(`📦 Total de productos: ${products.length}`);

    if (products.length > 0) {
      console.log('📋 Productos encontrados:');
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.slug})`);
        console.log(`       Precio: $${product.price}`);
        console.log(
          `       Categoría: ${product.categoryId || 'Sin categoría'}`,
        );
        console.log(`       Estado: ${product.status}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay productos en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();

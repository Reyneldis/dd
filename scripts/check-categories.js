const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('🔍 Verificando categorías en la base de datos...');

    const categories = await prisma.category.findMany();
    console.log(`📂 Total de categorías: ${categories.length}`);

    if (categories.length > 0) {
      console.log('📋 Categorías encontradas:');
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.categoryName} (${cat.slug})`);
        console.log(
          `       Descripción: ${cat.description || 'Sin descripción'}`,
        );
        console.log(`       Imagen: ${cat.mainImage || 'Sin imagen'}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay categorías en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();

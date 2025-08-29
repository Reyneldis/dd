import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listCategories() {
  try {
    console.log('🔍 Listando todas las categorías...');

    const categories = await prisma.category.findMany();

    if (categories.length > 0) {
      console.log('--- Categorías en la base de datos ---');
      categories.forEach(category => {
        const generatedSlug = category.categoryName
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '');
        console.log(`- Nombre: ${category.categoryName}, Slug en DB: ${category.slug}, Slug Generado: ${generatedSlug}`);
      });
      console.log('------------------------------------');
    } else {
      console.log('🤷 No se encontraron categorías en la base de datos.');
    }

  } catch (error) {
    console.error('❌ Error al listar las categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCategories();
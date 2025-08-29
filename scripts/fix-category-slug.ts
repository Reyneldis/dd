import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCategorySlug() {
  try {
    console.log('🔧 Iniciando corrección de slug de categoría...');

    const wrongSlug = 'electrdomesticos';
    const correctSlug = 'electrodomesticos';

    const categoryToFix = await prisma.category.findUnique({
      where: { slug: wrongSlug },
    });

    if (categoryToFix) {
      await prisma.category.update({
        where: { id: categoryToFix.id },
        data: { slug: correctSlug },
      });
      console.log(`✅ Slug de la categoría "${categoryToFix.categoryName}" corregido de "${wrongSlug}" a "${correctSlug}".`);
    } else {
      console.log(`🤷 No se encontró ninguna categoría con el slug "${wrongSlug}".`);
    }

  } catch (error) {
    console.error('❌ Error al corregir el slug de la categoría:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategorySlug();

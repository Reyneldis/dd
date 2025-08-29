import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCategoryName() {
  try {
    console.log('🔧 Iniciando corrección de nombre de categoría...');

    const slugToFind = 'electrodomesticos';
    const correctName = 'Electrodomésticos';

    const categoryToFix = await prisma.category.findUnique({
      where: { slug: slugToFind },
    });

    if (categoryToFix) {
      await prisma.category.update({
        where: { id: categoryToFix.id },
        data: { categoryName: correctName },
      });
      console.log(`✅ Nombre de la categoría con slug "${slugToFind}" corregido a "${correctName}".`);
    } else {
      console.log(`🤷 No se encontró ninguna categoría con el slug "${slugToFind}".`);
    }

  } catch (error) {
    console.error('❌ Error al corregir el nombre de la categoría:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategoryName();

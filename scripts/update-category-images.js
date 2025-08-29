const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategoryImages() {
  try {
    console.log('🔄 Actualizando imágenes de categorías...');

    const imageUpdates = [
      {
        slug: 'comida',
        mainImage: '/img/categories/comida.webp',
      },
      {
        slug: 'aseos',
        mainImage: '/img/categories/aseos.webp',
      },
      {
        slug: 'electrodomesticos',
        mainImage: '/img/categories/electrodomesticos.webp',
      },
    ];

    for (const update of imageUpdates) {
      const category = await prisma.category.findUnique({
        where: { slug: update.slug },
      });

      if (category) {
        await prisma.category.update({
          where: { slug: update.slug },
          data: { mainImage: update.mainImage },
        });
        console.log(`✅ Imagen actualizada para: ${category.categoryName}`);
      } else {
        console.log(`⚠️  Categoría no encontrada: ${update.slug}`);
      }
    }

    console.log('🎉 Proceso completado!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategoryImages();

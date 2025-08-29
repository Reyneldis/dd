const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleCategories() {
  try {
    console.log('🔄 Creando categorías de muestra...');

    const categories = [
      {
        categoryName: 'Comida',
        slug: 'comida',
        description: 'Productos para la alimentación de tu hogar',
        mainImage: '/img/categories/comida.jpg',
      },
      {
        categoryName: 'Aseos',
        slug: 'aseos',
        description: 'Productos para el aseo del hogar',
        mainImage: '/img/categories/aseos.jpg',
      },
      {
        categoryName: 'Electrodomésticos',
        slug: 'electrodomesticos',
        description: 'Producto electrodomésticos para tu hogar',
        mainImage: '/img/categories/electrodomesticos.jpg',
      },
    ];

    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug },
      });

      if (!existingCategory) {
        const newCategory = await prisma.category.create({
          data: category,
        });
        console.log(`✅ Categoría creada: ${newCategory.categoryName}`);
      } else {
        console.log(
          `⚠️  Categoría ya existe: ${existingCategory.categoryName}`,
        );
      }
    }

    console.log('🎉 Proceso completado!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleCategories();

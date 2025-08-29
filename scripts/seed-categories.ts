import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log('🌱 Iniciando seed de categorías...');

    // Categorías iniciales con imágenes locales
    const categories = [
      {
        categoryName: 'Comida',
        slug: 'comida',
        mainImage: '/img/comida/comida.webp',
        description: 'Productos alimenticios frescos y procesados',
      },
      {
        categoryName: 'Aseos',
        slug: 'aseos',
        mainImage: '/img/aseos/aseos.webp',
        description: 'Productos de limpieza y cuidado personal',
      },
      {
        categoryName: 'Electrodomésticos',
        slug: 'electrodomesticos',
        mainImage: '/img/electrodomesticos/electrodomesticos.webp',
        description: 'Electrodomésticos y aparatos electrónicos',
      },
    ];

    for (const category of categories) {
      // Verificar si la categoría ya existe
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug },
      });

      if (existingCategory) {
        console.log(`✅ Categoría "${category.categoryName}" ya existe`);
        continue;
      }

      // Crear la categoría
      const newCategory = await prisma.category.create({
        data: category,
      });

      console.log(`✅ Categoría "${newCategory.categoryName}" creada`);
    }

    console.log('🎉 Seed de categorías completado');
  } catch (error) {
    console.error('❌ Error en seed de categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();

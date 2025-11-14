// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando poblado de la base de datos...');

  // 1. Crear las categorías que faltan
  const categoriesToCreate = [
    {
      categoryName: 'Aseos',
      slug: 'aseos',
      description: 'Productos de limpieza y aseo para el hogar.',
      mainImage: '/uploads/general/af7428ac-0308-4d44-8670-7a17570a926a.webp', // Usa las imágenes que ya subiste
    },
    {
      categoryName: 'Comida',
      slug: 'comida',
      description: 'Alimentos y comidas preparadas.',
      mainImage: '/uploads/general/6ad6c4ca-a7e8-4351-9f67-1e57191c5f93.webp', // Usa las imágenes que ya subiste
    },
    {
      categoryName: 'Electrodomésticos',
      slug: 'electrodomesticos',
      description: 'Aparatos y dispositivos para el hogar.',
      mainImage: '/uploads/general/935e193f-3f63-4630-9f2c-c6f62eefd85a.webp', // Usa las imágenes que ya subiste
    },
  ];

  for (const categoryData of categoriesToCreate) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData, // Actualiza si ya existe
      create: categoryData, // Crea si no existe
    });
  }

  console.log('Categorías pobladas correctamente.');

  // 2. (Opcional) Crear productos para cada categoría
  // ... Aquí podrías añadir la lógica para crear productos ...
  // Por ejemplo, para "Electrodomésticos":
  const electrodomesticosCategory = await prisma.category.findUnique({
    where: { slug: 'electrodomesticos' },
  });

  if (electrodomesticosCategory) {
    // ... tu lógica para crear productos de ejemplo aquí ...
    console.log('Productos para electrodomésticos poblados.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

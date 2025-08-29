import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const categorySlugToDelete = 'electrodomesticos';

async function main() {
  console.log(`Intentando eliminar la categoría con slug: "${categorySlugToDelete}" y todos sus productos asociados...`);

  const result = await prisma.category.delete({
    where: {
      slug: categorySlugToDelete,
    },
  });

  console.log(`La categoría "${result.categoryName}" y sus productos asociados han sido eliminados exitosamente.`);
}

main()
  .catch((e) => {
    // P2025 is the error code for "Record to delete does not exist."
    if (e.code === 'P2025') {
      console.log(`La categoría con slug "${categorySlugToDelete}" no fue encontrada. Puede que ya haya sido eliminada.`);
    } else {
      console.error('Ocurrió un error al intentar eliminar la categoría:', e);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

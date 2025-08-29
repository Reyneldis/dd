import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  for (const product of products) {
    const searchText = `${product.productName} ${product.description || ''} ${product.category.categoryName}`;
    await prisma.$executeRaw`
      UPDATE products
      SET "searchText" = to_tsvector('spanish', ${searchText})
      WHERE id = ${product.id}
    `;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Buscar o crear la categoría electrodomésticos
  const category = await prisma.category.upsert({
    where: { slug: 'electrodomesticos' },
    update: {},
    create: {
      categoryName: 'Electrodomésticos',
      slug: 'electrodomesticos',
      description: 'Aparatos y dispositivos para el hogar',
      mainImage: '/img/categorias/electrodomesticos.jpg',
    },
  });

  // Productos de ejemplo
  const productsData = [
    {
      slug: 'licuadora-oster',
      productName: 'Licuadora Oster',
      price: 120,
      description: 'Licuadora de alta potencia para jugos y batidos.',
      features: ['600W', 'Vaso de vidrio', '3 velocidades'],
      status: 'ACTIVE',
      stock: 10,
      images: [
        {
          url: '/img/productos/licuadora-oster.jpg',
          alt: 'Licuadora Oster',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      slug: 'microondas-lg',
      productName: 'Microondas LG',
      price: 210,
      description: 'Microondas digital con grill y descongelado rápido.',
      features: ['Grill', '20L', 'Descongelado automático'],
      status: 'ACTIVE',
      stock: 7,
      images: [
        {
          url: '/img/productos/microondas-lg.jpg',
          alt: 'Microondas LG',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
    {
      slug: 'refrigerador-mabe',
      productName: 'Refrigerador Mabe',
      price: 650,
      description: 'Refrigerador de bajo consumo energético.',
      features: ['No Frost', '320L', 'Eficiencia A+'],
      status: 'ACTIVE',
      stock: 5,
      images: [
        {
          url: '/img/productos/refrigerador-mabe.jpg',
          alt: 'Refrigerador Mabe',
          isPrimary: true,
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const data of productsData) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        slug: data.slug,
        productName: data.productName,
        price: data.price,
        description: data.description,
        category: { connect: { id: category.id } },
        features: data.features,
        status: data.status as 'ACTIVE' | 'INACTIVE',
        stock: data.stock,
        images: {
          create: data.images,
        },
      },
    });
  }

  console.log(
    'Productos y categoría electrodomésticos poblados correctamente.',
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

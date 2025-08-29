import { prisma } from '../src/lib/prisma';

async function main() {
  // Buscar usuario específico por email
  const user = await prisma.user.findFirst({
    where: { email: 'reyneldis537@gmail.com' },
  });
  const product = await prisma.product.findFirst();

  if (!user || !product) {
    console.error('Faltan usuarios o productos en la base de datos.');
    process.exit(1);
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-prueba`,
      userId: user.id,
      status: 'PENDING',
      subtotal: product.price,
      total: product.price,
      items: {
        create: [
          {
            productId: product.id,
            price: product.price,
            quantity: 1,
            total: product.price,
          },
        ],
      },
    },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  console.log('Pedido de prueba creado:', order);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

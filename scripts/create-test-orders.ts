import { OrderStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Obtener productos existentes
  const products = await prisma.product.findMany({
    take: 10,
  });

  if (products.length === 0) {
    console.log(
      'No hay productos disponibles. Crea algunos productos primero.',
    );
    return;
  }

  // Crear órdenes de prueba
  for (let i = 0; i < 10; i++) {
    // Seleccionar productos aleatorios para esta orden
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items por orden
    const selectedProducts = [];
    const usedIndices = new Set<number>();

    while (
      selectedProducts.length < numItems &&
      selectedProducts.length < products.length
    ) {
      const randomIndex = Math.floor(Math.random() * products.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedProducts.push(products[randomIndex]);
      }
    }

    // Crear items de la orden
    const orderItems = selectedProducts.map(product => {
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
      const price = product.price;
      const total = price * quantity;

      return {
        productId: product.id,
        quantity,
        price,
        total,
      };
    });

    // Calcular totales
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * 0.1; // 10% de impuestos
    const shippingAmount = 5; // Envío fijo
    const total = subtotal + taxAmount + shippingAmount;

    // Generar datos de contacto y envío
    const customerName = `Customer ${i + 1}`;
    const customerEmail = `customer${i + 1}@example.com`;
    const customerPhone = `555-123-${String(i + 1).padStart(4, '0')}`;

    const street = `${i + 1} Main St`;
    const city = 'Anytown';
    const state = 'CA';
    const zip = '12345';
    const country = 'USA';

    try {
      // Crear la orden con relaciones anidadas - CORREGIDO
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${i + 1000}`,
          status: OrderStatus.PENDING,
          subtotal,
          taxAmount,
          shippingAmount,
          total,
          customerEmail,
          contactInfo: {
            create: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
          },
          shippingAddress: {
            create: {
              street,
              city,
              state,
              zip,
              country,
            },
          },
          items: {
            create: orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });

      console.log(`Orden creada: ${order.orderNumber}`);
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  }

  console.log('Órdenes de prueba creadas exitosamente');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

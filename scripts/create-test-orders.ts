// scripts/create-test-orders.ts - Crear órdenes de prueba
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestOrders() {
  try {
    console.log('🔍 Verificando órdenes existentes...');

    const existingOrders = await prisma.order.count();
    console.log(`📊 Total de órdenes existentes: ${existingOrders}`);

    if (existingOrders > 0) {
      console.log('✅ Ya hay órdenes en la base de datos');
      return;
    }

    console.log('📝 Creando órdenes de prueba...');

    // Crear algunas categorías de prueba si no existen
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      console.log('📂 Creando categorías de prueba...');
      await prisma.category.createMany({
        data: [
          {
            categoryName: 'Electrodomésticos',
            slug: 'electrodomesticos',
            description: 'Electrodomésticos para el hogar',
          },
          {
            categoryName: 'Comida',
            slug: 'comida',
            description: 'Productos alimenticios',
          },
        ],
      });
    }

    // Crear algunos productos de prueba
    const products = await prisma.product.findMany();
    if (products.length === 0) {
      console.log('🛍️ Creando productos de prueba...');
      const category = await prisma.category.findFirst();
      if (category) {
        await prisma.product.createMany({
          data: [
            {
              productName: 'Refrigerador Samsung',
              slug: 'refrigerador-samsung',
              price: 1200.0,
              stock: 5,
              description: 'Refrigerador de 300L',
              features: ['A+', 'No Frost', '300L'],
              categoryId: category.id,
            },
            {
              productName: 'Arroz Premium',
              slug: 'arroz-premium',
              price: 15.5,
              stock: 100,
              description: 'Arroz de alta calidad',
              features: ['1kg', 'Premium', 'Orgánico'],
              categoryId: category.id,
            },
          ],
        });
      }
    }

    // Crear órdenes de prueba
    const testOrders = [
      {
        orderNumber: 'ORD-001',
        status: 'PENDING',
        subtotal: 1200.0,
        taxAmount: 120.0,
        shippingAmount: 50.0,
        total: 1370.0,
        customerEmail: 'cliente1@test.com',
        contactInfo: {
          name: 'Juan Pérez',
          email: 'cliente1@test.com',
          phone: '+53 5555 1234',
        },
        shippingAddress: {
          street: 'Calle 23 #456',
          city: 'La Habana',
          state: 'La Habana',
          zip: '10400',
          country: 'Cuba',
        },
      },
      {
        orderNumber: 'ORD-002',
        status: 'CONFIRMED',
        subtotal: 31.0,
        taxAmount: 3.1,
        shippingAmount: 10.0,
        total: 44.1,
        customerEmail: 'cliente2@test.com',
        contactInfo: {
          name: 'María García',
          email: 'cliente2@test.com',
          phone: '+53 5555 5678',
        },
        shippingAddress: {
          street: 'Avenida 5ta #789',
          city: 'Santiago de Cuba',
          state: 'Santiago de Cuba',
          zip: '90100',
          country: 'Cuba',
        },
      },
    ];

    for (const orderData of testOrders) {
      const { contactInfo, shippingAddress, ...orderFields } = orderData;

      // Crear la orden
      const order = await prisma.order.create({
        data: {
          ...orderFields,
          contactInfo: {
            create: contactInfo,
          },
          shippingAddress: {
            create: shippingAddress,
          },
        },
      });

      // Agregar items a la orden
      const products = await prisma.product.findMany();
      if (products.length > 0) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
            productName: products[0].productName,
            productSku: products[0].slug,
            total: products[0].price,
          },
        });
      }

      console.log(`✅ Orden creada: ${order.orderNumber}`);
    }

    console.log('🎉 Órdenes de prueba creadas exitosamente');
  } catch (error) {
    console.error('❌ Error creando órdenes de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders();

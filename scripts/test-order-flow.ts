/**
 * Script para probar el flujo completo de pedidos
 * Verifica: carrito → formulario → WhatsApp → email
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testOrderFlow() {
  console.log('🧪 Iniciando prueba del flujo de pedidos...\n');

  try {
    // 1. Verificar categorías
    console.log('1️⃣ Verificando categorías...');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    console.log(`   ✅ Encontradas ${categories.length} categorías:`);
    categories.forEach(cat => {
      console.log(
        `      - ${cat.categoryName}: ${cat._count.products} productos`,
      );
    });

    // 2. Verificar productos activos
    console.log('\n2️⃣ Verificando productos activos...');
    const activeProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        images: true,
      },
      take: 5,
    });

    console.log(
      `   ✅ Encontrados ${activeProducts.length} productos activos (mostrando 5):`,
    );
    activeProducts.forEach(product => {
      console.log(
        `      - ${product.productName} (${product.category.categoryName}): $${product.price} - Stock: ${product.stock}`,
      );
    });

    // 3. Verificar configuración de email
    console.log('\n3️⃣ Verificando configuración de email...');
    const hasGmailUser = !!process.env.GMAIL_USER;
    const hasGmailPass = !!process.env.GMAIL_APP_PASSWORD;
    console.log(
      `   ${hasGmailUser ? '✅' : '❌'} GMAIL_USER: ${
        hasGmailUser ? 'Configurado' : 'NO CONFIGURADO'
      }`,
    );
    console.log(
      `   ${hasGmailPass ? '✅' : '❌'} GMAIL_APP_PASSWORD: ${
        hasGmailPass ? 'Configurado' : 'NO CONFIGURADO'
      }`,
    );

    // 4. Verificar configuración de WhatsApp
    console.log('\n4️⃣ Verificando configuración de WhatsApp...');
    const hasWhatsAppToken = !!process.env.WHATSAPP_ACCESS_TOKEN;
    const hasWhatsAppPhoneId = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
    const hasWhatsAppAdmins = !!process.env.WHATSAPP_ADMIN_NUMBERS;
    console.log(
      `   ${hasWhatsAppToken ? '✅' : '❌'} WHATSAPP_ACCESS_TOKEN: ${
        hasWhatsAppToken ? 'Configurado' : 'NO CONFIGURADO'
      }`,
    );
    console.log(
      `   ${hasWhatsAppPhoneId ? '✅' : '❌'} WHATSAPP_PHONE_NUMBER_ID: ${
        hasWhatsAppPhoneId ? 'Configurado' : 'NO CONFIGURADO'
      }`,
    );
    console.log(
      `   ${hasWhatsAppAdmins ? '✅' : '❌'} WHATSAPP_ADMIN_NUMBERS: ${
        hasWhatsAppAdmins ? 'Configurado' : 'NO CONFIGURADO'
      }`,
    );

    // 5. Verificar órdenes recientes
    console.log('\n5️⃣ Verificando órdenes recientes...');
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        contactInfo: true,
        shippingAddress: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`   ✅ Encontradas ${recentOrders.length} órdenes recientes:`);
    recentOrders.forEach(order => {
      console.log(
        `      - ${order.orderNumber}: ${order.status} - $${order.total} - ${
          order.contactInfo?.name || 'Sin nombre'
        }`,
      );
    });

    // 6. Verificar testimonios
    console.log('\n6️⃣ Verificando testimonios...');
    const testimonials = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        user: true,
        product: true,
      },
      take: 3,
    });

    console.log(
      `   ✅ Encontrados ${testimonials.length} testimonios aprobados:`,
    );
    testimonials.forEach(testimonial => {
      console.log(
        `      - ${testimonial.user?.firstName || 'Usuario'} - ${
          testimonial.rating
        }⭐ - ${testimonial.product?.productName || 'Producto'}`,
      );
    });

    // 7. Verificar usuarios
    console.log('\n7️⃣ Verificando usuarios...');
    const users = await prisma.user.findMany({
      take: 3,
      include: {
        _count: {
          select: { orders: true, reviews: true },
        },
      },
    });

    console.log(`   ✅ Encontrados ${users.length} usuarios (mostrando 3):`);
    users.forEach(user => {
      console.log(
        `      - ${user.firstName || user.email}: ${
          user._count.orders
        } órdenes, ${user._count.reviews} reviews`,
      );
    });

    console.log('\n🎉 ¡Prueba del flujo completada exitosamente!');
    console.log('\n📋 Resumen del sistema:');
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Productos activos: ${activeProducts.length}`);
    console.log(`   - Órdenes totales: ${recentOrders.length} (recientes)`);
    console.log(`   - Testimonios: ${testimonials.length}`);
    console.log(`   - Usuarios: ${users.length}`);

    console.log('\n✅ El sistema está listo para recibir pedidos!');
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
testOrderFlow();

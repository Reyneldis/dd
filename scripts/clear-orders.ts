import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearOrders() {
  try {
    console.log('🗑️ Limpiando todas las órdenes...');

    // Eliminar todos los OrderItems primero (por las relaciones)
    const deletedItems = await prisma.orderItem.deleteMany({});
    console.log(`✅ Eliminados ${deletedItems.count} items de órdenes`);

    // Eliminar todas las órdenes
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`✅ Eliminadas ${deletedOrders.count} órdenes`);

    console.log('🎉 Base de datos limpiada exitosamente');
  } catch (error) {
    console.error('❌ Error limpiando órdenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearOrders();

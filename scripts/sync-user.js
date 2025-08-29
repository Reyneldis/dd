const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function syncUser() {
  try {
    console.log('🔄 Sincronizando usuario con Clerk...');

    // Buscar el usuario existente
    const user = await prisma.user.findFirst({
      where: {
        email: 'neldis537@gmail.com',
      },
    });

    if (user) {
      console.log('✅ Usuario encontrado:');
      console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Clerk ID: ${user.clerkId}`);

      // Verificar si tiene Clerk ID
      if (!user.clerkId) {
        console.log('⚠️  Usuario no tiene Clerk ID');
        console.log('💡 Necesitas iniciar sesión con Clerk para sincronizar');
      } else {
        console.log('✅ Usuario ya está sincronizado con Clerk');
      }
    } else {
      console.log('❌ Usuario no encontrado');
    }
  } catch (error) {
    console.error('❌ Error sincronizando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncUser();

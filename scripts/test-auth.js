const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔐 Probando autenticación...');

    // Verificar usuario en la base de datos
    const user = await prisma.user.findFirst({
      where: {
        email: 'neldis537@gmail.com',
      },
    });

    if (user) {
      console.log('✅ Usuario encontrado en BD:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Email: ${user.email}`);

      if (user.role === 'ADMIN') {
        console.log('👑 Usuario tiene rol ADMIN');
      } else {
        console.log('⚠️  Usuario NO tiene rol ADMIN');
        console.log('💡 Actualizando rol a ADMIN...');

        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        });

        console.log('✅ Rol actualizado a ADMIN');
      }
    } else {
      console.log('❌ Usuario no encontrado en BD');
    }
  } catch (error) {
    console.error('❌ Error probando autenticación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();

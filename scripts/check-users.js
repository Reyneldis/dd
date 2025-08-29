const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`📊 Total de usuarios: ${users.length}`);
    console.log('');

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('💡 Necesitas crear un usuario con rol ADMIN');
    } else {
      console.log('👥 Usuarios encontrados:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.role || 'Sin rol'}`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   Creado: ${user.createdAt}`);
        console.log('');
      });
    }

    // Verificar si hay usuarios con rol ADMIN
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`👑 Usuarios con rol ADMIN: ${adminUsers.length}`);

    if (adminUsers.length === 0) {
      console.log('⚠️  No hay usuarios con rol ADMIN');
      console.log('💡 Necesitas asignar rol ADMIN a un usuario');
    }
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

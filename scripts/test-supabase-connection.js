// scripts/test-supabase-connection.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Intentando conectar a Supabase...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');

    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📋 Versión de PostgreSQL:', result[0].version);

    await prisma.$disconnect();
    console.log('✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Soluciones:');
    console.log('1. Verifica la URL en .env');
    console.log('2. Revisa que Supabase esté activo');
    console.log('3. Comprueba las credenciales');
    process.exit(1);
  }
}

testConnection();

// scripts/test-supabase-connection.js
import pkg from '@prisma/client';

const prisma = new pkg.PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');

    await prisma.$connect();
    console.log('✅ Conexión establecida');

    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Consulta de prueba exitosa:', result[0].version);

    // Verificar tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(
      '📋 Tablas encontradas:',
      tables.map(t => t.table_name),
    );
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Soluciones posibles:');
    console.log('1. Verifica que la URL en .env sea correcta');
    console.log('2. Asegúrate de que el proyecto Supabase esté activo');
    console.log('3. Verifica tu conexión a internet');
    console.log('4. Revisa las credenciales (usuario y contraseña)');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

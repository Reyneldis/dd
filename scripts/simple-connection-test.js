// scripts/simple-connection-test.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');

    // Intentar conectar
    await prisma.$connect();
    console.log('✅ Conexión establecida');

    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa:', result);

    // Verificar tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📋 Tablas encontradas:');
    tables.forEach(table => console.log(`  - ${table.table_name}`));
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que la URL en .env sea correcta');
    console.log('2. Asegúrate de que el proyecto Supabase esté activo');
    console.log('3. Revisa las credenciales (usuario y contraseña)');
    console.log('4. Verifica que no haya firewall bloqueando la conexión');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

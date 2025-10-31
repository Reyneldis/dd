// scripts/migrate-to-supabase.js
import pkg from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new pkg.PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function migrateToSupabase() {
  try {
    console.log('🔄 Iniciando migración de datos a Supabase...');

    // Verificar conexión a Supabase
    await prisma.$connect();
    console.log('✓ Conexión a Supabase establecida');

    // Leer el archivo SQL con los datos
    const sqlPath = path.join(__dirname, '../data_dump.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error(
        '❌ No se encontró el archivo data_dump.sql. Por favor, créalo con los datos a migrar.',
      );
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('✓ Archivo de datos leído');

    // Deshabilitar restricciones de clave foránea temporalmente
    await prisma.$executeRaw`SET session_replication_role = replica;`;
    console.log('✓ Restricciones de clave foránea deshabilitadas');

    // Dividir el SQL en sentencias individuales y ejecutarlas
    const statements = sql.split(';').filter(stmt => stmt.trim());
    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(
            `❌ Error al ejecutar: ${statement.substring(0, 50)}...`,
          );
          console.error(error.message);
        }
      }
    }

    // Rehabilitar restricciones
    await prisma.$executeRaw`SET session_replication_role = DEFAULT;`;
    console.log('✓ Restricciones de clave foránea rehabilitadas');

    console.log(
      `✅ Migración completada: ${successCount} sentencias ejecutadas con éxito, ${errorCount} con errores`,
    );
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToSupabase();

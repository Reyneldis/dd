// scripts/migrate-to-supabase-from-local.js
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import * as readline from 'readline';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  try {
    console.log('🚀 Migración de PostgreSQL Local a Supabase\n');

    // Obtener información del usuario
    const DB_HOST =
      (await question('Host de PostgreSQL local (default: localhost): ')) ||
      'localhost';
    const DB_PORT =
      (await question('Puerto de PostgreSQL (default: 5432): ')) || '5432';
    const DB_NAME =
      (await question('Nombre de la base de datos (default: db_delivery): ')) ||
      'db_delivery';
    const DB_USER =
      (await question('Usuario de PostgreSQL (default: postgres): ')) ||
      'postgres';
    const DB_PASSWORD = await question('Contraseña de PostgreSQL: ');

    console.log('\n📡 Configuración de Supabase:');
    const SUPABASE_URL = await question('Connection String de Supabase: ');

    console.log('\n🔄 Iniciando migración...\n');

    // Paso 1: Exportar desde PostgreSQL local
    console.log('📥 Paso 1: Exportando datos locales...');
    const dumpCommand = `set PGPASSWORD=${DB_PASSWORD} && pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -F p -f backup_temp.sql`;

    try {
      await execAsync(dumpCommand, { shell: true });
      console.log('✅ Exportación completada\n');
    } catch (error) {
      console.error('❌ Error al exportar:', error.message);
      console.log('\n💡 Alternativa: Exporta manualmente desde pgAdmin4');
      console.log('   1. Abre pgAdmin4');
      console.log('   2. Clic derecho en db_delivery > Backup');
      console.log('   3. Guarda como: backup_temp.sql');
      console.log('   4. Presiona Enter cuando termines...');
      await question('');
    }

    // Paso 2: Importar a Supabase
    console.log('\n📤 Paso 2: Importando a Supabase...');

    // Leer el archivo SQL
    const fs = await import('fs');
    let sqlContent;

    try {
      sqlContent = fs.readFileSync('backup_temp.sql', 'utf8');
    } catch {
      console.error('❌ No se encontró backup_temp.sql');
      process.exit(1);
    }

    // Conectar a Supabase
    const prismaSupabase = new PrismaClient({
      datasources: {
        db: {
          url: SUPABASE_URL,
        },
      },
    });

    await prismaSupabase.$connect();
    console.log('✅ Conectado a Supabase');

    // Ejecutar el SQL en Supabase
    // Dividir en sentencias y ejecutar
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    let success = 0;
    let errors = 0;

    for (const statement of statements) {
      if (statement && statement.length > 10) {
        try {
          await prismaSupabase.$executeRawUnsafe(statement);
          success++;
          if (success % 100 === 0) {
            console.log(`  ✓ ${success} sentencias ejecutadas...`);
          }
        } catch (error) {
          errors++;
          if (errors <= 5) {
            console.log(`  ⚠️  Error: ${error.message.substring(0, 80)}`);
          }
        }
      }
    }

    await prismaSupabase.$disconnect();

    console.log('\n✅ Migración completada!');
    console.log(`   ✓ ${success} sentencias exitosas`);
    console.log(`   ⚠️  ${errors} errores (pueden ser normales)`);

    // Limpiar archivo temporal
    const cleanup = await question(
      '\n¿Eliminar archivo temporal backup_temp.sql? (s/n): ',
    );
    if (cleanup.toLowerCase() === 's') {
      fs.unlinkSync('backup_temp.sql');
      console.log('🗑️  Archivo eliminado');
    }
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();

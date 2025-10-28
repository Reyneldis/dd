// scripts/import-to-supabase-direct.js
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const SUPABASE_URL =
  'postgresql://postgres:DeliveriExpress123@db.rzwatbwqtelwhxlcqcvg.supabase.co:5432/postgres';

async function importToSupabase() {
  try {
    console.log('🚀 Importando datos a Supabase...\n');

    // Leer el archivo SQL
    console.log('📄 Leyendo backup_temp.sql...');
    const sqlContent = fs.readFileSync('backup_temp.sql', 'utf8');
    console.log('✅ Archivo leído (' + sqlContent.length + ' caracteres)\n');

    // Conectar a Supabase
    console.log('🔌 Conectando a Supabase...');
    const prismaSupabase = new PrismaClient({
      datasources: {
        db: {
          url: SUPABASE_URL,
        },
      },
    });

    await prismaSupabase.$connect();
    console.log('✅ Conectado a Supabase\n');

    // Dividir en sentencias completas (manejando COPY)
    console.log('🔀 Procesando sentencias SQL...');

    // Separar por líneas
    const lines = sqlContent.split('\n');
    const statements = [];
    let currentStatement = '';
    let inCopyBlock = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Si empieza con COPY, activamos el modo COPY
      if (trimmedLine.toUpperCase().startsWith('COPY ')) {
        inCopyBlock = true;
        currentStatement = trimmedLine;
        continue;
      }

      // Si estamos en un bloque COPY y encontramos \.
      if (inCopyBlock && trimmedLine === '\\.') {
        statements.push(currentStatement);
        currentStatement = '';
        inCopyBlock = false;
        continue;
      }

      // Si estamos en un bloque COPY, agregamos la línea
      if (inCopyBlock) {
        currentStatement += '\n' + line;
        continue;
      }

      // Si la línea está vacía o es comentario, la ignoramos
      if (
        !trimmedLine ||
        trimmedLine.startsWith('--') ||
        trimmedLine.startsWith('SET ') ||
        trimmedLine.startsWith('SELECT ')
      ) {
        continue;
      }

      // Si la línea termina con ;, es una sentencia completa
      if (trimmedLine.endsWith(';')) {
        currentStatement += '\n' + trimmedLine;
        statements.push(currentStatement.trim());
        currentStatement = '';
      } else {
        currentStatement += '\n' + trimmedLine;
      }
    }

    // Agregar la última sentencia si existe
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    console.log(`📊 Total de sentencias: ${statements.length}\n`);

    let success = 0;
    let errors = 0;
    const errorsList = [];

    // Ejecutar las sentencias
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.length > 20) {
        try {
          await prismaSupabase.$executeRawUnsafe(statement);
          success++;

          if (success % 10 === 0) {
            console.log(
              `  ✓ ${success}/${statements.length} sentencias ejecutadas...`,
            );
          }
        } catch (error) {
          errors++;
          if (errors <= 15) {
            const errorMsg = error.message.substring(0, 150);
            errorsList.push({
              statement: statement.substring(0, 50) + '...',
              error: errorMsg,
            });
            console.log(`  ⚠️  Error ${errors}: ${errorMsg.substring(0, 80)}`);
          }
        }
      }
    }

    await prismaSupabase.$disconnect();

    console.log('\n✅ Migración completada!');
    console.log(`   ✓ ${success} sentencias exitosas`);
    console.log(`   ⚠️  ${errors} errores`);

    if (errorsList.length > 0) {
      console.log('\n📋 Primeros errores:');
      errorsList.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.statement}`);
        console.log(`      ${err.error}`);
      });
    }

    console.log('\n✨ ¡Base de datos migrada exitosamente a Supabase!');
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    process.exit(1);
  }
}

importToSupabase();

// scripts/supabase-direct-migrate.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase - REEMPLAZA CON TUS DATOS REALES
const supabaseUrl = 'https://rzwatbwqtelwhxlcqcvg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d2F0YndxdGVsd2h4bGNxY3ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ1NjQ0NywiZXhwIjoyMDc2MDMyNDQ3fQ.__DFqGfmMOdNphqqAFHTEbDdLxwXgjvu-GM7vj4H19A'; // Pega tu Service Role Key aquí

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateWithSupabaseClient() {
  try {
    console.log('🔄 Iniciando migración con cliente de Supabase...');

    // Verificar conexión primero
    console.log('🔍 Verificando conexión...');
    const { error } = await supabase.from('_prisma_migrations').select('count');
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      process.exit(1);
    }
    console.log('✅ Conexión verificada');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../data_dump.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ No se encontró el archivo data_dump.sql');
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('✓ Archivo de datos leído');

    // Dividir el SQL en sentencias
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    console.log(`📝 Procesando ${statements.length} sentencias SQL...`);

    let successCount = 0;
    let errorCount = 0;

    // Procesar sentencias
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement,
        });

        if (error) {
          console.error(
            `❌ Error en sentencia ${i + 1}: ${statement.substring(0, 50)}...`,
          );
          console.error(`   Detalle: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
        }

        // Mostrar progreso
        if ((i + 1) % 50 === 0 || i === statements.length - 1) {
          console.log(
            `⏳ Progreso: ${i + 1}/${statements.length} sentencias procesadas`,
          );
        }
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Error en sentencia ${i + 1}: ${statement.substring(0, 50)}...`,
        );
        console.error(`   Detalle: ${error.message}`);
      }
    }

    console.log(`\n✅ Migración completada:`);
    console.log(`   ✓ ${successCount} sentencias ejecutadas con éxito`);
    console.log(`   ⚠️ ${errorCount} sentencias con errores`);
  } catch (error) {
    console.error('❌ Error crítico durante la migración:', error);
    process.exit(1);
  }
}

migrateWithSupabaseClient();

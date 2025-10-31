// scripts/test-api-key.js
import { createClient } from '@supabase/supabase-js';

// Pega aquí tu Service Role Key completa
const supabaseUrl = 'https://rzwatbwqtelwhxlcqcvg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d2F0YndxdGVsd2h4bGNxY3ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ1NjQ0NywiZXhwIjoyMDc2MDMyNDQ3fQ.__DFqGfmMOdNphqqAFHTEbDdLxwXgjvu-GM7vj4H19A'; // Reemplaza esto con tu Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAPIKey() {
  try {
    console.log('🔍 Probando API Key...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey.substring(0, 20) + '...');

    // Intentar acceder a información del proyecto
    const { data: _, error } = await supabase
      .from('_prisma_migrations')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ API Key inválida o sin permisos:', error.message);
      console.log('\n💡 Soluciones:');
      console.log(
        '1. Asegúrate de copiar la SERVICE ROLE KEY (no la anon key)',
      );
      console.log('2. Verifica que el proyecto esté activo');
      console.log('3. Revisa que no hayas modificado la clave');
      console.log('4. Confirma que la URL del proyecto sea correcta');
    } else {
      console.log('✅ API Key válida y con permisos correctos');
      console.log('📊 Conexión establecida exitosamente');

      // Verificar tablas disponibles
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);

      if (!tablesError && tables) {
        console.log('📋 Tablas encontradas:');
        tables.forEach(table => console.log(`  - ${table.table_name}`));
      }
    }
  } catch (err) {
    console.error('❌ Error al probar la API Key:', err.message);
  }
}

testAPIKey();

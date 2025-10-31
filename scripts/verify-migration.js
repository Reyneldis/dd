// scripts/verify-migration.js
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - REEMPLAZA CON TUS DATOS REALES
const supabaseUrl = 'https://rzwatbwqtelwhxlcqcvg.supabase.co';
const supabaseKey = 'PEGAR_AQUI_TU_SERVICE_ROLE_KEY'; // Pega tu Service Role Key aquí

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  try {
    console.log('🔍 Verificando migración a Supabase...');

    const tables = [
      'users',
      'categories',
      'products',
      'orders',
      'order_items',
      'reviews',
      'cart_items',
      'contact_info',
      'shipping_addresses',
      'product_images',
      'user_addresses',
      'email_metrics',
    ];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ Error al contar ${table}:`, error.message);
      } else {
        console.log(`✅ ${table}: ${count} registros`);
      }
    }

    console.log('\n🎉 ¡Verificación completada!');
  } catch (error) {
    console.error('❌ Error al verificar:', error.message);
  }
}

verifyMigration();

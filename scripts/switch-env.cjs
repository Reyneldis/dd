const fs = require('fs');

// Configuraciones para diferentes entornos
const configs = {
  local: {
    DATABASE_URL: 'postgresql://postgres:root@localhost:5432/deliveryy_db',
    description: 'Base de datos local con pgAdmin',
  },
  neon: {
    DATABASE_URL:
      'postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    description: 'Base de datos Neon en la nube',
  },
};

function switchEnvironment(env, shouldSync = false) {
  if (!configs[env]) {
    console.log('❌ Entorno no válido. Opciones: local, neon');
    return;
  }

  const envContent = `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXJyaXZpbmctc2xvdGgtNjguY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_xSaSnhWRdodENePwo68ffT8h9Gagh7gha4FQlNTQKF
DATABASE_URL="${configs[env].DATABASE_URL}"
GMAIL_APP_PASSWORD=eqxy wqvp qmpe hxwn
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

  fs.writeFileSync('.env.local', envContent);
  console.log(`✅ Cambiado a entorno: ${env}`);
  console.log(`📊 ${configs[env].description}`);
  console.log(`🔗 DATABASE_URL: ${configs[env].DATABASE_URL}`);

  if (shouldSync && env === 'neon') {
    console.log('🔄 Iniciando sincronización automática...');
    console.log('💡 Ejecuta: node scripts/sync-to-neon.js');
  }
}

// Obtener argumentos de línea de comandos
const env = process.argv[2];
const sync = process.argv[3] === '--sync';

if (!env) {
  console.log('🔄 Script para cambiar entre entornos de base de datos');
  console.log('');
  console.log('Uso: node scripts/switch-env.js [local|neon] [--sync]');
  console.log('');
  console.log('Entornos disponibles:');
  console.log('  local - Base de datos local con pgAdmin');
  console.log('  neon  - Base de datos Neon en la nube');
  console.log('');
  console.log('Opciones:');
  console.log('  --sync - Sincronizar datos automáticamente (solo para neon)');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node scripts/switch-env.js local');
  console.log('  node scripts/switch-env.js neon --sync');
} else {
  switchEnvironment(env, sync);
}

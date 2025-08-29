const fs = require('fs');
const path = require('path');

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

function switchEnvironment(env) {
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
}

// Obtener argumento de línea de comandos
const env = process.argv[2];

if (!env) {
  console.log('🔄 Script para cambiar entre entornos de base de datos');
  console.log('');
  console.log('Uso: node scripts/setup-env.js [local|neon]');
  console.log('');
  console.log('Entornos disponibles:');
  console.log('  local - Base de datos local con pgAdmin');
  console.log('  neon  - Base de datos Neon en la nube');
  console.log('');
  console.log('Ejemplo: node scripts/setup-env.js local');
} else {
  switchEnvironment(env);
}

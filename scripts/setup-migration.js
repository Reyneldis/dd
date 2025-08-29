import fs from 'fs';
import path from 'path';

console.log('🔧 Configurando variables de entorno para migración...');

const envContent = `# Base de datos local (PostgreSQL con pgAdmin)
LOCAL_DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db_local"

# Base de datos Neon (producción)
DATABASE_URL="postgresql://usuario:contraseña@ep-xxx.region.aws.neon.tech/nombre_db_neon"

# Clerk (autenticación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Resend (email)
RESEND_API_KEY=re_...

# UploadThing (archivos)
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
`;

const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado');
  console.log(
    '📝 Por favor, edita el archivo .env con tus credenciales reales:',
  );
  console.log('');
  console.log('1. LOCAL_DATABASE_URL: Tu conexión a PostgreSQL local');
  console.log('2. DATABASE_URL: Tu conexión a Neon');
  console.log('3. Otras variables según necesites');
} else {
  console.log('⚠️ El archivo .env ya existe');
  console.log('📝 Verifica que tengas estas variables configuradas:');
  console.log('- LOCAL_DATABASE_URL (tu PostgreSQL local)');
  console.log('- DATABASE_URL (tu Neon)');
}

console.log('');
console.log('🚀 Una vez configurado, ejecuta:');
console.log('npm run migrate-to-neon');

const { execSync } = require('child_process');

// Configuración de variables de entorno para Vercel
const envVars = {
  // Database
  DATABASE_URL: 'postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  
  // Clerk (reemplaza con tus valores reales)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'your_clerk_publishable_key',
  CLERK_SECRET_KEY: 'your_clerk_secret_key',
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/login',
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/login',
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/',
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/',
  
  // Stripe (reemplaza con tus valores reales)
  STRIPE_SECRET_KEY: 'your_stripe_secret_key',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'your_stripe_publishable_key',
  STRIPE_WEBHOOK_SECRET: 'your_stripe_webhook_secret',
  
  // App
  NEXTAUTH_SECRET: 'your_nextauth_secret',
  NEXTAUTH_URL: 'https://your-domain.vercel.app',
  
  // Email (reemplaza con tus valores reales)
  GMAIL_CLIENT_ID: 'your_gmail_client_id',
  GMAIL_CLIENT_SECRET: 'your_gmail_client_secret',
  GMAIL_REFRESH_TOKEN: 'your_gmail_refresh_token',
  GMAIL_ACCESS_TOKEN: 'your_gmail_access_token',
  
  // Upload (reemplaza con tus valores reales)
  UPLOADTHING_SECRET: 'your_uploadthing_secret',
  UPLOADTHING_APP_ID: 'your_uploadthing_app_id'
};

async function setupVercel() {
  try {
    console.log('🚀 Configurando variables de entorno en Vercel...');
    console.log('');
    
    // Verificar si Vercel CLI está instalado
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('❌ Vercel CLI no está instalado. Instalando...');
      execSync('npm install -g vercel');
    }
    
    // Configurar cada variable de entorno
    for (const [key, value] of Object.entries(envVars)) {
      console.log(`📝 Configurando ${key}...`);
      try {
        execSync(`vercel env add ${key} production`, { 
          stdio: 'pipe',
          input: value + '\n'
        });
        console.log(`✅ ${key} configurada`);
      } catch (error) {
        console.log(`⚠️  ${key} ya existe o hubo un error`);
      }
    }
    
    console.log('');
    console.log('🎉 Configuración completada!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Revisa las variables en el dashboard de Vercel');
    console.log('2. Actualiza los valores que necesiten cambios');
    console.log('3. Ejecuta: git push');
    console.log('4. Vercel se desplegará automáticamente');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    console.log('');
    console.log('💡 Alternativa manual:');
    console.log('1. Ve a tu proyecto en Vercel Dashboard');
    console.log('2. Settings > Environment Variables');
    console.log('3. Agrega las variables del archivo env.example');
  }
}

// Verificar argumentos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('🚀 Script de configuración de Vercel');
  console.log('');
  console.log('Uso: node scripts/setup-vercel.js');
  console.log('');
  console.log('Este script:');
  console.log('1. Instala Vercel CLI si no está disponible');
  console.log('2. Configura las variables de entorno en Vercel');
  console.log('3. Proporciona instrucciones para el despliegue');
  console.log('');
  console.log('⚠️  IMPORTANTE: Actualiza los valores en el script antes de ejecutar');
} else {
  setupVercel();
} 
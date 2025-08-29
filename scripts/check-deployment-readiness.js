const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuración de verificación
const checks = {
  database: {
    name: 'Base de Datos Neon',
    url: 'postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  },
  requiredFiles: [
    'vercel.json',
    'env.example',
    'README-DEPLOYMENT.md'
  ],
  requiredEnvVars: [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GMAIL_CLIENT_ID',
    'GMAIL_CLIENT_SECRET',
    'GMAIL_REFRESH_TOKEN',
    'GMAIL_ACCESS_TOKEN',
    'UPLOADTHING_SECRET',
    'UPLOADTHING_APP_ID'
  ]
};

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión a Neon...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: checks.database.url,
        },
      },
    });

    // Intentar conectar
    await prisma.$connect();
    
    // Verificar tablas principales
    const categories = await prisma.category.count();
    const products = await prisma.product.count();
    const users = await prisma.user.count();
    
    await prisma.$disconnect();
    
    console.log('✅ Conexión a Neon exitosa');
    console.log(`   - Categorías: ${categories}`);
    console.log(`   - Productos: ${products}`);
    console.log(`   - Usuarios: ${users}`);
    
    return true;
  } catch (error) {
    console.log('❌ Error conectando a Neon:', error.message);
    return false;
  }
}

function checkRequiredFiles() {
  console.log('📁 Verificando archivos requeridos...');
  
  const missingFiles = [];
  
  for (const file of checks.requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - FALTANTE`);
      missingFiles.push(file);
    }
  }
  
  return missingFiles.length === 0;
}

function checkPackageJson() {
  console.log('📦 Verificando package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verificar scripts necesarios
    const requiredScripts = ['build', 'dev', 'start'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length === 0) {
      console.log('✅ Scripts requeridos presentes');
    } else {
      console.log(`❌ Scripts faltantes: ${missingScripts.join(', ')}`);
      return false;
    }
    
    // Verificar dependencias principales
    const requiredDeps = ['next', 'react', 'react-dom'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('✅ Dependencias principales presentes');
    } else {
      console.log(`❌ Dependencias faltantes: ${missingDeps.join(', ')}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error leyendo package.json:', error.message);
    return false;
  }
}

function checkNextConfig() {
  console.log('⚙️ Verificando configuración de Next.js...');
  
  try {
    if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
      console.log('✅ next.config.js presente');
      return true;
    } else {
      console.log('⚠️ next.config.js no encontrado (opcional)');
      return true;
    }
  } catch (error) {
    console.log('❌ Error verificando next.config.js:', error.message);
    return false;
  }
}

function generateEnvTemplate() {
  console.log('📝 Generando plantilla de variables de entorno...');
  
  const envTemplate = `# Copia este archivo como .env.local y llena los valores
  
# Database
DATABASE_URL="${checks.database.url}"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# Email (Gmail)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_ACCESS_TOKEN=your_gmail_access_token

# Upload
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
`;

  fs.writeFileSync('.env.template', envTemplate);
  console.log('✅ Plantilla .env.template generada');
}

async function checkDeploymentReadiness() {
  console.log('🚀 Verificando preparación para despliegue...');
  console.log('');
  
  let allChecksPassed = true;
  
  // Verificar conexión a base de datos
  const dbOk = await checkDatabaseConnection();
  if (!dbOk) allChecksPassed = false;
  
  console.log('');
  
  // Verificar archivos requeridos
  const filesOk = checkRequiredFiles();
  if (!filesOk) allChecksPassed = false;
  
  console.log('');
  
  // Verificar package.json
  const packageOk = checkPackageJson();
  if (!packageOk) allChecksPassed = false;
  
  console.log('');
  
  // Verificar configuración de Next.js
  const nextOk = checkNextConfig();
  if (!nextOk) allChecksPassed = false;
  
  console.log('');
  
  // Generar plantilla de variables de entorno
  generateEnvTemplate();
  
  console.log('');
  console.log('📋 Resumen de verificación:');
  console.log('');
  
  if (allChecksPassed) {
    console.log('🎉 ¡Todo listo para el despliegue!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Configura las variables de entorno en Vercel');
    console.log('2. Conecta tu repositorio a Vercel');
    console.log('3. Configura Clerk y Stripe para producción');
    console.log('4. Haz push a GitHub');
    console.log('5. ¡Disfruta tu aplicación desplegada!');
  } else {
    console.log('⚠️ Hay problemas que resolver antes del despliegue');
    console.log('');
    console.log('🔧 Acciones recomendadas:');
    console.log('1. Revisa los errores arriba');
    console.log('2. Ejecuta: node scripts/deploy-to-production.js');
    console.log('3. Verifica la configuración de servicios externos');
    console.log('4. Vuelve a ejecutar este script');
  }
  
  console.log('');
  console.log('📖 Para más detalles, consulta README-DEPLOYMENT.md');
}

// Verificar argumentos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('🔍 Script de verificación de preparación para despliegue');
  console.log('');
  console.log('Uso: node scripts/check-deployment-readiness.js');
  console.log('');
  console.log('Este script verifica:');
  console.log('1. Conexión a base de datos Neon');
  console.log('2. Archivos de configuración requeridos');
  console.log('3. Dependencias y scripts en package.json');
  console.log('4. Configuración de Next.js');
  console.log('5. Genera plantilla de variables de entorno');
} else {
  checkDeploymentReadiness();
} 
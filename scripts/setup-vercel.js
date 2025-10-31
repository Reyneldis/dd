import fs from 'fs';

console.log('🚀 Configurando Vercel...\n');

// Leer variables de entorno
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/"/g, '');
  }
});

console.log('📋 Variables de entorno encontradas:');
Object.keys(envVars).forEach(key => {
  console.log(`  ${key}=${envVars[key].substring(0, 20)}...`);
});

console.log('\n🔧 Pasos para configurar Vercel:');
console.log('1. Instala Vercel CLI: npm i -g vercel');
console.log('2. Login: vercel login');
console.log('3. Link proyecto: vercel link');
console.log('4. Agrega variables de entorno:');

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   vercel env add ${key}`);
});

console.log('\n📝 O usa el dashboard de Vercel:');
console.log('1. Ve a https://vercel.com/dashboard');
console.log('2. Selecciona tu proyecto');
console.log('3. Settings > Environment Variables');
console.log('4. Agrega cada variable manualmente');

console.log('\n✅ Cuando termines, ejecuta: vercel --prod');

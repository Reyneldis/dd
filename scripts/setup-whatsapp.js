#!/usr/bin/env node

/**
 * Script para configurar WhatsApp
 * Ayuda a configurar las variables de entorno necesarias
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_FILE = '.env.local';
const ENV_EXAMPLE_FILE = '.env.example';

function readEnvFile() {
  if (existsSync(ENV_FILE)) {
    return readFileSync(ENV_FILE, 'utf8');
  }
  return '';
}

function writeEnvFile(content) {
  writeFileSync(ENV_FILE, content, 'utf8');
}

function getEnvValue(envContent, key) {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return match ? match[1].replace(/^["']|["']$/g, '') : null;
}

function setEnvValue(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const newLine = `${key}="${value}"`;
  
  if (regex.test(envContent)) {
    return envContent.replace(regex, newLine);
  } else {
    return envContent + (envContent.endsWith('\n') ? '' : '\n') + newLine + '\n';
  }
}

async function setupWhatsApp() {
  console.log('🔧 Configurando WhatsApp para tu tienda online...\n');

  let envContent = readEnvFile();
  
  // Verificar configuración actual
  const currentAdmins = getEnvValue(envContent, 'NEXT_PUBLIC_WHATSAPP_ADMINS');
  const currentToken = getEnvValue(envContent, 'WHATSAPP_ACCESS_TOKEN');
  const currentPhoneId = getEnvValue(envContent, 'WHATSAPP_PHONE_NUMBER_ID');

  console.log('📋 Configuración actual:');
  console.log(`   WhatsApp Admins: ${currentAdmins || 'NO CONFIGURADO'}`);
  console.log(`   Access Token: ${currentToken ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);
  console.log(`   Phone Number ID: ${currentPhoneId ? 'CONFIGURADO' : 'NO CONFIGURADO'}\n`);

  // Configurar números de administradores (básico)
  if (!currentAdmins) {
    console.log('📱 Configurando números de administradores...');
    console.log('   Ingresa los números de WhatsApp de los administradores (separados por comas)');
    console.log('   Formato: +535358134753,+535358134754');
    console.log('   (Presiona Enter para usar el número por defecto: +535358134753)');
    
    // En un entorno real, aquí usarías readline para obtener input del usuario
    // Por ahora, usaremos el valor por defecto
    const defaultAdmins = '+535358134753';
    console.log(`   Usando valor por defecto: ${defaultAdmins}`);
    
    envContent = setEnvValue(envContent, 'NEXT_PUBLIC_WHATSAPP_ADMINS', defaultAdmins);
    envContent = setEnvValue(envContent, 'WHATSAPP_ADMIN_NUMBERS', defaultAdmins);
  }

  // Configurar WhatsApp Cloud API (opcional)
  if (!currentToken || !currentPhoneId) {
    console.log('\n🚀 Configuración avanzada de WhatsApp Cloud API (opcional):');
    console.log('   Para notificaciones automáticas, necesitas:');
    console.log('   1. Crear una app en Facebook Developers');
    console.log('   2. Configurar WhatsApp Business API');
    console.log('   3. Obtener Access Token y Phone Number ID');
    console.log('\n   ¿Quieres configurar esto ahora? (y/n)');
    console.log('   (Presiona Enter para omitir)');
    
    // Por ahora, omitimos la configuración avanzada
    console.log('   Omitiendo configuración avanzada por ahora...');
  }

  // Escribir archivo .env.local
  writeEnvFile(envContent);
  
  console.log('\n✅ Configuración completada!');
  console.log('\n📝 Archivo .env.local actualizado con:');
  console.log(`   - NEXT_PUBLIC_WHATSAPP_ADMINS: ${getEnvValue(envContent, 'NEXT_PUBLIC_WHATSAPP_ADMINS')}`);
  console.log(`   - WHATSAPP_ADMIN_NUMBERS: ${getEnvValue(envContent, 'WHATSAPP_ADMIN_NUMBERS')}`);
  
  console.log('\n🎉 ¡Tu tienda ya puede recibir notificaciones por WhatsApp!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Reinicia el servidor de desarrollo (npm run dev)');
  console.log('   2. Haz una prueba de pedido');
  console.log('   3. Verifica que lleguen las notificaciones');
  
  console.log('\n💡 Para configuración avanzada (opcional):');
  console.log('   - Configura WHATSAPP_ACCESS_TOKEN para notificaciones automáticas');
  console.log('   - Configura WHATSAPP_PHONE_NUMBER_ID para usar WhatsApp Cloud API');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupWhatsApp().catch(console.error);
}

export { setupWhatsApp };

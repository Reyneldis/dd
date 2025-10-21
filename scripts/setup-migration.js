// scripts/setup-migration.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupMigration() {
  try {
    console.log('🔄 Configurando migración para Supabase...');

    // Crear directorio de migraciones si no existe
    const migrationsDir = path.join(__dirname, '../prisma/migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log('✓ Directorio de migraciones creado');
    }

    // Crear directorio para la migración inicial
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T]/g, '')
      .split('.')[0];
    const migrationDir = path.join(migrationsDir, `${timestamp}_init_supabase`);

    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
      console.log('✓ Directorio de migración inicial creado');
    }

    // Crear archivo de migración
    const migrationFile = path.join(migrationDir, 'migration.sql');
    const migrationContent = `
-- Migration: ${timestamp}_init_supabase
-- Este archivo se crea manualmente para sincronizar Prisma con un esquema existente.

-- Marcar esta migración como aplicada en la tabla _prisma_migrations
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
  '${timestamp}_init_supabase',
  '0000000000000000000000000000000000000000000000000000000000000000', -- Checksum falso
  NOW(),
  'init_supabase',
  NULL,
  NULL,
  NOW(),
  1
);
`;

    fs.writeFileSync(migrationFile, migrationContent);
    console.log('✓ Archivo de migración creado');

    // Generar cliente Prisma usando Bun
    console.log('🔄 Generando cliente Prisma con Bun...');
    const { execSync } = await import('child_process');
    execSync('bunx prisma generate', { stdio: 'inherit' });

    console.log('✅ Configuración de migración completada');
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    process.exit(1);
  }
}

setupMigration();

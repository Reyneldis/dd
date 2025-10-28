// scripts/fix-backup-for-supabase.js
import * as fs from 'fs';

console.log('🔧 Creando backup corregido para Supabase...\n');

const sqlContent = fs.readFileSync('backup_temp.sql', 'utf8');
const lines = sqlContent.split('\n');

let output = '';
let inCopyBlock = false;
let currentTable = '';
let currentColumns = [];
let structurePart = true;
let insertPart = '';

console.log('📦 Procesando estructura...\n');

// Primero: Guardar toda la estructura
for (const line of lines) {
  const trimmedLine = line.trim();

  // Si encontramos COPY, activamos modo datos
  if (trimmedLine.toUpperCase().startsWith('COPY public.')) {
    const match = trimmedLine.match(
      /COPY public\.(\w+) \(([^)]+)\) FROM stdin/,
    );
    if (match) {
      structurePart = false;
      currentTable = match[1];
      currentColumns = match[2].split(',').map(c => c.trim().replace(/"/g, ''));
      inCopyBlock = true;
      console.log(`✓ Tabla encontrada: ${currentTable}`);
      continue;
    }
  }

  if (structurePart) {
    // Guardar estructura (CREATE, ALTER, SET, etc.)
    if (
      !trimmedLine.startsWith('\\restrict') &&
      !trimmedLine.startsWith('\\unrestrict')
    ) {
      output += line + '\n';
    }
  }

  // Manejo de bloques de datos
  if (inCopyBlock) {
    if (trimmedLine === '\\.') {
      inCopyBlock = false;
      continue;
    }

    if (line.trim() && !line.startsWith('--')) {
      const values = line.split('\t');
      const formattedValues = values.map(val => {
        val = val.trim();
        if (val === '\\N' || val === '') return 'NULL';
        if (val === 't') return 'true';
        if (val === 'f') return 'false';
        if (/^-?\d+\.?\d*$/.test(val)) return val;
        val = val.replace(/'/g, "''");
        return `'${val}'`;
      });

      insertPart += `INSERT INTO ${currentTable} (${currentColumns.join(
        ', ',
      )}) VALUES (${formattedValues.join(', ')});\n`;
    }
  }
}

// Combinar estructura + inserts
output += '\n-- ============================================\n';
output += '-- DATOS\n';
output += '-- ============================================\n\n';
output += insertPart;

fs.writeFileSync('backup_final_supabase.sql', output);

console.log('\n✅ Backup final creado!');
console.log('📁 Archivo: backup_final_supabase.sql');
const stats = fs.statSync('backup_final_supabase.sql');
console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
console.log('\n✨ Orden correcto: Primero estructura, luego datos\n');

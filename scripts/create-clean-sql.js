// scripts/create-clean-sql.js
import * as fs from 'fs';

console.log('🧹 Creando SQL limpio para Supabase...\n');

const sqlContent = fs.readFileSync('backup_temp.sql', 'utf8');
const lines = sqlContent.split('\n');

let output = '';
let inCopyBlock = false;
let currentTable = '';
let currentColumns = [];
let structurePart = true;
let insertPart = '';

// Primero: Guardar solo estructura (sin SET)
for (const line of lines) {
  const trimmedLine = line.trim();

  // Saltar líneas SET
  if (
    trimmedLine.startsWith('SET ') ||
    trimmedLine.startsWith('SELECT ') ||
    trimmedLine.startsWith('ALTER SCHEMA public OWNER') ||
    trimmedLine.startsWith('COMMENT ON SCHEMA')
  ) {
    continue;
  }

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
      continue;
    }
  }

  if (structurePart) {
    // Guardar solo CREATE, ALTER TYPE, etc.
    if (
      trimmedLine.startsWith('CREATE') ||
      trimmedLine.startsWith('ALTER TYPE') ||
      trimmedLine.startsWith('--') ||
      trimmedLine === ''
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

fs.writeFileSync('backup_clean.sql', output);

console.log('✅ SQL limpio creado!');
console.log('📁 Archivo: backup_clean.sql');
const stats = fs.statSync('backup_clean.sql');
console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB\n`);

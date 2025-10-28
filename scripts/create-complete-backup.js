// scripts/create-complete-backup.js
import * as fs from 'fs';

console.log('🔄 Creando backup completo para Supabase...\n');

// Leer el archivo de backup original
const originalBackup = fs.readFileSync('backup_temp.sql', 'utf8');
const lines = originalBackup.split('\n');

let output = '';
let inCopyBlock = false;
let currentTable = '';
let currentColumns = [];

console.log('📦 Procesando estructura y datos...\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmedLine = line.trim();

  // Incluir todo lo que no sea COPY (estructura, tipos, etc.)
  if (!inCopyBlock) {
    // Si encontramos una línea COPY
    if (trimmedLine.toUpperCase().startsWith('COPY ')) {
      const match = trimmedLine.match(
        /COPY public\.(\w+) \(([^)]+)\) FROM stdin/,
      );
      if (match) {
        currentTable = match[1];
        currentColumns = match[2]
          .split(',')
          .map(c => c.trim().replace(/"/g, ''));
        inCopyBlock = true;
        output += '\n-- Data for ' + currentTable + '\n';
        continue;
      }
    }

    // Incluir las líneas de estructura (CREATE, ALTER, etc.)
    if (
      !trimmedLine.startsWith('COPY ') &&
      !trimmedLine.startsWith('\\unrestrict') &&
      !trimmedLine.startsWith('\\restrict') &&
      trimmedLine !== '\\.' &&
      !trimmedLine.match(/^[a-f0-9-]+\t/) // Línea de datos
    ) {
      output += line + '\n';
    }
  }

  // Manejo del bloque de datos (COPY ... FROM stdin)
  if (inCopyBlock) {
    // Si encontramos \. terminamos el bloque
    if (trimmedLine === '\\.') {
      inCopyBlock = false;
      output += '\n';
      continue;
    }

    // Si la línea tiene datos y no está vacía
    if (line.trim() && !line.startsWith('--') && !line.startsWith('SET ')) {
      // Convertir datos tabulados a INSERT
      const values = line.split('\t');
      const formattedValues = values.map(val => {
        val = val.trim();

        // Manejar valores especiales
        if (val === '\\N' || val === '') return 'NULL';
        if (val === 't') return 'true';
        if (val === 'f') return 'false';

        // Si es un número, no necesita comillas
        if (/^-?\d+\.?\d*$/.test(val)) return val;

        // Escapar comillas simples en strings
        val = val.replace(/'/g, "''");
        return `'${val}'`;
      });

      // Construir el INSERT
      output += `INSERT INTO ${currentTable} (${currentColumns.join(
        ', ',
      )}) VALUES (${formattedValues.join(', ')});\n`;
    }
  }
}

// Guardar el resultado
fs.writeFileSync('backup_complete_supabase.sql', output);

console.log('✅ Backup completo creado!');
console.log('📁 Archivo: backup_complete_supabase.sql');
console.log('\n📋 Tamaño del archivo:');
const stats = fs.statSync('backup_complete_supabase.sql');
console.log(`   ${(stats.size / 1024).toFixed(2)} KB`);
console.log('\n✨ Este archivo contiene:');
console.log('   ✓ Estructura de la base de datos (CREATE, ALTER, etc.)');
console.log('   ✓ Todos los datos convertidos a INSERT');
console.log(
  '\n💡 Ahora puedes ejecutar este archivo completo en Supabase SQL Editor\n',
);

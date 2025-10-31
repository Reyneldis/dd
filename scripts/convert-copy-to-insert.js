// scripts/convert-copy-to-insert.js
import * as fs from 'fs';

console.log('🔄 Convirtiendo COPY a INSERT...\n');

const sqlContent = fs.readFileSync('backup_temp.sql', 'utf8');
const lines = sqlContent.split('\n');

let output = '';
let inCopyBlock = false;
let currentTable = '';
let currentColumns = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmedLine = line.trim();

  // Si encontramos una línea COPY, extraemos la tabla y columnas
  if (trimmedLine.toUpperCase().startsWith('COPY ')) {
    const match = trimmedLine.match(
      /COPY public\.(\w+) \(([^)]+)\) FROM stdin/,
    );
    if (match) {
      currentTable = match[1];
      currentColumns = match[2].split(',').map(c => c.trim().replace(/"/g, ''));
      inCopyBlock = true;
      console.log(`✓ Convirtiendo tabla: ${currentTable}`);
      continue;
    }
  }

  // Si estamos dentro de un bloque de datos
  if (inCopyBlock) {
    // Si encontramos \. terminamos el bloque
    if (trimmedLine === '\\.') {
      inCopyBlock = false;
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
  } else if (
    !trimmedLine.startsWith('COPY ') &&
    trimmedLine !== '\\.' &&
    !line.startsWith('\\unrestrict')
  ) {
    // Mantener las demás líneas SQL
    if (trimmedLine && !trimmedLine.startsWith('SET statement_timeout')) {
      output += line + '\n';
    }
  }
}

// Guardar el resultado
fs.writeFileSync('backup_supabase.sql', output);

console.log('\n✅ Conversión completada!');
console.log('📁 Archivo creado: backup_supabase.sql');
console.log('\n📋 Siguiente paso:');
console.log('   1. Ve al SQL Editor de Supabase');
console.log('   2. Abre el archivo backup_supabase.sql');
console.log('   3. Copia y pega el contenido en Supabase');
console.log('   4. Haz clic en Run\n');

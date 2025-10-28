import fs from 'fs';

console.log('🔧 Creando secciones separadas para Supabase...\n');

// Leer el archivo backup_supabase.sql
const sqlContent = fs.readFileSync('backup_supabase.sql', 'utf8');
const lines = sqlContent.split('\n');

// Encontrar las secciones principales
let createTypesStart = -1;
let createTablesStart = -1;
let insertDataStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  if (line.startsWith('CREATE TYPE') && createTypesStart === -1) {
    createTypesStart = i;
  } else if (line.startsWith('CREATE TABLE') && createTablesStart === -1) {
    createTablesStart = i;
  } else if (line.startsWith('INSERT INTO') && insertDataStart === -1) {
    insertDataStart = i;
  }
}

console.log(`📊 Secciones encontradas:`);
console.log(`   - CREATE TYPE: línea ${createTypesStart + 1}`);
console.log(`   - CREATE TABLE: línea ${createTablesStart + 1}`);
console.log(`   - INSERT DATA: línea ${insertDataStart + 1}`);

// Extraer las secciones
const header = lines.slice(0, createTypesStart);
const createTypes = lines.slice(createTypesStart, createTablesStart);
const createTables = lines.slice(createTablesStart, insertDataStart);
const insertData = lines.slice(insertDataStart);

// Crear archivos separados
fs.writeFileSync('01_header.sql', header.join('\n'));
fs.writeFileSync('02_create_types.sql', createTypes.join('\n'));
fs.writeFileSync('03_create_tables.sql', createTables.join('\n'));
fs.writeFileSync('04_insert_data.sql', insertData.join('\n'));

console.log(`\n✅ Archivos creados:`);
console.log(`   - 01_header.sql (${header.length} líneas)`);
console.log(`   - 02_create_types.sql (${createTypes.length} líneas)`);
console.log(`   - 03_create_tables.sql (${createTables.length} líneas)`);
console.log(`   - 04_insert_data.sql (${insertData.length} líneas)`);

// Verificar que _prisma_migrations esté en CREATE TABLE
const hasPrismaMigrations = createTables.some(line =>
  line.includes('_prisma_migrations'),
);

console.log(`\n🔍 Verificación:`);
console.log(
  `   - _prisma_migrations en CREATE: ${hasPrismaMigrations ? '✅' : '❌'}`,
);

if (hasPrismaMigrations) {
  const createTableIndex = createTables.findIndex(
    line =>
      line.includes('CREATE TABLE') && line.includes('_prisma_migrations'),
  );

  console.log(
    `\n📋 CREATE TABLE _prisma_migrations encontrado en línea ${
      createTableIndex + 1
    } de 03_create_tables.sql:`,
  );
  const start = Math.max(0, createTableIndex - 2);
  const end = Math.min(createTables.length, createTableIndex + 5);

  for (let i = start; i < end; i++) {
    const marker = i === createTableIndex ? '>>> ' : '    ';
    console.log(`${marker}${createTables[i]}`);
  }
}

console.log('\n📋 Instrucciones para Supabase SQL Editor:');
console.log('1. Ejecuta 01_header.sql');
console.log('2. Ejecuta 02_create_types.sql');
console.log('3. Ejecuta 03_create_tables.sql');
console.log('4. Ejecuta 04_insert_data.sql');
console.log(
  '\n💡 Si falla en el paso 3, verifica que _prisma_migrations esté en 03_create_tables.sql',
);

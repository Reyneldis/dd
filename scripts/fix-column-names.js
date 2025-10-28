import fs from 'fs';

console.log('🔧 Corrigiendo nombres de columnas en INSERT statements...\n');

// Leer el archivo de INSERT
const insertContent = fs.readFileSync('04_insert_data.sql', 'utf8');

// Mapeo de columnas que necesitan comillas
const columnMappings = {
  userId: '"userId"',
  productId: '"productId"',
  createdAt: '"createdAt"',
  updatedAt: '"updatedAt"',
  orderId: '"orderId"',
  categoryId: '"categoryId"',
  productName: '"productName"',
  productSku: '"productSku"',
  isActive: '"isActive"',
  firstName: '"firstName"',
  lastName: '"lastName"',
  isDefault: '"isDefault"',
  zipCode: '"zipCode"',
  isPrimary: '"isPrimary"',
  sortOrder: '"sortOrder"',
  isApproved: '"isApproved"',
  customerEmail: '"customerEmail"',
  subtotal: '"subtotal"',
  taxAmount: '"taxAmount"',
  shippingAmount: '"shippingAmount"',
  orderNumber: '"orderNumber"',
  categoryName: '"categoryName"',
  mainImage: '"mainImage"',
};

let fixedContent = insertContent;

// Aplicar las correcciones
Object.entries(columnMappings).forEach(([oldName, newName]) => {
  // Buscar patrones como: (id, userId, productId, ...)
  const pattern = new RegExp(`\\(([^)]*\\b)${oldName}\\b([^)]*)\\)`, 'g');
  fixedContent = fixedContent.replace(pattern, (match, before, after) => {
    return `(${before}${newName}${after})`;
  });
});

// Guardar el archivo corregido
fs.writeFileSync('04_insert_data_fixed.sql', fixedContent);

console.log('✅ Archivo corregido guardado en: 04_insert_data_fixed.sql');

// Verificar algunas correcciones
const lines = fixedContent.split('\n');
const cartItemsLines = lines.filter(line =>
  line.includes('INSERT INTO cart_items'),
);

console.log('\n🔍 Verificación de correcciones:');
console.log(`   - Líneas de cart_items: ${cartItemsLines.length}`);

if (cartItemsLines.length > 0) {
  console.log('\n📋 Primeras líneas de cart_items corregidas:');
  cartItemsLines.slice(0, 3).forEach((line, i) => {
    console.log(`   ${i + 1}. ${line.substring(0, 100)}...`);
  });
}

console.log('\n📋 Instrucciones:');
console.log('1. Ejecuta 01_header.sql');
console.log('2. Ejecuta 02_create_types.sql');
console.log('3. Ejecuta 03_create_tables.sql');
console.log(
  '4. Ejecuta 04_insert_data_fixed.sql (en lugar de 04_insert_data.sql)',
);

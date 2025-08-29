const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCategories() {
  try {
    console.log('🧪 Probando API de categorías...');

    // 1. Verificar conexión
    console.log('1. Verificando conexión a la base de datos...');
    const userCount = await prisma.user.count();
    console.log(`✅ Conexión exitosa. Usuarios en BD: ${userCount}`);

    // 2. Verificar categorías existentes
    console.log('2. Verificando categorías existentes...');
    const categories = await prisma.category.findMany();
    console.log(`📂 Categorías encontradas: ${categories.length}`);

    if (categories.length > 0) {
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.categoryName} (${cat.slug})`);
      });
    }

    // 3. Probar crear una categoría de prueba
    console.log('3. Probando creación de categoría...');
    const testCategory = await prisma.category.create({
      data: {
        categoryName: 'Categoría de Prueba',
        slug: 'categoria-de-prueba',
        description: 'Esta es una categoría de prueba',
      },
    });
    console.log(`✅ Categoría creada: ${testCategory.categoryName}`);

    // 4. Eliminar la categoría de prueba
    console.log('4. Limpiando categoría de prueba...');
    await prisma.category.delete({
      where: { id: testCategory.id },
    });
    console.log('✅ Categoría de prueba eliminada');

    console.log('🎉 Todas las pruebas pasaron exitosamente!');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategories();

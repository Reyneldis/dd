const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTestimonials() {
  try {
    console.log('🔍 Verificando testimonios en la base de datos...');

    const testimonials = await prisma.testimonial.findMany();
    console.log(`⭐ Total de testimonios: ${testimonials.length}`);

    if (testimonials.length > 0) {
      console.log('📋 Testimonios encontrados:');
      testimonials.forEach((testimonial, index) => {
        console.log(`   ${index + 1}. ${testimonial.name}`);
        console.log(`       Comentario: ${testimonial.comment}`);
        console.log(`       Rating: ${testimonial.rating}/5`);
        console.log(`       Activo: ${testimonial.isActive ? 'Sí' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay testimonios en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestimonials();

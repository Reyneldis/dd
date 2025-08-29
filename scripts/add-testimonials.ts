import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestimonials() {
  console.log('🌱 Agregando testimonios adicionales...');

  // Obtener usuarios existentes
  const users = await prisma.user.findMany({
    take: 3,
  });

  // Obtener productos existentes
  const products = await prisma.product.findMany({
    take: 6,
  });

  console.log('Usuarios encontrados:', users.length);
  console.log('Productos encontrados:', products.length);

  if (users.length === 0 || products.length === 0) {
    console.log('❌ No hay usuarios o productos para crear testimonios');
    return;
  }

  // Crear testimonios usando los datos disponibles
  const testimonials = [];

  for (let i = 0; i < Math.min(6, products.length); i++) {
    const userIndex = i % users.length;
    testimonials.push({
      userId: users[userIndex].id,
      productId: products[i].id,
      rating: Math.random() > 0.3 ? 5 : 4, // 70% probabilidad de 5 estrellas
      comment: [
        'Recibí mi pedido en menos de 24 horas y todo llegó en perfecto estado. Definitivamente volveré a comprar aquí.',
        'La calidad de los productos es increíble y los precios muy competitivos. El proceso de compra fue súper fácil y rápido.',
        'Me encantó la atención al cliente. Resolvieron todas mis dudas rápidamente y el envío fue muy puntual. ¡Altamente recomendado!',
        'Compré productos de limpieza y quedé muy satisfecho. La entrega fue rápida y los productos son de excelente calidad.',
        'El servicio es fantástico. Los productos llegaron bien empacados y en perfectas condiciones. Definitivamente mi tienda favorita.',
        'Excelente experiencia de compra. La interfaz es muy intuitiva y el proceso de pago súper seguro. ¡Muy recomendado!',
      ][i % 6],
      isApproved: true,
    });
  }

  try {
    const createdReviews = await Promise.all(
      testimonials.map(testimonial =>
        prisma.review.create({
          data: {
            userId: testimonial.userId,
            productId: testimonial.productId,
            rating: testimonial.rating,
            comment: testimonial.comment,
            isApproved: true,
          },
        }),
      ),
    );

    console.log('✅ Testimonios creados/actualizados:', createdReviews.length);
  } catch (error) {
    console.error('❌ Error creando testimonios:', error);
  }
}

addTestimonials()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

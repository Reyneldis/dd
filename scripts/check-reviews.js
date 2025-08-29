const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkReviews() {
  try {
    console.log('🔍 Verificando reviews en la base de datos...');

    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        product: {
          select: {
            productName: true,
          },
        },
      },
    });

    console.log(`⭐ Total de reviews: ${reviews.length}`);

    if (reviews.length > 0) {
      console.log('📋 Reviews encontradas:');
      reviews.forEach((review, index) => {
        console.log(
          `   ${index + 1}. Review de ${review.user?.firstName} ${review.user?.lastName}`,
        );
        console.log(`       Producto: ${review.product?.productName || 'N/A'}`);
        console.log(`       Rating: ${review.rating}/5`);
        console.log(`       Comentario: ${review.comment || 'Sin comentario'}`);
        console.log(`       Aprobada: ${review.isApproved ? 'Sí' : 'No'}`);
        console.log(`       Estado: ${review.status}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay reviews en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkReviews();

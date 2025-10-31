// app/api/test-data/route.ts
import { prisma } from '@/lib/prisma'; // Asegúrate que esta ruta a tu instancia de Prisma es correcta

export async function GET() {
  try {
    console.log('Intentando conectar a la BD y obtener categorías...');
    const categories = await prisma.category.findMany({
      take: 10, // Limitamos a 10 para no traer todo si hay mucho
    });
    console.log('Categorías obtenidas:', categories.length);

    return Response.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return Response.json(
      { success: false, error: 'No se pudieron obtener las categorías' },
      { status: 500 },
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/reviews/testimonials - Obtener testimonios (reviews aprobadas)
export async function GET() {
  try {
    const testimonials = await prisma.review.findMany({
      where: {
        isApproved: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Formatear para el frontend
    const formatted = testimonials.map(t => ({
      id: t.id,
      name: `${t.user?.firstName ?? ''} ${t.user?.lastName ?? ''}`.trim(),
      avatar: t.user?.avatar ?? '',
      text: t.comment ?? '',
      rating: t.rating,
      createdAt: t.createdAt,
    }));

    return NextResponse.json({ testimonials: formatted });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Error al obtener los testimonios' },
      { status: 500 },
    );
  }
}

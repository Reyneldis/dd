export const runtime = 'edge';
// import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const category = await prisma.category.findUnique({
//       where: { id: params.id },
//     });

//     if (!category) {
//       return NextResponse.json(
//         { error: 'Categoría no encontrada' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(category);
//   } catch (error) {
//     console.error('Error fetching category:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 },
//     );
//   }
// }
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Desestructuramos con await
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

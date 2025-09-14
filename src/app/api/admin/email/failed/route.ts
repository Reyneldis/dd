// @ts-nocheck
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await requireRole(['ADMIN']);
    const metrics = await prisma.emailMetrics.findMany({
      where: { status: 'failed' },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    return NextResponse.json(
      { error: 'Error al obtener emails fallidos' },
      { status: 500 },
    );
  }
}


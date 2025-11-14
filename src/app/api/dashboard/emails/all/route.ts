export const runtime = 'nodejs';
// src/app/api/dashboard/emails/all/route.ts - NUEVA RUTA
import { getAllEmails } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const emails = await getAllEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching all emails:', error);
    return NextResponse.json(
      { error: 'Error al obtener los emails' },
      { status: 500 },
    );
  }
}

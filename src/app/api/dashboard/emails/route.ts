// src/app/api/dashboard/emails/route.ts
import { getFailedEmails } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const emails = await getFailedEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    return NextResponse.json(
      { error: 'Error al obtener los emails fallidos' },
      { status: 500 },
    );
  }
}

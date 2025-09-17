// src/app/api/dashboard/emails/failed/route.ts
import { getFailedEmails } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Iniciando obtención de emails fallidos...');
    const failedEmails = await getFailedEmails();
    console.log(`Se encontraron ${failedEmails.length} emails fallidos`);
    return NextResponse.json(failedEmails);
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    return NextResponse.json(
      { error: 'Error al obtener los emails fallidos' },
      { status: 500 },
    );
  }
}

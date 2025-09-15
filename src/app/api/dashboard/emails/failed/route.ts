// src/app/api/dashboard/emails/failed/route.ts
import { getFailedEmails } from '@/lib/dashboard-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const emails = await getFailedEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    return NextResponse.json(
      { error: 'Error fetching failed emails' },
      { status: 500 },
    );
  }
}

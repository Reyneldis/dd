// src/app/api/dashboard/emails/[id]/retry/route.ts
import { retryEmail } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await retryEmail(id);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Error retrying email' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error retrying email:', error);
    return NextResponse.json(
      { error: 'Error retrying email' },
      { status: 500 },
    );
  }
}

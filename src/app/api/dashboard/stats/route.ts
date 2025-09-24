// src/app/api/dashboard/stats/route.ts
import { getDashboardStats } from '@/lib/dashboard-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard stats' },
      { status: 500 },
    );
  }
}

import { getUsers } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters = {
      search,
      role: role || undefined,
      isActive: isActive ? isActive === 'true' : undefined,
      page,
      limit,
    };

    const result = await getUsers(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  // Implementación futura para crear usuarios
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

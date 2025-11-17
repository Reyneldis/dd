// src/app/api/dashboard/users/route.ts
import { getUsers } from '@/lib/dashboard-service';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const roleParam = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Convertir el string a Role si es válido
    let role: Role | undefined = undefined;
    if (roleParam && Object.values(Role).includes(roleParam as Role)) {
      role = roleParam as Role;
    }

    const filters = {
      search,
      role,
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

// Eliminamos el POST porque los usuarios no se crean manualmente
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Los usuarios se crean a través del registro en la web' },
    { status: 405 },
  );
}

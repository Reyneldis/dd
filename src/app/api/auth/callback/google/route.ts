export const runtime = 'edge';
// src/app/api/auth/callback/google/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set(
        'redirect_url',
        searchParams.get('redirect_url') || '/',
      );
      return Response.redirect(signInUrl);
    }

    const redirectTo = searchParams.get('redirect_url') || '/';
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error('Error en el callback de OAuth:', error);
    return new Response('Error en la autenticación', { status: 500 });
  }
}

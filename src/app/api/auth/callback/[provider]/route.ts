export const runtime = 'edge';
// app/api/auth/callback/[provider]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    // Desestructurar los parámetros asíncronos
    const { provider } = await params;
    console.log(`Procesando callback de OAuth para: ${provider}`);

    // Obtener la URL de redirección desde los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect_url') || '/';

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error(`Error en el callback de OAuth:`, error);
    return NextResponse.redirect(new URL(`/sign-in?error=oauth`, request.url));
  }
}

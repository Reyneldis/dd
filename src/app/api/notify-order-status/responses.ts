import { NextResponse } from 'next/server';

export function badRequest(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status: 400 },
  );
}

export function okRaw<T>(data: T): NextResponse<T> {
  return NextResponse.json(data);
}

export function serverError(
  message: string = 'Error interno del servidor',
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 },
  );
}

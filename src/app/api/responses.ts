import { NextResponse } from 'next/server';

// Tipos para las respuestas de la API
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Funciones de respuesta con tipos genéricos
export function ok<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export function okRaw<T>(data: T): NextResponse<T> {
  return NextResponse.json(data);
}

export function created<T>(
  data: T,
  message: string = 'Recurso creado exitosamente',
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: 201 },
  );
}

export function notFound(
  message: string = 'Recurso no encontrado',
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 404 },
  );
}

export function badRequest(
  message: string,
  details?: unknown,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status: 400 },
  );
}

export function unauthorized(
  message: string = 'No autorizado',
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 },
  );
}

export function forbidden(
  message: string = 'Acceso denegado',
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 },
  );
}

export function serverError(
  message: string = 'Error interno del servidor',
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 },
  );
}

// Función para respuestas paginadas
export function paginated<T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({
    data,
    pagination,
  });
}

import { NextResponse } from 'next/server';

type ResponseInit = {
  status?: number;
  headers?: Record<string, string>;
};

export function ok<T>(data: T, init: ResponseInit = {}) {
  return NextResponse.json(
    { data },
    { status: init.status ?? 200, headers: init.headers },
  );
}

export function okRaw<T>(data: T, init: ResponseInit = {}) {
  return NextResponse.json(data, {
    status: init.status ?? 200,
    headers: init.headers,
  });
}

export function created<T>(data: T, init: ResponseInit = {}) {
  return NextResponse.json({ data }, { status: 201, headers: init.headers });
}

export function badRequest(message = 'Datos inválidos', details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function unauthorized(message = 'No autorizado') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function notFound(message = 'No encontrado') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = 'Error interno del servidor') {
  return NextResponse.json({ error: message }, { status: 500 });
}

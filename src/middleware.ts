// src/middleware.ts
export default function middleware() {
  // Middleware desactivado temporalmente para pruebas
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

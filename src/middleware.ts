// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define qué rutas son públicas usando el helper de Clerk
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks',
  '/api/test-direct-connection',
]);

export default clerkMiddleware((auth, req) => {
  // Si la ruta es pública, permite el acceso
  if (isPublicRoute(req)) {
    return;
  }

  // Para rutas privadas, `auth().protect()` se encargará de la redirección
  // si el usuario no está autenticado.
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

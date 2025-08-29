import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  // Rutas principales públicas
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/contact(.*)',
  '/about(.*)',
  '/search(.*)',

  // Autenticación
  '/login(.*)',
  '/register(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',

  // Assets estáticos
  '/favicon.ico',
  '/_next(.*)',
  '/public(.*)',
  '/images(.*)',

  // APIs públicas
  '/api/products(.*)',
  '/api/categories(.*)',
  '/api/search(.*)',
  '/api/contact(.*)',
  '/api/whatsapp(.*)',

  // Solo estas rutas requieren login
  '/account(.*)',
  '/admin(.*)',
  '/api/reviews(.*)',
  '/api/user(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Permitir rutas públicas
  if (isPublicRoute(req)) {
    return;
  }

  // Para todas las demás rutas, Clerk maneja la autenticación automáticamente
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

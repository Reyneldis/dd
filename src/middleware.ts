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
  '/_next/static(.*)',
  '/public(.*)',
  '/images(.*)',
  // APIs públicas
  '/api/products(.*)',
  '/api/categories(.*)',
  '/api/search(.*)',
  '/api/contact(.*)',
  '/api/whatsapp(.*)',
  '/api/reviews/testimonials(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Si la ruta no es pública y el usuario no está autenticado, redirigir a login
  if (!isPublicRoute(req) && !auth().userId) {
    // Construir la URL de redirección
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

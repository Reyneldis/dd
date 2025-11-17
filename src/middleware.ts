// middleware.ts
import { syncUserMiddleware } from '@/lib/sync-user-middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define las rutas que son públicas
const isPublicRoute = createRouteMatcher([
  '/',
  '/api(.*)',
  '/categories(.*)',
  '/products(.*)',
  '/contact',
  '/about',
  '/privacy',
  '/terms',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)', // Excluir webhooks de la sincronización
]);

export default clerkMiddleware(async (auth, req) => {
  // Si la ruta no es pública, verificar autenticación y sincronizar
  if (!isPublicRoute(req)) {
    auth.protect();

    // Sincronizar usuario si está autenticado
    await syncUserMiddleware(req);
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

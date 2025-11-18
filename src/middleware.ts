// middleware.ts
import { syncUserWithDatabase } from '@/lib/sync-user-middleware'; // Asegúrate que el nombre de la función exportada coincide
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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
  '/api/webhooks(.*)',
  '/api/test-direct-connection(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Si la ruta es pública, omitimos la lógica.
  if (isPublicRoute(req)) {
    console.log('Middleware: Ruta pública:', req.nextUrl.pathname);
    return;
  }

  // 2. Para rutas privadas, obtenemos el objeto de autenticación.
  // ¡USAMOS AWAIT!
  const { userId } = await auth();

  // 3. Verificamos si el usuario está autenticado.
  // Si no hay userId, `auth().protect()` se encargará de la redirección.
  if (!userId) {
    console.log('Middleware: Usuario no autenticado, redirigiendo...');
    // La función `auth` pasada por `clerkMiddleware` ya maneja la protección.
    // Simplemente no devolvemos nada y Clerk se encargará.
    return;
  }

  // 4. Si el usuario está autenticado, lo sincronizamos.
  console.log(`Middleware: Usuario ${userId} autenticado. Sincronizando...`);
  await syncUserWithDatabase(userId);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

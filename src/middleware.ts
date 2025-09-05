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
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/login(.*)',
  '/register(.*)',
  // Callbacks de OAuth
  '/api/auth/callback/google',
  '/api/auth/callback/github',
  '/api/auth/callback/facebook',
  // Assets estáticos
  '/favicon.ico',
  '/_next/static(.*)',
  '/_next/image(.*)',
  '/public(.*)',
  '/images(.*)',
  // APIs públicas
  '/api/products(.*)',
  '/api/categories(.*)',
  '/api/search(.*)',
  '/api/contact(.*)',
  '/api/whatsapp(.*)',
  '/api/reviews/testimonials(.*)',
  '/api/reviews(.*)',
  // Permitir POST a /api/orders sin autenticación
  '/api/orders',
]);

export default clerkMiddleware(async (auth, req) => {
  // Permitir siempre rutas públicas
  if (isPublicRoute(req)) {
    return;
  }

  // Para rutas API protegidas (excepto POST a /api/orders)
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Permitir POST a /api/orders sin autenticación
    if (req.nextUrl.pathname === '/api/orders' && req.method === 'POST') {
      return;
    }

    // Verificar autenticación para otras rutas API
    const { userId } = await auth();
    if (!userId) {
      // No modificar encabezados, solo devolver una respuesta simple
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  // Para rutas de página protegidas
  else {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      // Usar redirect en lugar de modificar encabezados
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Incluir todas las rutas de página y API
    '/',
    '/(api|trpc)(.*)',
  ],
};

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher([
//   // Rutas principales públicas
//   '/',
//   '/products(.*)',
//   '/categories(.*)',
//   '/contact(.*)',
//   '/about(.*)',
//   '/search(.*)',

//   // Autenticación
//   '/login(.*)',
//   '/register(.*)',
//   '/sign-in(.*)',
//   '/sign-up(.*)',

//   // Assets estáticos
//   '/favicon.ico',
//   '/_next(.*)',
//   '/public(.*)',
//   '/images(.*)',

//   // APIs públicas
//   '/api/products(.*)',
//   '/api/categories(.*)',
//   '/api/search(.*)',
//   '/api/contact(.*)',
//   '/api/whatsapp(.*)',

//   // Solo estas rutas requieren login
//   '/account(.*)',
//   '/admin(.*)',
//   '/api/reviews(.*)',
//   '/api/user(.*)',
// ]);

// export default clerkMiddleware((auth, req) => {
//   // Permitir rutas públicas
//   if (isPublicRoute(req)) {
//     return;
//   }

//   // Para todas las demás rutas, Clerk maneja la autenticación automáticamente
// });

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };
// src/middleware.ts
// src/middleware.ts
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
  '/api/reviews/testimonials(.*)', // Importante para testimonios
  '/api/reviews(.*)', // Para obtener reseñas de productos
]);

export default clerkMiddleware(async (auth, req) => {
  // Para rutas API no públicas, devolver 401 si no está autenticado
  if (req.nextUrl.pathname.startsWith('/api') && !isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
  // Para rutas de página no públicas, redirigir al login
  else if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

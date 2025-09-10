// src/middleware.ts
import { transferCartToUser } from '@/lib/cart-service';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Definir rutas públicas
const isPublicRoute = createRouteMatcher([
  // Rutas principales públicas
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/contact(.*)',
  '/about(.*)',
  '/search(.*)',
  // Páginas de error
  '/404',
  '/_not-found',
  '/500',
  // Autenticación
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/login(.*)',
  '/register(.*)',
  // Callbacks de OAuth
  '/api/auth/callback/google',
  '/api/auth/callback/github',
  '/api/auth/callback/facebook',
  // APIs públicas
  '/api/products(.*)',
  '/api/products/slug/(.*)',
  '/api/categories(.*)',
  '/api/search(.*)',
  '/api/contact(.*)',
  '/api/whatsapp(.*)',
  '/api/reviews/testimonials(.*)',
  '/api/reviews(.*)',
  // Permitir POST a /api/orders sin autenticación
  '/api/orders',
  // Webhooks
  '/api/webhooks/(.*)',
  // Assets estáticos
  '/favicon.ico',
  '/_next/static(.*)',
  '/_next/image(.*)',
  '/public(.*)',
  '/images(.*)',
]);

// Definir rutas de administrador
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

// Tipo para los metadatos de usuario
interface UserMetadata {
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  profileComplete?: boolean;
  hasActiveSubscription?: boolean;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1. Permitir siempre rutas públicas
  if (isPublicRoute(req)) {
    return;
  }

  // 2. Transferir carrito de localStorage a base de datos cuando un usuario inicia sesión
  if (userId) {
    try {
      await transferCartToUser(userId);
    } catch (error) {
      console.error('Error transferring cart:', error);
      // No bloquear el inicio de sesión si falla la transferencia
    }
  }

  // 3. Manejar rutas de administrador
  if (isAdminRoute(req)) {
    if (!userId) {
      return redirectToSignIn(req);
    }
    // Verificar rol de administrador
    const userRole = (sessionClaims?.metadata as UserMetadata)?.role || 'USER';
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return forbiddenResponse();
    }
    return;
  }

  // 4. Manejar rutas API protegidas
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Permitir POST a /api/orders sin autenticación
    if (req.nextUrl.pathname === '/api/orders' && req.method === 'POST') {
      return;
    }
    // Verificar autenticación para otras rutas API
    if (!userId) {
      return unauthorizedResponse();
    }
    // Verificar permisos específicos según la ruta
    if (req.nextUrl.pathname.startsWith('/api/user')) {
      // Solo permitir acceso a datos del propio usuario
      const pathParts = req.nextUrl.pathname.split('/');
      const requestedUserId = pathParts[pathParts.length - 1];
      if (requestedUserId !== userId) {
        return forbiddenResponse();
      }
    }
    return;
  }

  // 5. Manejar rutas de página protegidas
  if (!userId) {
    return redirectToSignIn(req);
  }

  // 6. Verificación adicional para rutas específicas
  if (req.nextUrl.pathname.startsWith('/profile')) {
    // Verificar si el perfil está completo
    const profileComplete =
      (sessionClaims?.metadata as UserMetadata)?.profileComplete || false;
    if (!profileComplete) {
      return NextResponse.redirect(new URL('/complete-profile', req.url));
    }
  }

  // 7. Manejo de suscripciones (ejemplo para contenido premium)
  if (req.nextUrl.pathname.startsWith('/premium')) {
    // Verificar suscripción activa
    const hasActiveSubscription =
      (sessionClaims?.metadata as UserMetadata)?.hasActiveSubscription || false;
    if (!hasActiveSubscription) {
      return NextResponse.redirect(new URL('/subscribe', req.url));
    }
  }
});

// Funciones auxiliares para respuestas consistentes
function redirectToSignIn(req: Request) {
  const signInUrl = new URL('/sign-in', req.url);
  signInUrl.searchParams.set('redirect_url', req.url);
  return NextResponse.redirect(signInUrl);
}

function unauthorizedResponse() {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message: 'Authentication required',
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function forbiddenResponse() {
  return new Response(
    JSON.stringify({
      error: 'Forbidden',
      message: 'Insufficient permissions',
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

// Configuración del matcher optimizada
export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto:
    // - Archivos estáticos de Next.js
    // - Archivos de imagen
    // - Favicon
    // - Archivos con extensiones comunes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

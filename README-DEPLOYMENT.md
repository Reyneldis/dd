# 🚀 Guía de Despliegue a Vercel

Esta guía te ayudará a desplegar tu aplicación Next.js con PostgreSQL, Clerk y Neon en Vercel.

## 📋 Prerrequisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [Neon](https://neon.tech) (base de datos PostgreSQL)
- ✅ Cuenta en [Clerk](https://clerk.com) (autenticación)
- ✅ Cuenta en [Stripe](https://stripe.com) (pagos)
- ✅ Repositorio en GitHub

## 🔧 Paso 1: Preparar la Base de Datos

### 1.1 Sincronizar datos a Neon

```bash
# Ejecutar el script de sincronización
node scripts/deploy-to-production.js
```

Este script:
- Exporta datos de tu base de datos local
- Los sincroniza con Neon
- Limpia y recrea las tablas en orden correcto

### 1.2 Verificar la conexión a Neon

Asegúrate de que tu `DATABASE_URL` en Neon esté correcta:

```
postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🔧 Paso 2: Configurar Vercel

### 2.1 Conectar repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Configura el framework como "Next.js"

### 2.2 Variables de Entorno

Configura las siguientes variables en Vercel Dashboard > Settings > Environment Variables:

#### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_Pc2LjDWGB1zT@ep-fancy-night-ady2vbiu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

#### Stripe
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### App
```
NEXTAUTH_SECRET=tu_secret_aqui
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

#### Email (Gmail)
```
GMAIL_CLIENT_ID=tu_client_id
GMAIL_CLIENT_SECRET=tu_client_secret
GMAIL_REFRESH_TOKEN=tu_refresh_token
GMAIL_ACCESS_TOKEN=tu_access_token
```

#### Upload
```
UPLOADTHING_SECRET=tu_secret
UPLOADTHING_APP_ID=tu_app_id
```

### 2.3 Configuración Automática (Opcional)

Puedes usar el script automático:

```bash
# Edita primero los valores en scripts/setup-vercel.js
node scripts/setup-vercel.js
```

## 🔧 Paso 3: Configurar Clerk

### 3.1 Configurar URLs de redirección

En tu dashboard de Clerk, agrega estas URLs:

**Allowed Origins:**
- `https://tu-dominio.vercel.app`

**Redirect URLs:**
- `https://tu-dominio.vercel.app/login`
- `https://tu-dominio.vercel.app/`

## 🔧 Paso 4: Configurar Stripe

### 4.1 Webhooks

En tu dashboard de Stripe, configura el webhook:

**Endpoint URL:**
```
https://tu-dominio.vercel.app/api/stripe/webhook
```

**Events a escuchar:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`

## 🔧 Paso 5: Desplegar

### 5.1 Push a GitHub

```bash
git add .
git commit -m "Configurar para despliegue en Vercel"
git push origin main
```

### 5.2 Verificar despliegue

1. Ve a tu dashboard de Vercel
2. Monitorea el build
3. Verifica que no haya errores

## 🔧 Paso 6: Post-Despliegue

### 6.1 Verificar funcionalidades

- ✅ Autenticación con Clerk
- ✅ Conexión a base de datos
- ✅ Pagos con Stripe
- ✅ Subida de imágenes
- ✅ Envío de emails

### 6.2 Configurar dominio personalizado (Opcional)

1. Ve a Settings > Domains en Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## 🚨 Solución de Problemas

### Error de conexión a base de datos

```bash
# Verificar que la URL de Neon esté correcta
# Asegurarse de que Neon esté activo
# Verificar que las credenciales sean correctas
```

### Error de autenticación

```bash
# Verificar las claves de Clerk
# Asegurarse de que las URLs de redirección estén configuradas
```

### Error de pagos

```bash
# Verificar las claves de Stripe
# Configurar el webhook correctamente
# Verificar que el endpoint del webhook esté funcionando
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Comprueba la conectividad de servicios externos
4. Revisa la documentación de cada servicio

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en Vercel con:
- ✅ Base de datos PostgreSQL en Neon
- ✅ Autenticación con Clerk
- ✅ Pagos con Stripe
- ✅ Subida de archivos
- ✅ Envío de emails

¡Disfruta tu aplicación desplegada! 🚀 
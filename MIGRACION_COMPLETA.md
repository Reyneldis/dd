# 🚀 Migración Completa: PostgreSQL Local → Supabase + Vercel

## ✅ Estado Actual

### 1. Base de Datos Supabase

- **Connection String**: `postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.pooler.supabase.com:6543/postgres`
- **Estado**: Configurado en `.env`
- **Próximo paso**: Importar datos manualmente

### 2. Archivos de Migración

- `backup_temp.sql` - Dump original de pgAdmin4
- `backup_supabase.sql` - Convertido para Supabase (INSERT statements)
- `scripts/clean-and-import-supabase.sql` - Script de limpieza

## 🔧 Pasos Pendientes

### Paso 1: Importar Datos a Supabase

1. Ve al **SQL Editor** en Supabase
2. Ejecuta `scripts/clean-and-import-supabase.sql` (limpiar)
3. Ejecuta `backup_supabase.sql` (importar datos)

### Paso 2: Configurar Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link proyecto: `vercel link`
4. Agrega variables de entorno:
   ```bash
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   vercel env add GMAIL_USER
   vercel env add GMAIL_APP_PASSWORD
   vercel env add NEXT_PUBLIC_WHATSAPP_ADMINS
   ```

### Paso 3: Deploy

```bash
vercel --prod
```

## 📋 Variables de Entorno para Vercel

```env
DATABASE_URL="postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres.rzwatbwqtelwhxlcqcvg:DeliveriExpress123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Z2xvcmlvdXMtcGFuZ29saW4tODUuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_LnANe3RvWvlUHByBT1ypLwnsC07EKYMctPRE6kin0O"
GMAIL_USER="neldis537@gmail.com"
GMAIL_APP_PASSWORD="eqxy wqvp qmpe hxwn"
NEXT_PUBLIC_WHATSAPP_ADMINS="5359597421,5358134753"
```

## 🎯 Próximos Pasos

1. **Importa los datos** en Supabase usando los scripts SQL
2. **Configura Vercel** con las variables de entorno
3. **Deploy** el proyecto
4. **Verifica** que todo funcione correctamente

## 📞 Soporte

Si tienes problemas:

- Verifica que Supabase esté activo
- Revisa las credenciales de conexión
- Asegúrate de que todas las variables estén en Vercel

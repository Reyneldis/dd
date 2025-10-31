-- Script para limpiar y recrear la base de datos en Supabase

-- 1. Eliminar todas las tablas en orden correcto (respetando foreign keys)
DROP TABLE IF EXISTS public.email_metrics CASCADE;
DROP TABLE IF EXISTS public.shipping_addresses CASCADE;
DROP TABLE IF EXISTS public.contact_info CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public._prisma_migrations CASCADE;

-- 2. Eliminar los tipos ENUM si existen
DROP TYPE IF EXISTS public."AddressType" CASCADE;
DROP TYPE IF EXISTS public."OrderStatus" CASCADE;
DROP TYPE IF EXISTS public."Role" CASCADE;
DROP TYPE IF EXISTS public."Status" CASCADE;

-- Ahora ejecuta el contenido de backup_supabase.sql completo

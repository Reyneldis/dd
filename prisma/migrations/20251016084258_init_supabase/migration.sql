
-- Migration: 20251016084258_init_supabase
-- Este archivo se crea manualmente para sincronizar Prisma con un esquema existente.

-- Marcar esta migración como aplicada en la tabla _prisma_migrations
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
  '20251016084258_init_supabase',
  '0000000000000000000000000000000000000000000000000000000000000000', -- Checksum falso
  NOW(),
  'init_supabase',
  NULL,
  NULL,
  NOW(),
  1
);

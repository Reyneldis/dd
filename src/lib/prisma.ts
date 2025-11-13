// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// 1. Creamos un nuevo tipo que representa el cliente extendido con Accelerate
type ExtendedPrismaClient = ReturnType<typeof withAccelerate<PrismaClient>>;

// 2. Usamos este nuevo tipo para nuestro objeto global
const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

// 3. Creamos y exportamos la instancia de Prisma extendida
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

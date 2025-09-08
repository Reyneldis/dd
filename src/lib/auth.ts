// src/lib/auth.ts
import { auth } from '@clerk/nextjs/server';
import { transferCartToUser } from './cart-service';

export async function handleAuth() {
  const { userId } = await auth();

  if (userId) {
    // Transferir carrito de localStorage a la base de datos
    await transferCartToUser(userId);
  }

  return { userId };
}

// src/app/api/cart/route.ts
import { prisma } from '@/lib/prisma';
import { cartItemSchema, updateCartItemSchema } from '@/schemas/cartSchema';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/cart - Obtener items del carrito de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 },
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular total del carrito
    const total = cartItems.reduce((sum, item) => {
      const price = item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return NextResponse.json({
      items: cartItems,
      total: total,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Error al obtener el carrito' },
      { status: 500 },
    );
  }
}

// POST /api/cart - Agregar item al carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = cartItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { userId: clerkId, productId, quantity } = result.data;

    // Buscar el usuario interno usando el clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id, // Usar el ID interno del usuario
          productId,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Actualizar cantidad
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });
    } else {
      // Crear nuevo item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id, // Usar el ID interno del usuario
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 },
    );
  }
}

// PUT /api/cart - Actualizar cantidad de un item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = updateCartItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { itemId, quantity } = result.data;

    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item eliminado del carrito' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el carrito' },
      { status: 500 },
    );
  }
}

// DELETE /api/cart - Eliminar item del carrito
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = searchParams.get('userId');

    if (!itemId && !userId) {
      return NextResponse.json(
        { error: 'ID del item o usuario requerido' },
        { status: 400 },
      );
    }

    if (itemId) {
      // Eliminar un item específico
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item eliminado del carrito' });
    } else if (userId) {
      // Limpiar todo el carrito del usuario
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
      return NextResponse.json({ message: 'Carrito vaciado' });
    }

    return NextResponse.json({ error: 'Operación no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Error al eliminar del carrito' },
      { status: 500 },
    );
  }
}

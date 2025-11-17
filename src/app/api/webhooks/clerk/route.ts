// src/app/api/webhooks/clerk/route.ts
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // CORRECCIÓN: Agregar await a headers()
    const headerList = await headers();
    const svixId = headerList.get('svix-id');
    const svixTimestamp = headerList.get('svix-timestamp');
    const svixSignature = headerList.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse('Error: Missing Svix headers', { status: 400 });
    }

    // Obtener el body raw
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Por ahora, aceptamos el webhook sin verificación estricta
    const eventType = payload.type;
    const eventData = payload.data;

    if (eventType === 'user.created') {
      await handleUserCreated(eventData);
    } else if (eventType === 'user.updated') {
      await handleUserUpdated(eventData);
    }

    return NextResponse.json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function handleUserCreated(userData: any) {
  try {
    console.log('Creating user from webhook:', userData.id);

    const user = await prisma.user.create({
      data: {
        clerkId: userData.id,
        email: userData.email_addresses?.[0]?.email_address || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        avatar: userData.image_url,
        role: 'USER',
        isActive: true,
      },
    });

    console.log('User created successfully:', user.id);
  } catch (error) {
    console.error('Error creating user from webhook:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    console.log('Updating user from webhook:', userData.id);

    const user = await prisma.user.update({
      where: { clerkId: userData.id },
      data: {
        email: userData.email_addresses?.[0]?.email_address,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatar: userData.image_url,
        updatedAt: new Date(),
      },
    });

    console.log('User updated successfully:', user.id);
  } catch (error) {
    console.error('Error updating user from webhook:', error);
  }
}

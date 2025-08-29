// src/app/api/images/[...path]/route.ts
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // Await the params before using its properties
    const { path: pathArray } = await params;

    // Construir la ruta completa al archivo dentro de la carpeta public/uploads
    const filePath = path.join(
      process.cwd(),
      'public',
      'uploads',
      ...pathArray,
    );

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`Imagen no encontrada: ${filePath}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Leer el archivo
    const imageBuffer = fs.readFileSync(filePath);

    // Determinar el tipo de contenido
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    // Devolver la imagen
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

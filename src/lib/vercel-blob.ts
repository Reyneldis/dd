// src/lib/vercel-blob.ts
import { del } from '@vercel/blob';

export async function deleteBlob(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting blob:', error);
    return false;
  }
}

// Función para eliminar múltiples blobs
export async function deleteBlobs(
  urls: string[],
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];

  for (const url of urls) {
    const result = await deleteBlob(url);
    if (result) {
      success.push(url);
    } else {
      failed.push(url);
    }
  }

  return { success, failed };
}

// src/components/ui/image-upload.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // en MB
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  maxFiles = 5,
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (disabled) return;

      if (value.length + files.length > maxFiles) {
        toast.error(`No puedes subir más de ${maxFiles} imágenes`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const uploadPromises = files.map(async file => {
          // Validar tamaño del archivo
          if (file.size > maxSize * 1024 * 1024) {
            throw new Error(
              `El archivo ${file.name} excede el tamaño máximo de ${maxSize}MB`,
            );
          }

          // Aquí iría la lógica para subir a Vercel Blob
          // Por ahora, simulamos una carga con FileReader
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              } else {
                reject(new Error('Error al leer el archivo'));
              }
            };
            reader.onerror = () =>
              reject(new Error('Error al leer el archivo'));
            reader.readAsDataURL(file);
          });
        });

        const results = await Promise.all(uploadPromises);
        onChange([...value, ...results]);
        toast.success(`${results.length} imagen(es) subida(s) correctamente`);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Error al subir las imágenes',
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [disabled, value, onChange, maxFiles, maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      handleUpload(files);
    },
    [handleUpload],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleUpload(files);
      }
    },
    [handleUpload],
  );

  return (
    <div>
      <Card
        className={`border-2 border-dashed transition-colors ${
          isUploading
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          {isUploading ? (
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                Subiendo imágenes...
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </div>
                <div className="text-xs text-muted-foreground">
                  PNG, JPG o GIF (MAX. {maxSize}MB)
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={disabled}
                onChange={handleFileInput}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Seleccionar archivos
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {value.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Imágenes subidas:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-md border">
                  <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

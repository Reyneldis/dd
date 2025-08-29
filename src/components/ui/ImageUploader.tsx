"use client";

import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onFileChange, initialImageUrl }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onFileChange(file);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/avif': [],
    },
    maxFiles: 1,
  });

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que se abra el diálogo de selección de archivo
    setPreview(null);
    onFileChange(null);
    // Limpia la URL del objeto para liberar memoria
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out
      ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
      ${preview ? 'p-2' : ''}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative w-full h-48">
          <Image
            src={preview}
            alt="Image preview"
            fill
            className="object-contain rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadCloud className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500">
            {isDragActive
              ? 'Suelta la imagen aquí...'
              : "Arrastra una imagen aquí, o haz clic para seleccionarla"}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP, AVIF</p>
        </div>
      )}
    </div>
  );
}
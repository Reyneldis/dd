'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectedFile?: File | null;
  previewUrl?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  onFileSelect,
  onRemove,
  selectedFile,
  previewUrl,
  className,
  accept = 'image/*',
  maxSize = 5242880, // 5MB
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize,
    multiple: false,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preview */}
      {(selectedFile || previewUrl) && (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            <Image
              src={
                selectedFile ? URL.createObjectURL(selectedFile) : (previewUrl as string)
              }
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!selectedFile && !previewUrl && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragActive || dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            'relative',
          )}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <Upload className="h-6 w-6 text-blue-500" />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Suelta la imagen aquí' : 'Subir imagen'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Arrastra y suelta una imagen, o{' '}
                <span className="text-blue-500 hover:text-blue-600">
                  haz clic para seleccionar
                </span>
              </p>
            </div>
            <div className="text-xs text-gray-400">
              PNG, JPG, GIF, WEBP hasta 5MB
            </div>
          </div>
        </div>
      )}

      {/* Manual File Input */}
      {!selectedFile && !previewUrl && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </Button>
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

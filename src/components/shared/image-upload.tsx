'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(response.data.filePath);
      toast.success('Image uploaded successfully.');
    } catch (error) {
      toast.error('Failed to upload image.');
      console.error('Image upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      handleUpload(acceptedFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/avif': [],
    },
    maxFiles: 1,
    disabled: disabled || loading,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map(url => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
        ${disabled || loading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadCloud className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500">
            {isDragActive
              ? 'Suelta la imagen aquí...'
              : 'Arrastra una imagen o haz clic para seleccionarla'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP, AVIF</p>
          {loading && <p className="text-sm text-primary mt-2">Subiendo...</p>}
        </div>
      </div>
    </div>
  );
};

export { ImageUpload };

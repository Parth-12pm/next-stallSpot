'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onUpload?: () => void;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  onUpload
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onChange(data.url);
      onUpload?.();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  });

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 
          hover:bg-muted/50 transition cursor-pointer
          ${isDragActive ? 'border-primary' : 'border-muted-foreground/25'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            {isUploading ? (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {value && (
        <div className="relative aspect-square w-32 rounded-lg overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Profile picture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 z-10"
            size="icon"
            variant="destructive"
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
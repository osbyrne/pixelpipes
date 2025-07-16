
import React, { useState, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrls: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload image files",
        variant: "destructive"
      });
      return;
    }

    if (imageFiles.length < files.length) {
      toast({
        title: "Some files skipped",
        description: `${files.length - imageFiles.length} non-image files were skipped`,
        variant: "destructive"
      });
    }

    const imageUrls: string[] = [];
    
    for (const file of imageFiles) {
      try {
        const imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
              resolve(e.target.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    if (imageUrls.length > 0) {
      onImageUpload(imageUrls);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-card rounded-lg border border-border shadow-sm flex flex-col items-center">
      <h3 className="text-xs sm:text-sm font-medium text-card-foreground mb-4 hidden sm:block">Add New Images</h3>
      <h3 className="text-xs font-medium text-card-foreground mb-4 sm:hidden">Add Images</h3>
      <div 
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 w-full flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input 
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          multiple
        />
        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-2" />
        <p className="text-xs sm:text-sm text-muted-foreground mb-1 hidden sm:block">Drag & drop images here</p>
        <p className="text-xs text-muted-foreground mb-1 sm:hidden">Upload</p>
        <p className="text-xs text-muted-foreground/70 hidden sm:block">or click to browse</p>
      </div>
    </div>
  );
};

export default ImageUploader;

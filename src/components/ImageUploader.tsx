
import React, { useState, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onImageUpload(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-card rounded-lg border border-border shadow-sm flex flex-col items-center">
      <h3 className="text-xs sm:text-sm font-medium text-card-foreground mb-4 hidden sm:block">Add New Image</h3>
      <h3 className="text-xs font-medium text-card-foreground mb-4 sm:hidden">Add Image</h3>
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
        />
        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-2" />
        <p className="text-xs sm:text-sm text-muted-foreground mb-1 hidden sm:block">Drag & drop an image here</p>
        <p className="text-xs text-muted-foreground mb-1 sm:hidden">Upload</p>
        <p className="text-xs text-muted-foreground/70 hidden sm:block">or click to browse</p>
      </div>
    </div>
  );
};

export default ImageUploader;

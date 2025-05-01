
import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Pipeline from '@/components/Pipeline';

interface ImagePipeline {
  id: string;
  imageUrl: string;
}

const Index = () => {
  const [pipelines, setPipelines] = useState<ImagePipeline[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    const newPipeline: ImagePipeline = {
      id: `pipeline-${Date.now()}`,
      imageUrl,
    };
    
    setPipelines([...pipelines, newPipeline]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Visual Pipeline Gallery</h1>
          <p className="text-gray-600">Upload images and apply transformations to create visual pipelines</p>
        </header>
        
        <div className="flex flex-wrap gap-6">
          {pipelines.map((pipeline) => (
            <Pipeline key={pipeline.id} imageUrl={pipeline.imageUrl} />
          ))}
          
          {/* Drag & drop uploader is always visible and on the rightmost side */}
          <div className="min-w-[280px] max-w-[350px]">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

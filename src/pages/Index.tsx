
import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Pipeline from '@/components/Pipeline';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ImagePipeline {
  id: string;
  imageUrl: string;
}

const Index = () => {
  const [pipelines, setPipelines] = useState<ImagePipeline[]>([]);
  const [showUploader, setShowUploader] = useState(true);

  const handleImageUpload = (imageUrl: string) => {
    const newPipeline: ImagePipeline = {
      id: `pipeline-${Date.now()}`,
      imageUrl,
    };
    
    setPipelines([...pipelines, newPipeline]);
    setShowUploader(false);
  };

  const handleAddImage = () => {
    setShowUploader(true);
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
          
          {showUploader ? (
            <div className="min-w-[280px] max-w-[350px]">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <div className="min-w-[280px] max-w-[350px] flex items-center justify-center">
              <Button 
                onClick={handleAddImage} 
                className="h-40 w-full border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50"
                variant="ghost"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add New Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

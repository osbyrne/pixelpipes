
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Pipeline from '@/components/Pipeline';
import { availableTransforms, TransformType } from '@/utils/transforms';
import { useToast } from '@/hooks/use-toast';

interface ImagePipeline {
  id: string;
  imageUrl: string;
}

const Index = () => {
  const [pipelines, setPipelines] = useState<ImagePipeline[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    const newPipeline: ImagePipeline = {
      id: `pipeline-${Date.now()}`,
      imageUrl,
    };
    
    setPipelines([...pipelines, newPipeline]);
  };

  // Listen for transform events from any pipeline
  useEffect(() => {
    const handleTransformApplied = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { transformType } = customEvent.detail;
      
      // Apply the same transform to all pipelines
      if (pipelines.length > 1) {
        // Find the transform object
        const transform = availableTransforms.find(t => t.type === transformType);
        if (!transform) return;

        try {
          // Create a new array to store the updated pipelines
          const updatedPipelines = [...pipelines];
          
          // Process all pipelines to apply the same transform
          for (let i = 0; i < updatedPipelines.length; i++) {
            const pipeline = updatedPipelines[i];
            const transformedImageUrl = await transform.apply(pipeline.imageUrl);
            
            updatedPipelines[i] = {
              ...pipeline,
              imageUrl: transformedImageUrl
            };
          }
          
          // Update state with all transformed pipelines
          setPipelines(updatedPipelines);
          
          toast({
            title: "Row transformation complete",
            description: `${transform.label} transform applied to all images in the row.`
          });
        } catch (error) {
          console.error('Error applying row transform:', error);
          toast({
            title: "Row transform failed",
            description: "There was a problem applying the transformation to all images.",
            variant: "destructive"
          });
        }
      }
    };

    document.addEventListener('transform-applied', handleTransformApplied);
    
    return () => {
      document.removeEventListener('transform-applied', handleTransformApplied);
    };
  }, [pipelines, toast]);

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

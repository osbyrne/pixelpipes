
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Pipeline from '@/components/Pipeline';
import { availableTransforms, TransformType } from '@/utils/transforms';
import { useToast } from '@/hooks/use-toast';

interface ImagePipeline {
  id: string;
  imageUrl: string;
  transforms: { type: TransformType; imageUrl: string }[];
}

const Index = () => {
  const [pipelines, setPipelines] = useState<ImagePipeline[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    const newPipeline: ImagePipeline = {
      id: `pipeline-${Date.now()}`,
      imageUrl,
      transforms: []
    };
    
    setPipelines([...pipelines, newPipeline]);
  };

  // Listen for transform events from any pipeline
  useEffect(() => {
    const handleTransformApplied = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { transformType } = customEvent.detail;
      
      console.log('Transform applied event received:', transformType);
      
      // Apply the same transform to all pipelines
      if (pipelines.length > 0) {
        // Find the transform object
        const transform = availableTransforms.find(t => t.type === transformType);
        if (!transform) {
          console.error('Transform not found:', transformType);
          return;
        }

        try {
          console.log('Applying transform to all pipelines:', transform.label);
          
          // Create a new array to store the updated pipelines
          const updatedPipelines = await Promise.all(
            pipelines.map(async (pipeline) => {
              // Get the source image (either original or last transform result)
              const sourceImage = pipeline.transforms.length > 0 
                ? pipeline.transforms[pipeline.transforms.length - 1].imageUrl 
                : pipeline.imageUrl;
              
              console.log('Applying transform to source:', sourceImage);
              
              // Apply the transformation
              const transformedImageUrl = await transform.apply(sourceImage);
              
              console.log('Transform result:', transformedImageUrl);
              
              // Add the new transform to this pipeline
              return {
                ...pipeline,
                transforms: [
                  ...pipeline.transforms,
                  { type: transformType, imageUrl: transformedImageUrl }
                ]
              };
            })
          );
          
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
        
        <div className="grid grid-cols-3 gap-6">
          {/* Left column - Transforms */}
          <div className="col-span-1">
            {pipelines.length > 0 && (
              <Pipeline 
                imageUrl={pipelines[0].imageUrl} 
                transforms={pipelines[0].transforms}
                layoutType="transforms-only" 
              />
            )}
          </div>
          
          {/* Middle column - Images */}
          <div className="col-span-1 flex gap-4">
            {pipelines.map((pipeline) => (
              <Pipeline 
                key={pipeline.id} 
                imageUrl={pipeline.imageUrl} 
                transforms={pipeline.transforms}
                layoutType="images-only" 
              />
            ))}
          </div>
          
          {/* Right column - Image uploader */}
          <div className="col-span-1">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

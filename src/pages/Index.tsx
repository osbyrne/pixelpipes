
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
        
        {/* Mobile: Stack vertically, Desktop: 4 columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Transform controls */}
          <div className="order-1 lg:col-span-1">
            {pipelines.length > 0 && (
              <Pipeline 
                imageUrl={pipelines[0].imageUrl} 
                transforms={pipelines[0].transforms}
                layoutType="transforms-only" 
              />
            )}
          </div>
          
          {/* Applied effects list */}
          <div className="order-2 lg:col-span-1">
            {pipelines.length > 0 && pipelines[0].transforms.length > 0 && (
              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="text-sm font-medium text-gray-700 mb-3 hidden sm:block">Applied Effects</h3>
                <h3 className="text-xs font-medium text-gray-700 mb-3 sm:hidden">Effects</h3>
                <div className="space-y-2">
                  {pipelines[0].transforms.map((transform, index) => (
                    <div 
                      key={`${transform.type}-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="capitalize font-medium text-gray-700">
                        {index + 1}. {transform.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Images */}
          <div className="order-4 lg:order-3 lg:col-span-1 flex gap-2 overflow-x-auto">
            {pipelines.map((pipeline) => (
              <Pipeline 
                key={pipeline.id} 
                imageUrl={pipeline.imageUrl} 
                transforms={pipeline.transforms}
                layoutType="images-only" 
              />
            ))}
          </div>
          
          {/* Image uploader */}
          <div className="order-3 lg:order-4 lg:col-span-1">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

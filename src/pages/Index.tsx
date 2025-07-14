
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Pipeline from '@/components/Pipeline';
import { ColorPickerDialog } from '@/components/ColorPickerDialog';
import { AlphaThresholdDialog } from '@/components/AlphaThresholdDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { availableTransforms, TransformType, TransformStep } from '@/utils/transforms';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PipelineTransform extends TransformStep {
  imageUrl: string;
}

interface ImagePipeline {
  id: string;
  imageUrl: string;
  transforms: PipelineTransform[];
}

const Index = () => {
  const [pipelines, setPipelines] = useState<ImagePipeline[]>([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [alphaThresholdOpen, setAlphaThresholdOpen] = useState(false);
  const [pendingTransform, setPendingTransform] = useState<TransformType | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (imageUrl: string) => {
    try {
      // If there are existing pipelines with transforms, apply them to the new image
      let transforms: PipelineTransform[] = [];
      if (pipelines.length > 0 && pipelines[0].transforms.length > 0) {
        let currentImageUrl = imageUrl;
        
        // Apply each transform sequentially
        for (const transform of pipelines[0].transforms) {
          const transformDefinition = availableTransforms.find(t => t.type === transform.type);
          if (transformDefinition) {
            const transformedImageUrl = await transformDefinition.apply(currentImageUrl, transform.params);
            transforms.push({
              type: transform.type,
              params: transform.params,
              imageUrl: transformedImageUrl
            });
            currentImageUrl = transformedImageUrl;
          }
        }
      }

      const newPipeline: ImagePipeline = {
        id: `pipeline-${Date.now()}`,
        imageUrl,
        transforms
      };
      
      setPipelines([...pipelines, newPipeline]);

      if (transforms.length > 0) {
        toast({
          title: "Image added with transforms",
          description: `Applied ${transforms.length} existing transform${transforms.length > 1 ? 's' : ''} to the new image.`
        });
      }
    } catch (error) {
      console.error('Error applying transforms to new image:', error);
      toast({
        title: "Image added with errors",
        description: "Some transforms could not be applied to the new image.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStep = async (stepIndex: number) => {
    if (pipelines.length === 0) return;

    try {
      console.log('Deleting step at index:', stepIndex);
      
      // Create new pipelines with the step removed and recompute subsequent steps
      const updatedPipelines = await Promise.all(
        pipelines.map(async (pipeline) => {
          // Remove the step at stepIndex
          const newTransforms = [...pipeline.transforms];
          newTransforms.splice(stepIndex, 1);
          
          // If there are remaining transforms after the deleted one, recompute them
          const recomputedTransforms: PipelineTransform[] = [];
          let currentImageUrl = pipeline.imageUrl;
          
          for (let i = 0; i < newTransforms.length; i++) {
            if (i < stepIndex) {
              // Keep transforms before the deleted step as they are
              recomputedTransforms.push(newTransforms[i]);
              currentImageUrl = newTransforms[i].imageUrl;
            } else {
              // Recompute transforms from the deletion point onward
              const transformType = newTransforms[i].type;
              const transform = availableTransforms.find(t => t.type === transformType);
              
              if (transform) {
                const transformedImageUrl = await transform.apply(currentImageUrl, newTransforms[i].params);
                const recomputedTransform: PipelineTransform = { 
                  type: transformType,
                  params: newTransforms[i].params,
                  imageUrl: transformedImageUrl 
                };
                recomputedTransforms.push(recomputedTransform);
                currentImageUrl = transformedImageUrl;
              }
            }
          }
          
          return {
            ...pipeline,
            transforms: recomputedTransforms
          };
        })
      );
      
      setPipelines(updatedPipelines);
      
      toast({
        title: "Step removed",
        description: "Pipeline has been recomputed for all images."
      });
    } catch (error) {
      console.error('Error deleting step:', error);
      toast({
        title: "Delete failed",
        description: "There was a problem removing the step.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePipeline = (pipelineId: string) => {
    setPipelines(pipelines.filter(pipeline => pipeline.id !== pipelineId));
    
    toast({
      title: "Image removed",
      description: "The image and its transformations have been removed."
    });
  };

  const handleColorPickerConfirm = async (color: string, tolerance: number, transparencyThreshold: number, opacityThreshold: number) => {
    if (!pendingTransform) return;
    
    const params = { color, tolerance, transparencyThreshold, opacityThreshold };
    await applyTransformWithParams(pendingTransform, params);
    setPendingTransform(null);
  };

  const handleColorPickerCancel = () => {
    setPendingTransform(null);
  };

  const handleAlphaThresholdConfirm = async (whiteThreshold: number, blackThreshold: number) => {
    if (!pendingTransform) return;
    
    const params = { whiteThreshold, blackThreshold };
    await applyTransformWithParams(pendingTransform, params);
    setPendingTransform(null);
  };

  const handleAlphaThresholdCancel = () => {
    setPendingTransform(null);
  };

  const applyTransformWithParams = async (transformType: TransformType, params?: any) => {
    if (pipelines.length === 0) return;

    // Find the transform object
    const transform = availableTransforms.find(t => t.type === transformType);
    if (!transform) {
      console.error('Transform not found:', transformType);
      return;
    }

    try {
      console.log('Applying transform to all pipelines:', transform.label, 'with params:', params);
      
      // Create a new array to store the updated pipelines
      const updatedPipelines = await Promise.all(
        pipelines.map(async (pipeline) => {
          // Get the source image (either original or last transform result)
          const sourceImage = pipeline.transforms.length > 0 
            ? pipeline.transforms[pipeline.transforms.length - 1].imageUrl 
            : pipeline.imageUrl;
          
          console.log('Applying transform to source:', sourceImage);
          
          // Apply the transformation
          const transformedImageUrl = await transform.apply(sourceImage, params);
          
          console.log('Transform result:', transformedImageUrl);
          
          // Add the new transform to this pipeline
          return {
            ...pipeline,
            transforms: [
              ...pipeline.transforms,
              { type: transformType, params, imageUrl: transformedImageUrl }
            ]
          };
        })
      );
      
      // Update state with all transformed pipelines
      setPipelines(updatedPipelines);
      
      toast({
        title: "Transform complete",
        description: `${transform.label} applied to all images.`
      });
    } catch (error) {
      console.error('Error applying transform:', error);
      toast({
        title: "Transform failed",
        description: "There was a problem applying the transformation.",
        variant: "destructive"
      });
    }
  };

  // Listen for transform events from any pipeline
  useEffect(() => {
    const handleTransformApplied = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { transformType } = customEvent.detail;
      
      console.log('Transform applied event received:', transformType);
      
      // Check if this transform needs parameters
      const transform = availableTransforms.find(t => t.type === transformType);
      if (transform?.needsParams) {
        if (transformType === 'color-to-alpha') {
          setPendingTransform(transformType);
          setColorPickerOpen(true);
          return;
        } else if (transformType === 'alpha-threshold') {
          setPendingTransform(transformType);
          setAlphaThresholdOpen(true);
          return;
        }
      }
      
      // Apply transform without parameters
      await applyTransformWithParams(transformType);
    };

    document.addEventListener('transform-applied', handleTransformApplied);
    
    return () => {
      document.removeEventListener('transform-applied', handleTransformApplied);
    };
  }, [pipelines, toast]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Visual Pipeline Gallery</h1>
          <p className="text-muted-foreground">Upload images and apply transformations to create visual pipelines</p>
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
              <div className="p-4 rounded-lg bg-card shadow-sm border border-border">
                <h3 className="text-sm font-medium text-card-foreground mb-3 hidden sm:block">Applied Effects</h3>
                <h3 className="text-xs font-medium text-card-foreground mb-3 sm:hidden">Effects</h3>
                <div className="space-y-2">
                  {pipelines[0].transforms.map((transform, index) => (
                    <div 
                      key={`${transform.type}-${index}`}
                      className="flex items-center justify-between p-2 bg-muted rounded border border-border text-sm"
                    >
                      <span className="capitalize font-medium text-muted-foreground">
                        {index + 1}. {transform.type}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                        onClick={() => handleDeleteStep(index)}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Images */}
          <div className="order-4 lg:order-3 lg:col-span-1 flex gap-2 overflow-x-auto">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 h-6 w-6 p-0 bg-background/90 hover:bg-destructive/10 border border-border rounded-full shadow-sm"
                  onClick={() => handleDeletePipeline(pipeline.id)}
                >
                  <X className="h-3 w-3 text-destructive" />
                </Button>
                <Pipeline 
                  imageUrl={pipeline.imageUrl} 
                  transforms={pipeline.transforms}
                  layoutType="images-only" 
                />
              </div>
            ))}
          </div>
          
          {/* Image uploader */}
          <div className="order-3 lg:order-4 lg:col-span-1">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        </div>
        
        <ColorPickerDialog
          open={colorPickerOpen}
          onOpenChange={setColorPickerOpen}
          onConfirm={handleColorPickerConfirm}
          onCancel={handleColorPickerCancel}
        />
        
        <AlphaThresholdDialog
          open={alphaThresholdOpen}
          onOpenChange={setAlphaThresholdOpen}
          onConfirm={handleAlphaThresholdConfirm}
          onCancel={handleAlphaThresholdCancel}
        />
      </div>
    </div>
  );
};

export default Index;

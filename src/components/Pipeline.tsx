import React, { useState } from 'react';
import { availableTransforms, Transform, TransformType, TransformStep } from '@/utils/transforms';
import TransformPanel from './TransformPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Palette, Contrast, Minus, Droplets } from 'lucide-react';

interface PipelineTransform extends TransformStep {
  imageUrl: string;
}

interface PipelineProps {
  imageUrl: string;
  transforms?: PipelineTransform[];
  layoutType?: 'transforms-only' | 'images-only' | 'full';
}

const Pipeline: React.FC<PipelineProps> = ({ imageUrl, transforms = [], layoutType = 'full' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAddTransform = async (transform: Transform) => {
    try {
      setIsProcessing(true);
      
      console.log('Broadcasting transform event:', transform.type);
      
      // Broadcast the transform application to parent component
      document.dispatchEvent(new CustomEvent('transform-applied', {
        detail: {
          transformType: transform.type
        }
      }));
      
    } catch (error) {
      console.error('Error broadcasting transform:', error);
      toast({
        title: "Transform failed",
        description: "There was a problem applying the transformation.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get icon for transform type
  const getTransformIcon = (type: TransformType) => {
    switch (type) {
      case 'grayscale':
        return Contrast;
      case 'sepia':
        return Palette;
      case 'invert':
        return Minus;
      case 'color-to-alpha':
        return Droplets;
      default:
        return Palette;
    }
  };

  // Render transform controls only
  if (layoutType === 'transforms-only') {
    return (
      <div className="flex flex-col space-y-4">
        <div className="p-4 rounded-lg bg-card shadow-sm border border-border">
          <h3 className="text-sm font-medium text-card-foreground mb-3 hidden sm:block">Available Transforms</h3>
          <h3 className="text-sm font-medium text-card-foreground mb-3 sm:hidden">Transforms</h3>
          <div className="grid gap-2">
            {availableTransforms.map((transform) => {
              const Icon = getTransformIcon(transform.type);
              return (
                <Button
                  key={transform.type}
                  variant="outline"
                  size="sm"
                  className="justify-start sm:justify-start justify-center"
                  onClick={() => handleAddTransform(transform)}
                  disabled={isProcessing}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">{transform.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render images only - with each transform result shown in a vertical column
  if (layoutType === 'images-only') {
    return (
      <div className="flex flex-col space-y-4 min-w-[150px] sm:min-w-[200px]">
        {/* Original Image */}
        <Card className="overflow-hidden">
          <div className="bg-muted px-2 sm:px-4 py-2 border-b border-border">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Original</h3>
          </div>
          <div className="p-2 sm:p-4">
            <img 
              src={imageUrl} 
              alt="Original" 
              className="w-full h-auto object-contain rounded" 
              style={{ maxHeight: '120px' }}
            />
          </div>
        </Card>

        {/* Transform Results */}
        {transforms.map((transform, index) => (
          <Card key={`${transform.type}-${index}`} className="overflow-hidden">
            <div className="bg-muted px-2 sm:px-4 py-2 border-b border-border">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
                {transform.type.replace('-', ' ')}
                {transform.params?.color && (
                  <span className="ml-2 text-xs text-muted-foreground/70">
                    ({transform.params.color})
                  </span>
                )}
              </h3>
            </div>
            <div className="p-2 sm:p-4">
              <img 
                src={transform.imageUrl} 
                alt={`${transform.type} transform`}
                className="w-full h-auto object-contain rounded"
                style={{ maxHeight: '120px' }}
              />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Full layout (default) - not used in current setup but keeping for completeness
  return (
    <div className="flex gap-4 min-w-[280px] max-w-full">
      {/* Transform controls column */}
      <div className="w-[100px]">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-4"
          disabled={isProcessing}
          onClick={() => handleAddTransform(availableTransforms[0])}
        >
          Add Transform
        </Button>
      </div>

      {/* Images column */}
      <div className="flex flex-col space-y-4 min-w-[280px] max-w-[350px]">
        <Card className="overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Original Image</h3>
          </div>
          <div className="p-4">
            <img 
              src={imageUrl} 
              alt="Original" 
              className="w-full h-auto object-contain rounded" 
              style={{ maxHeight: '200px' }}
            />
          </div>
        </Card>

        {transforms.map((transform, index) => (
          <TransformPanel
            key={`${transform.type}-${index}`}
            transformType={transform.type}
            originalImage={index === 0 ? imageUrl : transforms[index - 1].imageUrl}
            transformedImage={transform.imageUrl}
            onAddTransform={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Pipeline;

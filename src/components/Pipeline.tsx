
import React, { useState } from 'react';
import { availableTransforms, Transform, TransformType } from '@/utils/transforms';
import TransformPanel from './TransformPanel';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PipelineProps {
  imageUrl: string;
}

interface TransformResult {
  type: TransformType;
  imageUrl: string;
}

const Pipeline: React.FC<PipelineProps> = ({ imageUrl }) => {
  const [transforms, setTransforms] = useState<TransformResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAddTransform = async (transform: Transform) => {
    try {
      setIsProcessing(true);
      
      // Get the source image for this transform
      const sourceImage = transforms.length > 0 
        ? transforms[transforms.length - 1].imageUrl 
        : imageUrl;
      
      // Apply the transformation
      const transformedImageUrl = await transform.apply(sourceImage);
      
      // Add to the list of transformations
      setTransforms([
        ...transforms, 
        { 
          type: transform.type, 
          imageUrl: transformedImageUrl 
        }
      ]);
      
      // Broadcast the transform application to parent component
      document.dispatchEvent(new CustomEvent('transform-applied', {
        detail: {
          transformType: transform.type
        }
      }));
      
      toast({
        title: "Transform applied",
        description: `${transform.label} transform has been applied to row.`
      });
    } catch (error) {
      console.error('Error applying transform:', error);
      toast({
        title: "Transform failed",
        description: "There was a problem applying the transformation.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 min-w-[280px] max-w-[350px]">
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium text-gray-700">Original Image</h3>
        </div>
        <div className="p-4">
          <img 
            src={imageUrl} 
            alt="Original" 
            className="w-full h-auto object-contain rounded" 
            style={{ maxHeight: '200px' }}
          />
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={isProcessing}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row Transform
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="grid gap-1">
                {availableTransforms.map((transform) => (
                  <Button
                    key={transform.type}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleAddTransform(transform)}
                    disabled={isProcessing}
                  >
                    {transform.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {transforms.map((transform, index) => (
        <TransformPanel
          key={`${transform.type}-${index}`}
          transformType={transform.type}
          originalImage={index === 0 ? imageUrl : transforms[index - 1].imageUrl}
          transformedImage={transform.imageUrl}
          onAddTransform={() => {
            // When adding a transform after an existing one, show the popover
            const button = document.getElementById(`add-transform-${index}`);
            if (button) button.click();
          }}
        />
      ))}

      {transforms.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              id={`add-transform-${transforms.length - 1}`}
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              disabled={isProcessing}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row Transform
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-1">
              {availableTransforms.map((transform) => (
                <Button
                  key={transform.type}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => handleAddTransform(transform)}
                  disabled={isProcessing}
                >
                  {transform.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default Pipeline;

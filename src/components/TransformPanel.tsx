
import React from 'react';
import { TransformType } from '@/utils/transforms';

interface TransformPanelProps {
  transformType: TransformType;
  originalImage: string;
  transformedImage: string;
  onAddTransform: () => void;
}

const TransformPanel: React.FC<TransformPanelProps> = ({ 
  transformType, 
  originalImage, 
  transformedImage,
  onAddTransform 
}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white mb-4">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700 capitalize">{transformType} Transform</h3>
      </div>
      <div className="p-4">
        <img 
          src={transformedImage} 
          alt={`${transformType} transform`}
          className="w-full h-auto object-contain rounded"
          style={{ maxHeight: '200px' }}
        />
      </div>
    </div>
  );
};

export default TransformPanel;

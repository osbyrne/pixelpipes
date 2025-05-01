
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
        <h3 className="text-sm font-medium text-gray-700 capitalize">{transformType}</h3>
      </div>
      <div className="p-4">
        <img 
          src={transformedImage} 
          alt={`${transformType} transform`}
          className="w-full h-auto object-contain rounded"
          style={{ maxHeight: '200px' }}
        />
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t">
        <button
          onClick={onAddTransform}
          className="w-full py-1 px-3 text-xs flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Add Transform
        </button>
      </div>
    </div>
  );
};

export default TransformPanel;

/**
 * Applies grayscale filter to an image
 * @param imageUrl - The data URL or source of the image
 * @returns Promise that resolves with the transformed image data URL
 */
export const applyGrayscale = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting grayscale transform on:', imageUrl.substring(0, 50) + '...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded for grayscale, dimensions:', img.width, 'x', img.height);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply grayscale filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      console.log('Applying grayscale to', data.length / 4, 'pixels');
      
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
        // alpha channel (data[i + 3]) remains unchanged
      }
      
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Grayscale transform complete, result:', result.substring(0, 50) + '...');
      resolve(result);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image for grayscale:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Applies sepia filter to an image
 * @param imageUrl - The data URL or source of the image
 * @returns Promise that resolves with the transformed image data URL
 */
export const applySepia = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting sepia transform on:', imageUrl.substring(0, 50) + '...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded for sepia, dimensions:', img.width, 'x', img.height);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply sepia filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      console.log('Applying sepia to', data.length / 4, 'pixels');
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // red
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // green
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // blue
        // alpha channel (data[i + 3]) remains unchanged
      }
      
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Sepia transform complete, result:', result.substring(0, 50) + '...');
      resolve(result);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image for sepia:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Applies color inversion filter to an image
 * @param imageUrl - The data URL or source of the image
 * @returns Promise that resolves with the transformed image data URL
 */
export const applyInvert = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting invert transform on:', imageUrl.substring(0, 50) + '...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded for invert, dimensions:', img.width, 'x', img.height);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply invert filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      console.log('Applying invert to', data.length / 4, 'pixels');
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
        // alpha channel (data[i + 3]) remains unchanged
      }
      
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Invert transform complete, result:', result.substring(0, 50) + '...');
      resolve(result);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image for invert:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

// Transform types and options
export type TransformType = 'grayscale' | 'sepia' | 'invert';

export interface Transform {
  type: TransformType;
  label: string;
  apply: (imageUrl: string) => Promise<string>;
}

export const availableTransforms: Transform[] = [
  {
    type: 'grayscale',
    label: 'Grayscale',
    apply: applyGrayscale
  },
  {
    type: 'sepia',
    label: 'Sepia',
    apply: applySepia
  },
  {
    type: 'invert',
    label: 'Invert',
    apply: applyInvert
  }
];

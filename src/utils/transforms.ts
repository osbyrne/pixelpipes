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

/**
 * Applies color to alpha filter to an image
 * @param imageUrl - The data URL or source of the image
 * @param targetColor - The hex color to make transparent (e.g., "#ffffff")
 * @param tolerance - Color tolerance threshold (0-255)
 * @param transparencyThreshold - Minimum transparency level (0-100)
 * @param opacityThreshold - Maximum opacity for partial matches (0-100)
 * @returns Promise that resolves with the transformed image data URL
 */
export const applyColorToAlpha = (
  imageUrl: string, 
  targetColor: string = "#ffffff", 
  tolerance: number = 30,
  transparencyThreshold: number = 50,
  opacityThreshold: number = 80
): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting color-to-alpha transform on:', imageUrl.substring(0, 50) + '...');
    console.log('Params - Target color:', targetColor, 'Tolerance:', tolerance, 'Transparency threshold:', transparencyThreshold, 'Opacity threshold:', opacityThreshold);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded for color-to-alpha, dimensions:', img.width, 'x', img.height);
      
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
      
      // Convert hex color to RGB
      const hex = targetColor.replace('#', '');
      const targetR = parseInt(hex.substr(0, 2), 16);
      const targetG = parseInt(hex.substr(2, 2), 16);
      const targetB = parseInt(hex.substr(4, 2), 16);
      
      // Apply color to alpha filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      console.log('Applying color-to-alpha to', data.length / 4, 'pixels');
      console.log('Target RGB:', targetR, targetG, targetB);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate color distance
        const deltaR = Math.abs(r - targetR);
        const deltaG = Math.abs(g - targetG);
        const deltaB = Math.abs(b - targetB);
        const distance = Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
        
        // Apply transparency thresholds with improved algorithm
        if (distance <= tolerance) {
          // Calculate alpha based on distance and thresholds
          const normalizedDistance = distance / tolerance; // 0 to 1
          
          // Map transparency and opacity thresholds to 0-255 range
          const minAlpha = (transparencyThreshold / 100) * 255;
          const maxAlpha = (opacityThreshold / 100) * 255;
          
          // Calculate final alpha: closer colors get more transparency
          const alpha = Math.max(minAlpha, Math.min(maxAlpha, normalizedDistance * 255));
          
          data[i + 3] = Math.round(255 - alpha); // Invert for transparency
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/png'); // Use PNG to preserve transparency
      console.log('Color-to-alpha transform complete, result:', result.substring(0, 50) + '...');
      resolve(result);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image for color-to-alpha:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Upscales an image by doubling the pixel count with cubic interpolation
 * @param imageUrl - The data URL or source of the image
 * @returns Promise that resolves with the upscaled image data URL
 */
export const applyUpscale = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting upscale transform on:', imageUrl.substring(0, 50) + '...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded for upscale, original dimensions:', img.width, 'x', img.height);
      
      const canvas = document.createElement('canvas');
      const newWidth = img.width * 2;
      const newHeight = img.height * 2;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Enable image smoothing with highest quality for cubic interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the scaled image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      const result = canvas.toDataURL('image/jpeg', 0.9);
      console.log('Upscale transform complete, new dimensions:', newWidth, 'x', newHeight);
      resolve(result);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image for upscale:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

// Transform types and options
export type TransformType = 'grayscale' | 'sepia' | 'invert' | 'color-to-alpha' | 'upscale';

export interface TransformStep {
  type: TransformType;
  params?: {
    color?: string;
    tolerance?: number;
    transparencyThreshold?: number;
    opacityThreshold?: number;
  };
}

export interface Transform {
  type: TransformType;
  label: string;
  apply: (imageUrl: string, params?: any) => Promise<string>;
  needsParams?: boolean;
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
  },
  {
    type: 'color-to-alpha',
    label: 'Color to Alpha',
    apply: (imageUrl: string, params?: { color?: string; tolerance?: number; transparencyThreshold?: number; opacityThreshold?: number }) => 
      applyColorToAlpha(imageUrl, params?.color, params?.tolerance, params?.transparencyThreshold, params?.opacityThreshold),
    needsParams: true
  },
  {
    type: 'upscale',
    label: 'Upscale 2x',
    apply: applyUpscale
  }
];

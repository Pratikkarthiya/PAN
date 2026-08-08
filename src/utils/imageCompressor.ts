import { CompressionSettings, ProcessedImageResult } from '../types';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function processAndCompressImage(
  imageSource: string | File,
  settings: CompressionSettings,
  outputFilename: string = 'compressed_image.jpg'
): Promise<ProcessedImageResult> {
  let srcUrl: string;
  if (typeof imageSource === 'string') {
    srcUrl = imageSource;
  } else {
    srcUrl = URL.createObjectURL(imageSource);
  }

  const img = await loadImage(srcUrl);
  
  if (typeof imageSource !== 'string') {
    URL.revokeObjectURL(srcUrl);
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  let targetWidth = settings.width;
  let targetHeight = settings.height;

  if (settings.maintainAspectRatio) {
    const ratio = img.width / img.height;
    if (img.width > img.height) {
      targetWidth = settings.width;
      targetHeight = Math.round(settings.width / ratio);
    } else {
      targetHeight = settings.height;
      targetWidth = Math.round(settings.height * ratio);
    }
  }

  // Handle rotation orientation
  const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
  canvas.width = isRotated90or270 ? targetHeight : targetWidth;
  canvas.height = isRotated90or270 ? targetWidth : targetHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not get canvas 2D context');
  }

  // White background (crucial for signatures and photos on PAN cards)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Move context origin to center for rotation
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((settings.rotation * Math.PI) / 180);

  const drawWidth = isRotated90or270 ? targetHeight : targetWidth;
  const drawHeight = isRotated90or270 ? targetWidth : targetHeight;

  ctx.drawImage(
    img,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  ctx.restore();

  // Apply Brightness & Contrast & Threshold adjustments on image pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const b = settings.brightness; // -100 to 100
  const c = settings.contrast;   // -100 to 100
  const factor = (259 * (c + 255)) / (255 * (259 - c));
  const hasThreshold = settings.threshold !== undefined && settings.threshold > 0;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let blue = data[i + 2];

    // Brightness adjustment
    r += (b * 2.55);
    g += (b * 2.55);
    blue += (b * 2.55);

    // Contrast adjustment
    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    blue = factor * (blue - 128) + 128;

    // Threshold for Signature Auto B&W / Clean-up
    if (hasThreshold) {
      const luminance = 0.299 * r + 0.587 * g + 0.114 * blue;
      const t = settings.threshold!;
      if (luminance < t) {
        // Dark ink -> Pure dark/black
        r = 10;
        g = 10;
        blue = 10;
      } else {
        // Paper background -> Pure crisp white
        r = 255;
        g = 255;
        blue = 255;
      }
    } else {
      // Clamp values 0 - 255
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      blue = Math.min(255, Math.max(0, blue));
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = blue;
  }

  ctx.putImageData(imageData, 0, 0);

  // Compression loop to strictly fit under targetSizeKb
  const mimeType = settings.format === 'png' ? 'image/png' : 'image/jpeg';
  const targetBytes = settings.targetSizeKb * 1024;

  let minQ = 0.05;
  let maxQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = settings.quality;

  // Binary search for optimal JPEG quality fit
  if (mimeType === 'image/jpeg') {
    for (let iter = 0; iter < 8; iter++) {
      const q = (minQ + maxQ) / 2;
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), mimeType, q));
      
      if (blob.size <= targetBytes) {
        bestBlob = blob;
        bestQuality = q;
        minQ = q; // try higher quality if still under target
      } else {
        maxQ = q; // reduce quality to hit size target
      }
    }
  }

  // Fallback if binary search didn't complete or format is PNG
  if (!bestBlob) {
    bestBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), mimeType, bestQuality));
  }

  // If still above target size (e.g., PNG or large dimensions), resize canvas smaller automatically
  if (bestBlob.size > targetBytes && mimeType === 'image/jpeg') {
    let scale = 0.9;
    while (bestBlob.size > targetBytes && scale > 0.4) {
      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = Math.round(canvas.width * scale);
      smallCanvas.height = Math.round(canvas.height * scale);
      const sCtx = smallCanvas.getContext('2d');
      if (sCtx) {
        sCtx.fillStyle = '#FFFFFF';
        sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
        sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
        bestBlob = await new Promise((res) => smallCanvas.toBlob((b) => res(b!), mimeType, 0.65));
      }
      scale -= 0.1;
    }
  }

  const dataUrl = URL.createObjectURL(bestBlob);
  const sizeKb = parseFloat((bestBlob.size / 1024).toFixed(2));

  return {
    dataUrl,
    blob: bestBlob,
    sizeKb,
    width: canvas.width,
    height: canvas.height,
    filename: outputFilename
  };
}

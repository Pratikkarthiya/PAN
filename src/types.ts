export type Screen = 
  | 'landing'
  | 'start-compressing'
  | 'photo-tool'
  | 'signature-tool'
  | 'pdf-tool'
  | 'aadhaar-upload'
  | 'camera'
  | 'qr-transfer'
  | 'mobile-upload'
  | 'guidelines'
  | 'faq'
  | 'about'
  | 'terms'
  | 'contact'
  | 'privacy';

export interface ReceivedMobileFile {
  id: string;
  name: string;
  sizeKb: number;
  type: 'image' | 'pdf';
  mimeType: string;
  dataUrl: string;
  timestamp: number;
}

export interface CompressionSettings {
  targetSizeKb: number; // e.g. 50
  width: number;        // e.g. 213
  height: number;       // e.g. 213
  maintainAspectRatio: boolean;
  quality: number;      // 0.1 to 1.0
  format: 'jpeg' | 'png' | 'pdf';
  brightness: number;   // -100 to 100
  contrast: number;     // -100 to 100
  threshold?: number;   // 0 to 255 for signature B&W
  rotation: number;     // 0, 90, 180, 270
}

export interface ProcessedImageResult {
  dataUrl: string;
  blob: Blob;
  sizeKb: number;
  width: number;
  height: number;
  filename: string;
}

export interface PdfPageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  rotation: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

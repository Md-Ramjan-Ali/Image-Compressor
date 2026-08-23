export type PresetMode = 'fast' | 'balanced' | 'high' | 'custom';
export type FormatType = 'jpeg' | 'png' | 'webp';

export interface CompressionConfig {
  mode: PresetMode;
  quality: number; // 0.1 to 1.0
  scale: number;   // 0.1 to 1.0 (Resize resolution)
  format: FormatType;
}

export interface CompressedImageItem {
  id: string;
  originalUri: string;
  filename: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  compressedUri?: string;
  compressedWidth?: number;
  compressedHeight?: number;
  compressedSizeBytes?: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  errorMessage?: string;
  progress: number;
}

export interface CompressionStats {
  totalFiles: number;
  completedFiles: number;
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalBytesSaved: number;
  percentageSaved: number;
}

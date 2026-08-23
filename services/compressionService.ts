import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { CompressionConfig, FormatType } from '../types/compressor';

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getFileSize(uri: string): Promise<number> {
  try {
    // 1. Try FileSystem.getInfoAsync for Native (iOS / Android)
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && !info.isDirectory && typeof info.size === 'number' && info.size > 0) {
      return info.size;
    }
  } catch (error) {
    // Ignore and fallback to fetch
  }

  try {
    // 2. Universal fallback using fetch blob size (works on Web, data URIs, blob URIs, & local files)
    const response = await fetch(uri);
    const blob = await response.blob();
    if (blob && typeof blob.size === 'number' && blob.size > 0) {
      return blob.size;
    }
  } catch (error) {
    console.warn('Error fetching blob file size:', error);
  }

  return 0;
}

export function getSaveFormat(format: FormatType): ImageManipulator.SaveFormat {
  switch (format) {
    case 'png':
      return ImageManipulator.SaveFormat.PNG;
    case 'webp':
      return ImageManipulator.SaveFormat.WEBP;
    case 'jpeg':
    default:
      return ImageManipulator.SaveFormat.JPEG;
  }
}

export async function compressSingleImage(
  uri: string,
  width: number,
  height: number,
  config: CompressionConfig
): Promise<{
  compressedUri: string;
  compressedWidth: number;
  compressedHeight: number;
  compressedSizeBytes: number;
}> {
  const actions: ImageManipulator.Action[] = [];

  // Apply scale if < 1.0
  if (config.scale < 1.0 && width > 0 && height > 0) {
    const newWidth = Math.round(width * config.scale);
    const newHeight = Math.round(height * config.scale);
    actions.push({ resize: { width: newWidth, height: newHeight } });
  }

  const saveFormat = getSaveFormat(config.format);
  const saveOptions: ImageManipulator.SaveOptions = {
    compress: config.quality,
    format: saveFormat,
  };

  const result = await ImageManipulator.manipulateAsync(uri, actions, saveOptions);
  const compressedSizeBytes = await getFileSize(result.uri);

  return {
    compressedUri: result.uri,
    compressedWidth: result.width,
    compressedHeight: result.height,
    compressedSizeBytes,
  };
}

export async function saveToGallery(uri: string): Promise<boolean> {
  try {
    // 1. Try saveToLibraryAsync (Expo Go Android 13/14+ write-only mode)
    if (typeof MediaLibrary.saveToLibraryAsync === 'function') {
      await MediaLibrary.saveToLibraryAsync(uri);
      return true;
    }

    // 2. Try requesting permission if supported
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status === 'granted') {
      await MediaLibrary.createAssetAsync(uri);
      return true;
    }

    // 3. Fallback: Share dialog
    return await shareImage(uri);
  } catch (error) {
    console.warn('MediaLibrary save error, opening share fallback:', error);
    return await shareImage(uri);
  }
}

export async function shareImage(uri: string): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) return false;
    await Sharing.shareAsync(uri);
    return true;
  } catch (error) {
    console.error('Error sharing image:', error);
    return false;
  }
}

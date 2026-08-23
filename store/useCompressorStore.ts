import { create } from 'zustand';
import {
  CompressedImageItem,
  CompressionConfig,
  CompressionStats,
  PresetMode,
} from '../types/compressor';
import { compressSingleImage } from '../services/compressionService';

export const PRESETS: Record<Exclude<PresetMode, 'custom'>, Omit<CompressionConfig, 'mode'>> = {
  fast: { quality: 0.4, scale: 0.6, format: 'jpeg' },
  balanced: { quality: 0.65, scale: 0.85, format: 'jpeg' },
  high: { quality: 0.85, scale: 1.0, format: 'jpeg' },
};

interface CompressorState {
  items: CompressedImageItem[];
  config: CompressionConfig;
  isProcessing: boolean;
  selectedImageForComparison: CompressedImageItem | null;

  // Actions
  addItems: (newItems: Omit<CompressedImageItem, 'status' | 'progress'>[]) => void;
  removeItem: (id: string) => void;
  clearAllItems: () => void;
  setPresetMode: (mode: PresetMode) => void;
  updateConfig: (partial: Partial<CompressionConfig>) => void;
  compressItem: (id: string) => Promise<void>;
  compressAllItems: () => Promise<void>;
  setSelectedImageForComparison: (item: CompressedImageItem | null) => void;
  getStats: () => CompressionStats;
}

export const useCompressorStore = create<CompressorState>((set, get) => ({
  items: [],
  config: {
    mode: 'balanced',
    quality: PRESETS.balanced.quality,
    scale: PRESETS.balanced.scale,
    format: PRESETS.balanced.format,
  },
  isProcessing: false,
  selectedImageForComparison: null,

  addItems: (newItems) => {
    const formattedItems: CompressedImageItem[] = newItems.map((item) => ({
      ...item,
      status: 'pending',
      progress: 0,
    }));

    set((state) => ({
      items: [...state.items, ...formattedItems],
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedImageForComparison:
        state.selectedImageForComparison?.id === id ? null : state.selectedImageForComparison,
    }));
  },

  clearAllItems: () => {
    set({
      items: [],
      selectedImageForComparison: null,
      isProcessing: false,
    });
  },

  setPresetMode: (mode) => {
    if (mode === 'custom') {
      set((state) => ({
        config: { ...state.config, mode: 'custom' },
      }));
    } else {
      const presetValues = PRESETS[mode];
      set({
        config: {
          mode,
          ...presetValues,
        },
      });
    }
  },

  updateConfig: (partial) => {
    set((state) => ({
      config: {
        ...state.config,
        ...partial,
        mode: 'custom',
      },
    }));
  },

  compressItem: async (id) => {
    const { items, config } = get();
    const item = items.find((i) => i.id === id);
    if (!item || item.status === 'compressing') return;

    // Set item compressing
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, status: 'compressing', progress: 30 } : i
      ),
    }));

    try {
      const result = await compressSingleImage(
        item.originalUri,
        item.width,
        item.height,
        config
      );

      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'completed',
                progress: 100,
                compressedUri: result.compressedUri,
                compressedWidth: result.compressedWidth,
                compressedHeight: result.compressedHeight,
                compressedSizeBytes: result.compressedSizeBytes,
              }
            : i
        ),
      }));
    } catch (error: any) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'error',
                progress: 0,
                errorMessage: error?.message || 'Compression failed',
              }
            : i
        ),
      }));
    }
  },

  compressAllItems: async () => {
    const { items, compressItem } = get();
    set({ isProcessing: true });

    for (const item of items) {
      if (item.status !== 'completed') {
        await compressItem(item.id);
      }
    }

    set({ isProcessing: false });
  },

  setSelectedImageForComparison: (item) => {
    set({ selectedImageForComparison: item });
  },

  getStats: () => {
    const { items } = get();
    const totalFiles = items.length;
    const completedItems = items.filter((i) => i.status === 'completed' && i.compressedSizeBytes);
    const completedFiles = completedItems.length;

    let totalOriginalBytes = 0;
    let totalCompressedBytes = 0;

    completedItems.forEach((i) => {
      totalOriginalBytes += i.originalSizeBytes || 0;
      totalCompressedBytes += i.compressedSizeBytes || 0;
    });

    const totalBytesSaved = Math.max(0, totalOriginalBytes - totalCompressedBytes);
    const percentageSaved =
      totalOriginalBytes > 0
        ? Math.round((totalBytesSaved / totalOriginalBytes) * 100)
        : 0;

    return {
      totalFiles,
      completedFiles,
      totalOriginalBytes,
      totalCompressedBytes,
      totalBytesSaved,
      percentageSaved,
    };
  },
}));

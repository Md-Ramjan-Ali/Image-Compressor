import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Eye,
  Download,
  Share2,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { CompressedImageItem } from '../types/compressor';
import { useCompressorStore } from '../store/useCompressorStore';
import { formatBytes, saveToGallery, shareImage } from '../services/compressionService';

interface Props {
  item: CompressedImageItem;
}

export const ImageItemCard: React.FC<Props> = ({ item }) => {
  const removeItem = useCompressorStore((state) => state.removeItem);
  const compressItem = useCompressorStore((state) => state.compressItem);
  const setSelectedImageForComparison = useCompressorStore(
    (state) => state.setSelectedImageForComparison
  );

  const handleSave = async () => {
    if (!item.compressedUri) return;
    const success = await saveToGallery(item.compressedUri);
    if (success) {
      Alert.alert('Success', 'Image saved to photo gallery!');
    } else {
      Alert.alert('Permission Error', 'Could not save image. Permission denied.');
    }
  };

  const handleShare = async () => {
    if (!item.compressedUri) return;
    await shareImage(item.compressedUri);
  };

  const savedBytes =
    item.compressedSizeBytes && item.originalSizeBytes
      ? Math.max(0, item.originalSizeBytes - item.compressedSizeBytes)
      : 0;

  const savedPercent =
    item.originalSizeBytes && savedBytes
      ? Math.round((savedBytes / item.originalSizeBytes) * 100)
      : 0;

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: item.compressedUri || item.originalUri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.infoCol}>
          <Text style={styles.filename} numberOfLines={1}>
            {item.filename}
          </Text>

          <Text style={styles.dimens}>
            {item.width} × {item.height}
          </Text>

          {/* Size Comparison Row */}
          <View style={styles.sizeRow}>
            <Text style={styles.originalSize}>{formatBytes(item.originalSizeBytes)}</Text>
            {item.status === 'completed' && typeof item.compressedSizeBytes === 'number' ? (
              <>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.compressedSize}>
                  {formatBytes(item.compressedSizeBytes)}
                </Text>
                <View style={styles.savingBadge}>
                  <Text style={styles.savingText}>-{savedPercent}%</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
          <X size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Footer Action Bar */}
      <View style={styles.footerRow}>
        {/* Status Indicator */}
        <View style={styles.statusBox}>
          {item.status === 'pending' && (
            <Text style={styles.pendingText}>Ready to compress</Text>
          )}
          {item.status === 'compressing' && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#818CF8" />
              <Text style={styles.compressingText}>Compressing...</Text>
            </View>
          )}
          {item.status === 'completed' && (
            <View style={styles.completedRow}>
              <CheckCircle2 size={16} color="#10B981" />
              <Text style={styles.completedText}>Done</Text>
            </View>
          )}
          {item.status === 'error' && (
            <View style={styles.completedRow}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={styles.errorText}>Failed</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGroup}>
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => compressItem(item.id)}>
              <Play size={14} color="#FFFFFF" />
              <Text style={styles.actionBtnPrimaryText}>Compress</Text>
            </TouchableOpacity>
          )}

          {item.status === 'completed' && (
            <>
              {/* Compare Eye */}
              <TouchableOpacity
                style={styles.actionBtnIcon}
                onPress={() => setSelectedImageForComparison(item)}
              >
                <Eye size={16} color="#CBD5E1" />
              </TouchableOpacity>

              {/* Save */}
              <TouchableOpacity style={styles.actionBtnIcon} onPress={handleSave}>
                <Download size={16} color="#CBD5E1" />
              </TouchableOpacity>

              {/* Share */}
              <TouchableOpacity style={styles.actionBtnIcon} onPress={handleShare}>
                <Share2 size={16} color="#CBD5E1" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#0F172A',
  },
  infoCol: {
    flex: 1,
  },
  filename: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  dimens: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalSize: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  arrow: {
    fontSize: 12,
    color: '#64748B',
  },
  compressedSize: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  savingBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  savingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  removeBtn: {
    padding: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    color: '#64748B',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compressingText: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '600',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
});

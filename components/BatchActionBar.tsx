import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Play, Download, Share2 } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';
import { saveToGallery, shareImage } from '../services/compressionService';

export const BatchActionBar: React.FC = () => {
  const items = useCompressorStore((state) => state.items);
  const isProcessing = useCompressorStore((state) => state.isProcessing);
  const compressAllItems = useCompressorStore((state) => state.compressAllItems);

  if (items.length === 0) return null;

  const pendingItems = items.filter((i) => i.status !== 'completed');
  const completedItems = items.filter((i) => i.status === 'completed' && i.compressedUri);

  const handleSaveAll = async () => {
    if (completedItems.length === 0) return;
    let savedCount = 0;
    for (const item of completedItems) {
      if (item.compressedUri) {
        const ok = await saveToGallery(item.compressedUri);
        if (ok) savedCount++;
      }
    }
    Alert.alert('Saved!', `Saved ${savedCount} image(s) to your photo gallery.`);
  };

  const handleShareAll = async () => {
    if (completedItems.length === 0) return;
    // Share the first or loop
    if (completedItems[0].compressedUri) {
      await shareImage(completedItems[0].compressedUri);
    }
  };

  return (
    <View style={styles.barContainer}>
      {pendingItems.length > 0 ? (
        <TouchableOpacity
          style={[styles.mainBtn, isProcessing && styles.btnDisabled]}
          onPress={compressAllItems}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.mainBtnText}>Compressing Queue...</Text>
            </>
          ) : (
            <>
              <Play size={18} color="#FFFFFF" />
              <Text style={styles.mainBtnText}>
                Compress All ({pendingItems.length})
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.completedGroup}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSaveAll}>
            <Download size={18} color="#10B981" />
            <Text style={styles.secondaryBtnText}>Save All ({completedItems.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={handleShareAll}>
            <Share2 size={18} color="#818CF8" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  mainBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: {
    backgroundColor: '#4338CA',
    opacity: 0.8,
  },
  mainBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#312E81',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { X, Layers, Image as ImageIcon } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';
import { formatBytes } from '../services/compressionService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ComparisonModal: React.FC = () => {
  const selectedItem = useCompressorStore((state) => state.selectedImageForComparison);
  const setSelectedItem = useCompressorStore((state) => state.setSelectedImageForComparison);
  const [activeTab, setActiveTab] = useState<'side' | 'original' | 'compressed'>('side');

  if (!selectedItem) return null;

  const savedBytes =
    selectedItem.compressedSizeBytes && selectedItem.originalSizeBytes
      ? Math.max(0, selectedItem.originalSizeBytes - selectedItem.compressedSizeBytes)
      : 0;

  const savedPercent =
    selectedItem.originalSizeBytes && savedBytes
      ? Math.round((savedBytes / selectedItem.originalSizeBytes) * 100)
      : 0;

  return (
    <Modal visible={true} animationType="slide" transparent={false} onRequestClose={() => setSelectedItem(null)}>
      <SafeAreaView style={styles.container}>
        {/* Modal Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {selectedItem.filename}
            </Text>
            <Text style={styles.subtitle}>
              Saved {formatBytes(savedBytes)} (-{savedPercent}%)
            </Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedItem(null)}>
            <X size={20} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'side' && styles.tabActive]}
            onPress={() => setActiveTab('side')}
          >
            <Layers size={16} color={activeTab === 'side' ? '#818CF8' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'side' && styles.tabTextActive]}>
              Side-by-Side
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'original' && styles.tabActive]}
            onPress={() => setActiveTab('original')}
          >
            <ImageIcon size={16} color={activeTab === 'original' ? '#818CF8' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'original' && styles.tabTextActive]}>
              Original
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'compressed' && styles.tabActive]}
            onPress={() => setActiveTab('compressed')}
          >
            <ImageIcon size={16} color={activeTab === 'compressed' ? '#818CF8' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'compressed' && styles.tabTextActive]}>
              Compressed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preview Content Area */}
        <View style={styles.content}>
          {activeTab === 'side' && (
            <View style={styles.sideBySideRow}>
              {/* Original Side */}
              <View style={styles.previewPane}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeTitle}>ORIGINAL</Text>
                  <Text style={styles.badgeValue}>
                    {formatBytes(selectedItem.originalSizeBytes)}
                  </Text>
                </View>
                <Image
                  source={{ uri: selectedItem.originalUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.dimensTag}>
                  {selectedItem.width} × {selectedItem.height}
                </Text>
              </View>

              {/* Compressed Side */}
              <View style={styles.previewPane}>
                <View style={[styles.badgeRow, styles.badgeRowSuccess]}>
                  <Text style={[styles.badgeTitle, styles.badgeTitleSuccess]}>OPTIMIZED</Text>
                  <Text style={[styles.badgeValue, styles.badgeValueSuccess]}>
                    {formatBytes(selectedItem.compressedSizeBytes || 0)}
                  </Text>
                </View>
                <Image
                  source={{ uri: selectedItem.compressedUri || selectedItem.originalUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.dimensTag}>
                  {selectedItem.compressedWidth || selectedItem.width} ×{' '}
                  {selectedItem.compressedHeight || selectedItem.height}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'original' && (
            <View style={styles.fullPane}>
              <Text style={styles.fullTitle}>Original ({formatBytes(selectedItem.originalSizeBytes)})</Text>
              <Image
                source={{ uri: selectedItem.originalUri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          )}

          {activeTab === 'compressed' && (
            <View style={styles.fullPane}>
              <Text style={[styles.fullTitle, { color: '#10B981' }]}>
                Compressed ({formatBytes(selectedItem.compressedSizeBytes || 0)})
              </Text>
              <Image
                source={{ uri: selectedItem.compressedUri || selectedItem.originalUri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    maxWidth: SCREEN_WIDTH - 80,
  },
  subtitle: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#1E293B',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  tabActive: {
    backgroundColor: '#312E81',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sideBySideRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  previewPane: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#334155',
    marginBottom: 8,
  },
  badgeRowSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  badgeTitleSuccess: {
    color: '#10B981',
  },
  badgeValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  badgeValueSuccess: {
    color: '#10B981',
  },
  image: {
    width: '100%',
    height: '75%',
    borderRadius: 8,
  },
  dimensTag: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
  },
  fullPane: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
  },
  fullImage: {
    width: '100%',
    height: '85%',
    borderRadius: 12,
  },
});

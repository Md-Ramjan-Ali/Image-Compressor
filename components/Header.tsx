import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ImageIcon, Trash2, Zap } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';

export const Header: React.FC = () => {
  const items = useCompressorStore((state) => state.items);
  const clearAllItems = useCompressorStore((state) => state.clearAllItems);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <ImageIcon size={22} color="#6366F1" />
        </View>
        <View>
          <Text style={styles.title}>Compressify</Text>
          <Text style={styles.subtitle}>Ultra-fast Image Optimizer</Text>
        </View>
      </View>

      {items.length > 0 ? (
        <TouchableOpacity style={styles.clearBtn} onPress={clearAllItems}>
          <Trash2 size={16} color="#EF4444" />
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#312E81',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HardDrive, PieChart, CheckCircle } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';
import { formatBytes } from '../services/compressionService';

export const StatsBanner: React.FC = () => {
  const getStats = useCompressorStore((state) => state.getStats);
  const stats = getStats();

  if (stats.totalFiles === 0 || stats.completedFiles === 0) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <HardDrive size={18} color="#10B981" />
        </View>
        <View>
          <Text style={styles.statValue}>{formatBytes(stats.totalBytesSaved)}</Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <PieChart size={18} color="#818CF8" />
        </View>
        <View>
          <Text style={styles.statValue}>-{stats.percentageSaved}%</Text>
          <Text style={styles.statLabel}>Reduction</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <CheckCircle size={18} color="#38BDF8" />
        </View>
        <View>
          <Text style={styles.statValue}>
            {stats.completedFiles}/{stats.totalFiles}
          </Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#312E81',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#312E81',
  },
});

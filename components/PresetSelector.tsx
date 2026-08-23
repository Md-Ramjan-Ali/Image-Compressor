import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Zap, ShieldCheck, Sparkles, Sliders, Check } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';
import { FormatType, PresetMode } from '../types/compressor';

export const PresetSelector: React.FC = () => {
  const config = useCompressorStore((state) => state.config);
  const setPresetMode = useCompressorStore((state) => state.setPresetMode);
  const updateConfig = useCompressorStore((state) => state.updateConfig);

  const presets: { mode: PresetMode; label: string; sub: string; icon: any }[] = [
    { mode: 'fast', label: 'Max Saving', sub: '~75% smaller', icon: Zap },
    { mode: 'balanced', label: 'Balanced', sub: 'Best ratio', icon: ShieldCheck },
    { mode: 'high', label: 'High Quality', sub: 'Crisp detail', icon: Sparkles },
    { mode: 'custom', label: 'Custom', sub: 'Manual control', icon: Sliders },
  ];

  const formats: FormatType[] = ['jpeg', 'png', 'webp'];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Compression Mode</Text>

      {/* Preset Cards */}
      <View style={styles.grid}>
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = config.mode === p.mode;
          return (
            <TouchableOpacity
              key={p.mode}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setPresetMode(p.mode)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Icon size={18} color={isSelected ? '#818CF8' : '#94A3B8'} />
                {isSelected ? <Check size={14} color="#818CF8" /> : null}
              </View>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                {p.label}
              </Text>
              <Text style={styles.cardSub}>{p.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Mode Options */}
      {config.mode === 'custom' ? (
        <View style={styles.customContainer}>
          {/* Quality Options */}
          <View style={styles.customRow}>
            <Text style={styles.customLabel}>
              Quality: <Text style={styles.highlightText}>{Math.round(config.quality * 100)}%</Text>
            </Text>
            <View style={styles.pillGroup}>
              {[0.3, 0.5, 0.7, 0.9].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.pill, config.quality === q && styles.pillSelected]}
                  onPress={() => updateConfig({ quality: q })}
                >
                  <Text style={[styles.pillText, config.quality === q && styles.pillTextSelected]}>
                    {Math.round(q * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scale Resolution Options */}
          <View style={styles.customRow}>
            <Text style={styles.customLabel}>
              Resolution Scale:{' '}
              <Text style={styles.highlightText}>{Math.round(config.scale * 100)}%</Text>
            </Text>
            <View style={styles.pillGroup}>
              {[0.5, 0.75, 1.0].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pill, config.scale === s && styles.pillSelected]}
                  onPress={() => updateConfig({ scale: s })}
                >
                  <Text style={[styles.pillText, config.scale === s && styles.pillTextSelected]}>
                    {Math.round(s * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Format Selector */}
          <View style={styles.customRow}>
            <Text style={styles.customLabel}>Format</Text>
            <View style={styles.pillGroup}>
              {formats.map((fmt) => (
                <TouchableOpacity
                  key={fmt}
                  style={[styles.pill, config.format === fmt && styles.pillSelected]}
                  onPress={() => updateConfig({ format: fmt })}
                >
                  <Text style={[styles.pillText, config.format === fmt && styles.pillTextSelected]}>
                    {fmt.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  cardSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#1E1B4B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  cardLabelSelected: {
    color: '#818CF8',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  customContainer: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  highlightText: {
    color: '#818CF8',
    fontWeight: '700',
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillSelected: {
    backgroundColor: '#4338CA',
    borderColor: '#6366F1',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
});

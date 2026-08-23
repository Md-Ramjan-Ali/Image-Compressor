import React from 'react';
import { StyleSheet, View, FlatList, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './components/Header';
import { ImagePickerArea } from './components/ImagePickerArea';
import { PresetSelector } from './components/PresetSelector';
import { ImageItemCard } from './components/ImageItemCard';
import { StatsBanner } from './components/StatsBanner';
import { BatchActionBar } from './components/BatchActionBar';
import { ComparisonModal } from './components/ComparisonModal';
import { useCompressorStore } from './store/useCompressorStore';

export default function App() {
  const items = useCompressorStore((state) => state.items);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* App Top Bar */}
      <Header />

      {/* Main Content Area */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ImageItemCard item={item} />}
        ListHeaderComponent={
          <>
            <ImagePickerArea />
            <PresetSelector />
            <StatsBanner />
            {items.length > 0 ? (
              <Text style={styles.sectionHeader}>Selected Photos ({items.length})</Text>
            ) : null}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Fixed Bottom Action Bar */}
      <BatchActionBar />

      {/* Visual Comparison Modal */}
      <ComparisonModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

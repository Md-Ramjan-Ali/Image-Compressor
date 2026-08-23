import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UploadCloud, Images } from 'lucide-react-native';
import { useCompressorStore } from '../store/useCompressorStore';
import { getFileSize } from '../services/compressionService';

export const ImagePickerArea: React.FC = () => {
  const addItems = useCompressorStore((state) => state.addItems);
  const itemsCount = useCompressorStore((state) => state.items.length);

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Permission to access photo gallery is required to pick images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newItems = await Promise.all(
          result.assets.map(async (asset) => {
            const size = asset.fileSize || (await getFileSize(asset.uri));
            const filename =
              asset.fileName || asset.uri.split('/').pop() || `Image_${Date.now()}.jpg`;

            return {
              id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              originalUri: asset.uri,
              filename,
              width: asset.width || 0,
              height: asset.height || 0,
              originalSizeBytes: size,
            };
          })
        );

        addItems(newItems);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images from gallery.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.pickerBox}
      onPress={pickImages}
      activeOpacity={0.85}
    >
      <View style={styles.iconCircle}>
        <UploadCloud size={28} color="#818CF8" />
      </View>
      <Text style={styles.mainTitle}>Tap to Select Images</Text>
      <Text style={styles.subText}>Supports Batch Selection (JPG, PNG, WEBP)</Text>

      {itemsCount > 0 ? (
        <View style={styles.badge}>
          <Images size={14} color="#818CF8" />
          <Text style={styles.badgeText}>{itemsCount} Selected</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pickerBox: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 22,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#312E81',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#818CF8',
  },
});

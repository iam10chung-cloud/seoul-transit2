import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RoutePreference } from '../types/api';
import { apiService } from '../services/api';
import { useAccessibility } from '../contexts/AccessibilityContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { profile, voiceGuidanceEnabled, isAccessibilityEnabled } = useAccessibility();
  const [startLat, setStartLat] = useState('37.498095'); // Gangnam Station default
  const [startLng, setStartLng] = useState('127.027610');
  const [destLat, setDestLat] = useState('37.554648'); // Seoul Station default
  const [destLng, setDestLng] = useState('126.970730');
  const [preference, setPreference] = useState<RoutePreference>(RoutePreference.FASTEST);
  const [loading, setLoading] = useState(false);

  const handleFindRoutes = async () => {
    // Validate inputs
    const originLat = parseFloat(startLat);
    const originLng = parseFloat(startLng);
    const destLatNum = parseFloat(destLat);
    const destLngNum = parseFloat(destLng);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLatNum) || isNaN(destLngNum)) {
      Alert.alert('Invalid Input', 'Please enter valid coordinates');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.getRoutes({
        origin: { lat: originLat, lng: originLng },
        destination: { lat: destLatNum, lng: destLngNum },
        preference,
        accessibilityProfile: profile || undefined,
        includeVoiceGuidance: voiceGuidanceEnabled,
      });

      setLoading(false);

      navigation.navigate('Results', {
        routes: response.routes,
        origin: `${originLat}, ${originLng}`,
        destination: `${destLatNum}, ${destLngNum}`,
        realtimeAvailable: response.metadata.realtimeAvailable,
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to fetch routes. Please try again.'
      );
    }
  };

  const handleSwap = () => {
    const tempLat = startLat;
    const tempLng = startLng;
    setStartLat(destLat);
    setStartLng(destLng);
    setDestLat(tempLat);
    setDestLng(tempLng);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Start Location</Text>
        <View style={styles.coordRow}>
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Latitude"
            value={startLat}
            onChangeText={setStartLat}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Longitude"
            value={startLng}
            onChangeText={setStartLng}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapButtonText}>⇅ Swap</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Destination</Text>
        <View style={styles.coordRow}>
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Latitude"
            value={destLat}
            onChangeText={setDestLat}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.coordInput]}
            placeholder="Longitude"
            value={destLng}
            onChangeText={setDestLng}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Route Preference</Text>
        <View style={styles.preferenceContainer}>
          <TouchableOpacity
            style={[
              styles.preferenceButton,
              preference === RoutePreference.FASTEST && styles.preferenceButtonActive,
            ]}
            onPress={() => setPreference(RoutePreference.FASTEST)}
          >
            <Text
              style={[
                styles.preferenceButtonText,
                preference === RoutePreference.FASTEST && styles.preferenceButtonTextActive,
              ]}
            >
              Fastest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.preferenceButton,
              preference === RoutePreference.FEWEST_TRANSFERS && styles.preferenceButtonActive,
            ]}
            onPress={() => setPreference(RoutePreference.FEWEST_TRANSFERS)}
          >
            <Text
              style={[
                styles.preferenceButtonText,
                preference === RoutePreference.FEWEST_TRANSFERS &&
                  styles.preferenceButtonTextActive,
              ]}
            >
              Fewest Transfers
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.findButton, loading && styles.findButtonDisabled]}
          onPress={handleFindRoutes}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.findButtonText}>Find Routes</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tip: Using sample coordinates for Gangnam → Seoul Station
        </Text>
        <Text style={styles.infoText}>Map pin selection coming in next version</Text>
      </View>

      {isAccessibilityEnabled && (
        <View style={styles.accessibilityBanner}>
          <Text style={styles.accessibilityBannerText}>
            ♿ Accessibility Mode: ON
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AccessibilitySettings' as any)}
          >
            <Text style={styles.settingsLink}>Edit Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  coordRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  coordInput: {
    flex: 1,
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  swapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  preferenceContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  preferenceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  preferenceButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  preferenceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  preferenceButtonTextActive: {
    color: '#fff',
  },
  findButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  findButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  findButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
  },
  accessibilityBanner: {
    marginTop: 16,
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0284c7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessibilityBannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369a1',
  },
  settingsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    textDecorationLine: 'underline',
  },
});

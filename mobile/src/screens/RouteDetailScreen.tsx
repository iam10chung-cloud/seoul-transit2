import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LegCard from '../components/LegCard';

type Props = NativeStackScreenProps<RootStackParamList, 'RouteDetail'>;

export default function RouteDetailScreen({ route }: Props) {
  const { route: selectedRoute } = route.params;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Departure</Text>
            <Text style={styles.timeValue}>{formatTime(selectedRoute.departureTime)}</Text>
          </View>
          <View style={styles.durationColumn}>
            <Text style={styles.durationValue}>
              {formatDuration(selectedRoute.totalDuration)}
            </Text>
          </View>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Arrival</Text>
            <Text style={styles.timeValue}>{formatTime(selectedRoute.arrivalTime)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{selectedRoute.transferCount}</Text>
            <Text style={styles.statLabel}>Transfers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatDuration(selectedRoute.walkingTime)}
            </Text>
            <Text style={styles.statLabel}>Walking</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(selectedRoute.totalDistance / 1000).toFixed(1)} km
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>

        <View style={styles.confidenceBar}>
          <View
            style={[
              styles.confidenceFill,
              { width: `${selectedRoute.realtimeConfidence * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.confidenceText}>
          Real-time confidence: {Math.round(selectedRoute.realtimeConfidence * 100)}%
        </Text>
      </View>

      <View style={styles.legsContainer}>
        <Text style={styles.sectionTitle}>Step-by-Step Directions</Text>
        {selectedRoute.legs.map((leg, index) => (
          <LegCard
            key={index}
            leg={leg}
            index={index}
            isLast={index === selectedRoute.legs.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeColumn: {
    alignItems: 'center',
  },
  durationColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  durationValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  legsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
});

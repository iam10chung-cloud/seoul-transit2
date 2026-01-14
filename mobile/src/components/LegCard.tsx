import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteLeg } from '../types/api';

interface LegCardProps {
  leg: RouteLeg;
  index: number;
  isLast: boolean;
}

export default function LegCard({ leg, index, isLast }: LegCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getModeIcon = () => {
    switch (leg.mode) {
      case 'WALK':
        return '🚶';
      case 'BUS':
        return '🚌';
      case 'SUBWAY':
        return '🚇';
      default:
        return '📍';
    }
  };

  const getModeColor = () => {
    switch (leg.mode) {
      case 'WALK':
        return '#6b7280';
      case 'BUS':
        return '#10b981';
      case 'SUBWAY':
        return '#2563eb';
      default:
        return '#374151';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        <View style={[styles.iconCircle, { backgroundColor: getModeColor() }]}>
          <Text style={styles.iconText}>{getModeIcon()}</Text>
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.modeText}>{leg.mode}</Text>
          <Text style={styles.durationText}>{formatDuration(leg.duration)}</Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>From:</Text>
          <Text style={styles.locationText}>{leg.from.name}</Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>To:</Text>
          <Text style={styles.locationText}>{leg.to.name}</Text>
        </View>

        {leg.routeName && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeName}>{leg.routeName}</Text>
            {leg.stopCount && (
              <Text style={styles.stopCount}>({leg.stopCount} stops)</Text>
            )}
          </View>
        )}

        <Text style={styles.instructions}>{leg.instructions}</Text>

        <View style={styles.footer}>
          <Text style={styles.distance}>{formatDistance(leg.distance)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeline: {
    width: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconText: {
    fontSize: 20,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#d1d5db',
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6b7280',
    width: 40,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  routeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
  stopCount: {
    fontSize: 11,
    color: '#60a5fa',
    marginLeft: 6,
  },
  instructions: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  distance: {
    fontSize: 11,
    color: '#6b7280',
  },
});

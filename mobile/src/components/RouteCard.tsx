import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Route } from '../types/api';

interface RouteCardProps {
  route: Route;
  index: number;
}

export default function RouteCard({ route, index }: RouteCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModeSummary = () => {
    const modeMap = new Map<string, number>();
    route.legs.forEach((leg) => {
      const current = modeMap.get(leg.mode) || 0;
      modeMap.set(leg.mode, current + leg.duration);
    });

    return Array.from(modeMap.entries())
      .map(([mode, duration]) => {
        const icon = mode === 'WALK' ? '🚶' : mode === 'BUS' ? '🚌' : '🚇';
        return `${icon} ${formatDuration(duration)}`;
      })
      .join(' + ');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.routeNumber}>Route {index + 1}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {Math.round(route.realtimeConfidence * 100)}% confidence
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.mainTime}>{formatDuration(route.totalDuration)}</Text>
        <Text style={styles.timeDetail}>
          {formatTime(route.departureTime)} → {formatTime(route.arrivalTime)}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{route.transferCount}</Text>
          <Text style={styles.detailLabel}>Transfers</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{formatDuration(route.walkingTime)}</Text>
          <Text style={styles.detailLabel}>Walking</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>
            {(route.totalDistance / 1000).toFixed(1)} km
          </Text>
          <Text style={styles.detailLabel}>Distance</Text>
        </View>
      </View>

      <View style={styles.modeSummary}>
        <Text style={styles.modeSummaryText}>{getModeSummary()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  badge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065f46',
  },
  timeRow: {
    marginBottom: 12,
  },
  mainTime: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  timeDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  modeSummary: {
    marginTop: 12,
  },
  modeSummaryText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Route, AccessibleRoute } from '../types/api';

interface RouteCardProps {
  route: Route | AccessibleRoute;
  index: number;
}

function isAccessibleRoute(route: Route | AccessibleRoute): route is AccessibleRoute {
  return 'accessibilityScore' in route;
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

  const renderAccessibilityBadge = () => {
    if (!isAccessibleRoute(route)) return null;

    const score = route.accessibilityScore.overall;
    const getBadgeColor = (score: number) => {
      if (score >= 90) return '#10b981'; // Green
      if (score >= 75) return '#3b82f6'; // Blue
      if (score >= 60) return '#f59e0b'; // Orange
      return '#ef4444'; // Red
    };

    const getBadgeText = (score: number) => {
      if (score >= 90) return 'Excellent';
      if (score >= 75) return 'Good';
      if (score >= 60) return 'Fair';
      return 'Limited';
    };

    return (
      <View style={[styles.accessibilityBadge, { backgroundColor: getBadgeColor(score) }]}>
        <Text style={styles.accessibilityBadgeText}>♿ {score}</Text>
      </View>
    );
  };

  const renderAccessibilityWarnings = () => {
    if (!isAccessibleRoute(route) || route.accessibilityWarnings.length === 0) return null;

    return (
      <View style={styles.warningsContainer}>
        {route.accessibilityWarnings.slice(0, 2).map((warning, idx) => (
          <Text key={idx} style={styles.warningText}>
            {warning}
          </Text>
        ))}
        {route.accessibilityWarnings.length > 2 && (
          <Text style={styles.moreWarnings}>
            +{route.accessibilityWarnings.length - 2} more warnings
          </Text>
        )}
      </View>
    );
  };

  const renderAccessibilityDetails = () => {
    if (!isAccessibleRoute(route)) return null;

    const { details } = route.accessibilityScore;
    const features = [];

    if (details.stepFree) features.push({ icon: '♿', label: 'Step-free' });
    if (details.elevatorsWorking) features.push({ icon: '🛗', label: 'Elevators OK' });
    if (details.audioSupport) features.push({ icon: '🔊', label: 'Audio' });
    if (details.visualSupport) features.push({ icon: '📺', label: 'Visual' });
    if (details.cognitiveSupport) features.push({ icon: '🧠', label: 'Simple' });

    if (features.length === 0) return null;

    return (
      <View style={styles.accessibilityFeatures}>
        {features.map((feature, idx) => (
          <View key={idx} style={styles.featureBadge}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.routeNumber}>Route {index + 1}</Text>
        <View style={styles.badgeContainer}>
          {renderAccessibilityBadge()}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Math.round(route.realtimeConfidence * 100)}% confidence
            </Text>
          </View>
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

      {renderAccessibilityDetails()}
      {renderAccessibilityWarnings()}
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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  accessibilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  accessibilityBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
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
  accessibilityFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  warningsContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    marginBottom: 4,
  },
  moreWarnings: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
    marginTop: 2,
  },
});

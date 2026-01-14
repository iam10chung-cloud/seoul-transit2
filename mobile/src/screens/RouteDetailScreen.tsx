import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LegCard from '../components/LegCard';
import { AccessibleRoute } from '../types/api';
import { ttsService } from '../services/tts';
import { useAccessibility } from '../contexts/AccessibilityContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RouteDetail'>;

function isAccessibleRoute(route: any): route is AccessibleRoute {
  return 'accessibilityScore' in route;
}

export default function RouteDetailScreen({ route }: Props) {
  const { route: selectedRoute } = route.params;
  const { voiceGuidanceEnabled } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handlePlayVoiceGuidance = async () => {
    if (!isAccessibleRoute(selectedRoute) || !selectedRoute.voiceGuidance) {
      Alert.alert(
        'Voice Guidance Not Available',
        'This route does not have voice guidance information.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);

      // Announce route summary
      const summary = ttsService.generateRouteSummary(selectedRoute);
      await ttsService.speak(summary);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Announce accessibility info
      if (selectedRoute.accessibilityScore) {
        const accessibilityInfo = ttsService.generateAccessibilityAnnouncement(
          selectedRoute.accessibilityScore
        );
        await ttsService.speak(accessibilityInfo);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Announce warnings
      if (selectedRoute.accessibilityWarnings?.length > 0) {
        const warnings = ttsService.generateWarningsAnnouncement(
          selectedRoute.accessibilityWarnings
        );
        await ttsService.speak(warnings);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Speak guidance instructions
      await ttsService.speakGuidance(selectedRoute.voiceGuidance);

      setIsSpeaking(false);
    } catch (error) {
      console.error('Error playing voice guidance:', error);
      setIsSpeaking(false);
      Alert.alert('Error', 'Failed to play voice guidance.', [{ text: 'OK' }]);
    }
  };

  const renderAccessibilityInfo = () => {
    if (!isAccessibleRoute(selectedRoute)) return null;

    const { accessibilityScore, accessibilityWarnings } = selectedRoute;

    return (
      <View style={styles.accessibilitySection}>
        <Text style={styles.sectionTitle}>♿ Accessibility Information</Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{accessibilityScore.overall}</Text>
              <Text style={styles.scoreLabel}>Overall</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{accessibilityScore.wheelchair}</Text>
              <Text style={styles.scoreLabel}>Wheelchair</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{accessibilityScore.visualImpairment}</Text>
              <Text style={styles.scoreLabel}>Visual</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{accessibilityScore.hearingImpairment}</Text>
              <Text style={styles.scoreLabel}>Hearing</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{accessibilityScore.cognitive}</Text>
              <Text style={styles.scoreLabel}>Cognitive</Text>
            </View>
          </View>

          <View style={styles.featuresGrid}>
            {accessibilityScore.details.stepFree && (
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>♿ Step-free</Text>
              </View>
            )}
            {accessibilityScore.details.elevatorsWorking && (
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>🛗 Elevators OK</Text>
              </View>
            )}
            {accessibilityScore.details.audioSupport && (
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>🔊 Audio Support</Text>
              </View>
            )}
            {accessibilityScore.details.visualSupport && (
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>📺 Visual Support</Text>
              </View>
            )}
            {accessibilityScore.details.cognitiveSupport && (
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>🧠 Simple Route</Text>
              </View>
            )}
          </View>
        </View>

        {accessibilityWarnings.length > 0 && (
          <View style={styles.warningsCard}>
            <Text style={styles.warningsTitle}>⚠️ Warnings</Text>
            {accessibilityWarnings.map((warning, idx) => (
              <Text key={idx} style={styles.warningItem}>
                • {warning}
              </Text>
            ))}
          </View>
        )}

        {voiceGuidanceEnabled && selectedRoute.voiceGuidance && (
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isSpeaking && styles.voiceButtonActive,
            ]}
            onPress={handlePlayVoiceGuidance}
          >
            <Text style={styles.voiceButtonText}>
              {isSpeaking ? '⏸️ Stop Voice Guidance' : '🔊 Play Voice Guidance'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
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

      {renderAccessibilityInfo()}

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
  accessibilitySection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  scoreCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  warningsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  warningsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  warningItem: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
  },
  voiceButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#dc2626',
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  legsContainer: {
    padding: 16,
  },
});

import {
  StationAccessibility,
  AccessibilityScore,
  AccessibilityType,
  UserAccessibilityProfile,
  ElevatorStatus,
  VoiceGuidanceInstruction,
  Route,
  AccessibleRoute,
  RouteLeg,
} from '../types/api';
import accessibilityData from '../data/accessibility.json';

export class AccessibilityService {
  private accessibilityMap: Map<string, StationAccessibility>;

  constructor() {
    this.accessibilityMap = new Map();
    this.loadAccessibilityData();
  }

  private loadAccessibilityData(): void {
    accessibilityData.forEach((data) => {
      this.accessibilityMap.set(data.stationId, data as StationAccessibility);
    });
  }

  /**
   * Get accessibility features for a station
   */
  getStationAccessibility(stationId: string): StationAccessibility | undefined {
    return this.accessibilityMap.get(stationId);
  }

  /**
   * Calculate accessibility score for a route
   */
  calculateAccessibilityScore(
    route: Route,
    profile?: UserAccessibilityProfile
  ): AccessibilityScore {
    const stationsInRoute = this.extractStationsFromRoute(route);
    const accessibilityFeatures = stationsInRoute
      .map((id) => this.accessibilityMap.get(id))
      .filter((f) => f !== undefined) as StationAccessibility[];

    // Calculate scores (0-100)
    const wheelchairScore = this.calculateWheelchairScore(accessibilityFeatures);
    const visualScore = this.calculateVisualScore(accessibilityFeatures);
    const hearingScore = this.calculateHearingScore(accessibilityFeatures);
    const cognitiveScore = this.calculateCognitiveScore(route, accessibilityFeatures);

    // Weight scores based on user profile
    let weights = { wheelchair: 1, visual: 1, hearing: 1, cognitive: 1 };
    if (profile?.accessibilityTypes) {
      weights = {
        wheelchair: profile.accessibilityTypes.includes(AccessibilityType.WHEELCHAIR) ? 3 : 1,
        visual: profile.accessibilityTypes.includes(AccessibilityType.VISUAL_IMPAIRMENT) ? 3 : 1,
        hearing: profile.accessibilityTypes.includes(AccessibilityType.HEARING_IMPAIRMENT) ? 3 : 1,
        cognitive: profile.accessibilityTypes.includes(AccessibilityType.COGNITIVE) ? 3 : 1,
      };
    }

    const totalWeight = weights.wheelchair + weights.visual + weights.hearing + weights.cognitive;
    const overall =
      (wheelchairScore * weights.wheelchair +
        visualScore * weights.visual +
        hearingScore * weights.hearing +
        cognitiveScore * weights.cognitive) /
      totalWeight;

    // Check step-free route
    const stepFree = accessibilityFeatures.every((f) => f.stepCount === 0);
    const elevatorsWorking = accessibilityFeatures.every(
      (f) => !f.elevatorAvailable || f.elevatorStatus === ElevatorStatus.WORKING
    );
    const tactileGuidance = accessibilityFeatures.every((f) => f.tactilePaving);
    const audioSupport = accessibilityFeatures.every((f) => f.audioAnnouncements);
    const visualSupport = accessibilityFeatures.every((f) => f.visualDisplays);

    return {
      overall: Math.round(overall),
      wheelchair: Math.round(wheelchairScore),
      visualImpairment: Math.round(visualScore),
      hearingImpairment: Math.round(hearingScore),
      cognitive: Math.round(cognitiveScore),
      details: {
        stepFree,
        elevatorsWorking,
        lowFloorBusesAvailable: true, // TODO: Implement bus checking
        tactileGuidance,
        audioSupport,
        visualSupport,
        cognitiveSupport: route.transferCount <= 2,
      },
    };
  }

  private calculateWheelchairScore(features: StationAccessibility[]): number {
    if (features.length === 0) return 100;

    let score = 100;
    features.forEach((f) => {
      if (!f.wheelchairAccessible) score -= 50;
      if (!f.elevatorAvailable) score -= 30;
      if (f.elevatorStatus !== ElevatorStatus.WORKING) score -= 20;
      if (f.stepCount > 0) score -= Math.min(30, f.stepCount);
      if (f.platformGapWidth > 10) score -= 10;
      if (!f.wheelchairRamps) score -= 15;
      if (!f.wideGates) score -= 10;
    });

    return Math.max(0, score / features.length);
  }

  private calculateVisualScore(features: StationAccessibility[]): number {
    if (features.length === 0) return 100;

    let score = 100;
    features.forEach((f) => {
      if (!f.tactilePaving) score -= 30;
      if (!f.brailleSignage) score -= 20;
      if (!f.audioAnnouncements) score -= 30;
      if (!f.assistanceButtonAvailable) score -= 10;
    });

    return Math.max(0, score / features.length);
  }

  private calculateHearingScore(features: StationAccessibility[]): number {
    if (features.length === 0) return 100;

    let score = 100;
    features.forEach((f) => {
      if (!f.visualDisplays) score -= 40;
      if (!f.inductionLoop) score -= 20;
    });

    return Math.max(0, score / features.length);
  }

  private calculateCognitiveScore(route: Route, features: StationAccessibility[]): number {
    let score = 100;

    // Penalize complex routes
    if (route.transferCount > 2) score -= 30;
    if (route.transferCount > 3) score -= 20;

    // Penalize long walking times
    if (route.walkingTime > 600) score -= 20; // More than 10 minutes

    // Reward consistent features
    if (features.length === 0) return score;

    const hasAudio = features.every((f) => f.audioAnnouncements);
    const hasVisual = features.every((f) => f.visualDisplays);
    const hasAssistance = features.every((f) => f.staffAssistanceAvailable);

    if (hasAudio && hasVisual) score += 10;
    if (hasAssistance) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate voice guidance instructions for a route
   */
  generateVoiceGuidance(route: Route): VoiceGuidanceInstruction[] {
    const instructions: VoiceGuidanceInstruction[] = [];
    let totalDistance = 0;

    route.legs.forEach((leg, index) => {
      // Start instruction
      instructions.push({
        id: `${route.id}-${index}-start`,
        distance: totalDistance,
        direction: 'START',
        landmark: leg.from.name,
        instruction: this.getStartInstruction(leg, index === 0),
        hapticPattern: 'short',
      });

      // During transit instruction
      if (leg.mode === 'SUBWAY' || leg.mode === 'BUS') {
        instructions.push({
          id: `${route.id}-${index}-transit`,
          distance: totalDistance + leg.distance / 2,
          direction: 'CONTINUE',
          landmark: leg.routeName || leg.mode,
          instruction: this.getTransitInstruction(leg),
          hapticPattern: 'none',
        });
      }

      // End/arrival instruction
      totalDistance += leg.distance;
      instructions.push({
        id: `${route.id}-${index}-end`,
        distance: totalDistance,
        direction: 'ARRIVE',
        landmark: leg.to.name,
        instruction: this.getArrivalInstruction(leg, index === route.legs.length - 1),
        hapticPattern: 'long',
      });
    });

    return instructions;
  }

  private getStartInstruction(leg: RouteLeg, isFirst: boolean): string {
    const mode = leg.mode === 'SUBWAY' ? '지하철' : leg.mode === 'BUS' ? '버스' : '도보';
    const prefix = isFirst ? '출발지에서' : '환승하여';

    if (leg.mode === 'WALK') {
      return `${prefix} ${leg.to.name} 방향으로 ${Math.round(leg.distance)}미터 걸어가세요.`;
    }

    return `${prefix} ${leg.routeName || mode}를 타고 ${leg.to.name}로 가세요.`;
  }

  private getTransitInstruction(leg: RouteLeg): string {
    const stopCount = leg.stopCount || 1;
    const mode = leg.mode === 'SUBWAY' ? '정거장' : '정류장';
    return `${stopCount}개 ${mode}을 지나갑니다. ${leg.to.name}에서 내리세요.`;
  }

  private getArrivalInstruction(leg: RouteLeg, isFinal: boolean): string {
    if (isFinal) {
      return `목적지 ${leg.to.name}에 도착했습니다.`;
    }
    return `${leg.to.name}에 도착했습니다. 환승을 준비하세요.`;
  }

  /**
   * Check if route meets accessibility requirements
   */
  isRouteAccessible(route: Route, profile: UserAccessibilityProfile): boolean {
    if (!profile.preferences) return true;

    const stationsInRoute = this.extractStationsFromRoute(route);
    const accessibilityFeatures = stationsInRoute
      .map((id) => this.accessibilityMap.get(id))
      .filter((f) => f !== undefined) as StationAccessibility[];

    // Check stairs/elevator requirement
    if (profile.preferences.avoidStairs || profile.preferences.requireElevator) {
      const hasStairs = accessibilityFeatures.some((f) => f.stepCount > 0);
      if (hasStairs) return false;

      const elevatorsWorking = accessibilityFeatures.every(
        (f) => !f.elevatorAvailable || f.elevatorStatus === ElevatorStatus.WORKING
      );
      if (!elevatorsWorking) return false;
    }

    // Check transfer limits
    if (profile.preferences.maxTransfers !== undefined) {
      if (route.transferCount > profile.preferences.maxTransfers) return false;
    }

    // Check walking distance
    if (profile.preferences.maxWalkingDistance !== undefined) {
      const totalWalkingDistance = route.legs
        .filter((leg) => leg.mode === 'WALK')
        .reduce((sum, leg) => sum + leg.distance, 0);
      if (totalWalkingDistance > profile.preferences.maxWalkingDistance) return false;
    }

    return true;
  }

  /**
   * Get accessibility warnings for a route
   */
  getAccessibilityWarnings(route: Route, profile?: UserAccessibilityProfile): string[] {
    const warnings: string[] = [];
    const stationsInRoute = this.extractStationsFromRoute(route);
    const accessibilityFeatures = stationsInRoute
      .map((id) => this.accessibilityMap.get(id))
      .filter((f) => f !== undefined) as StationAccessibility[];

    accessibilityFeatures.forEach((f) => {
      if (f.elevatorStatus === ElevatorStatus.OUTAGE) {
        warnings.push(`⚠️ ${f.stationId}: 엘리베이터 고장 (Elevator out of service)`);
      }
      if (f.elevatorStatus === ElevatorStatus.MAINTENANCE) {
        warnings.push(`🔧 ${f.stationId}: 엘리베이터 점검 중 (Elevator under maintenance)`);
      }
      if (!f.wheelchairAccessible && profile?.preferences.avoidStairs) {
        warnings.push(`♿ ${f.stationId}: 휠체어 접근 불가 (Not wheelchair accessible)`);
      }
      if (f.stepCount > 20) {
        warnings.push(`🚶 ${f.stationId}: 계단 ${f.stepCount}개 (${f.stepCount} steps)`);
      }
      if (!f.accessibleRestroom) {
        warnings.push(`🚻 ${f.stationId}: 장애인 화장실 없음 (No accessible restroom)`);
      }
    });

    return warnings;
  }

  /**
   * Convert regular route to accessible route
   */
  enhanceRouteWithAccessibility(
    route: Route,
    profile?: UserAccessibilityProfile,
    includeVoiceGuidance = false
  ): AccessibleRoute {
    const accessibilityScore = this.calculateAccessibilityScore(route, profile);
    const accessibilityWarnings = this.getAccessibilityWarnings(route, profile);
    const voiceGuidance = includeVoiceGuidance ? this.generateVoiceGuidance(route) : [];

    return {
      ...route,
      accessibilityScore,
      accessibilityWarnings,
      voiceGuidance,
      practiceMode: {
        available: false, // TODO: Implement practice mode
      },
    };
  }

  /**
   * Extract station IDs from route legs
   */
  private extractStationsFromRoute(route: Route): string[] {
    const stationIds: string[] = [];

    route.legs.forEach((leg) => {
      if (leg.mode === 'SUBWAY' && leg.from.stopId) {
        stationIds.push(leg.from.stopId);
      }
      if (leg.mode === 'SUBWAY' && leg.to.stopId) {
        stationIds.push(leg.to.stopId);
      }
    });

    return [...new Set(stationIds)]; // Remove duplicates
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService();

// API Types (matching server types)

export interface Coordinate {
  lat: number;
  lng: number;
}

export enum RoutePreference {
  FASTEST = 'FASTEST',
  FEWEST_TRANSFERS = 'FEWEST_TRANSFERS',
}

export interface RoutesRequest {
  origin: Coordinate;
  destination: Coordinate;
  preference?: RoutePreference;
  departure_time_iso?: string;
}

export type TransitMode = 'WALK' | 'BUS' | 'SUBWAY';

export interface Location {
  name: string;
  lat: number;
  lng: number;
  stopId?: string;
}

export interface RouteLeg {
  mode: TransitMode;
  from: Location;
  to: Location;
  duration: number;
  distance: number;
  instructions: string;
  routeId?: string;
  routeName?: string;
  stopCount?: number;
}

export interface Route {
  id: string;
  totalDuration: number;
  totalDistance: number;
  transferCount: number;
  walkingTime: number;
  departureTime: string;
  arrivalTime: string;
  realtimeConfidence: number;
  legs: RouteLeg[];
}

export interface RoutesResponse {
  routes: Route[];
  metadata: {
    requestTime: string;
    preference: RoutePreference;
    realtimeAvailable: boolean;
    fallbackMode: boolean;
  };
}

export interface HealthResponse {
  ok: boolean;
  time: string;
  service: string;
  version: string;
}

// ==========================================
// ACCESSIBILITY FEATURES
// ==========================================

export enum AccessibilityType {
  WHEELCHAIR = 'WHEELCHAIR',
  VISUAL_IMPAIRMENT = 'VISUAL_IMPAIRMENT',
  HEARING_IMPAIRMENT = 'HEARING_IMPAIRMENT',
  COGNITIVE = 'COGNITIVE',
  ELDERLY = 'ELDERLY',
}

export enum ElevatorStatus {
  WORKING = 'WORKING',
  OUTAGE = 'OUTAGE',
  MAINTENANCE = 'MAINTENANCE',
  UNKNOWN = 'UNKNOWN',
}

export interface StationAccessibility {
  stationId: string;
  wheelchairAccessible: boolean;
  elevatorAvailable: boolean;
  elevatorStatus: ElevatorStatus;
  elevatorCount: number;
  escalatorAvailable: boolean;
  stepCount: number;
  platformGapWidth: number;
  platformGapHeight: number;
  accessibleRestroom: boolean;
  tactilePaving: boolean;
  brailleSignage: boolean;
  audioAnnouncements: boolean;
  visualDisplays: boolean;
  inductionLoop: boolean;
  wheelchairRamps: boolean;
  wideGates: boolean;
  assistanceButtonAvailable: boolean;
  staffAssistanceAvailable: boolean;
  lastUpdated: string;
}

export interface AccessibilityScore {
  overall: number;
  wheelchair: number;
  visualImpairment: number;
  hearingImpairment: number;
  cognitive: number;
  details: {
    stepFree: boolean;
    elevatorsWorking: boolean;
    lowFloorBusesAvailable: boolean;
    tactileGuidance: boolean;
    audioSupport: boolean;
    visualSupport: boolean;
    cognitiveSupport: boolean;
  };
}

export interface UserAccessibilityProfile {
  userId?: string;
  accessibilityTypes: AccessibilityType[];
  preferences: {
    avoidStairs: boolean;
    requireElevator: boolean;
    requireLowFloorBus: boolean;
    requireAudioGuidance: boolean;
    requireVisualGuidance: boolean;
    requireSimpleRoutes: boolean;
    extraTransferTime: number;
    maxWalkingDistance: number;
    maxTransfers: number;
  };
  assistanceNeeds: {
    companionAlert: boolean;
    companionPhone?: string;
    practiceMode: boolean;
  };
}

export interface VoiceGuidanceInstruction {
  id: string;
  distance: number;
  direction: string;
  landmark: string;
  instruction: string;
  audioUrl?: string;
  hapticPattern?: string;
}

export interface AccessibleRoute extends Route {
  accessibilityScore: AccessibilityScore;
  accessibilityWarnings: string[];
  voiceGuidance: VoiceGuidanceInstruction[];
  stepByStepImages?: string[];
  practiceMode?: {
    available: boolean;
    videoUrl?: string;
  };
}

export interface AccessibleRoutesRequest extends RoutesRequest {
  accessibilityProfile?: UserAccessibilityProfile;
  includeVoiceGuidance?: boolean;
  includePracticeMode?: boolean;
}

export interface AccessibleRoutesResponse {
  routes: AccessibleRoute[];
  metadata: {
    requestTime: string;
    preference: RoutePreference;
    realtimeAvailable: boolean;
    fallbackMode: boolean;
    accessibilityFilterApplied: boolean;
    filteredRoutesCount: number;
  };
}

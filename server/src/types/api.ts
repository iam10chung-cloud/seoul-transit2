// API Request/Response Types

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
  duration: number; // seconds
  distance: number; // meters
  instructions: string;
  routeId?: string;
  routeName?: string;
  stopCount?: number;
}

export interface Route {
  id: string;
  totalDuration: number; // seconds
  totalDistance: number; // meters
  transferCount: number;
  walkingTime: number; // seconds
  departureTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
  realtimeConfidence: number; // 0.0 to 1.0
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

export interface RealtimeStatusResponse {
  ok: boolean;
  upstreamApis: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down' | 'not_configured';
      lastFetch?: string;
      message?: string;
    };
  };
  cache: {
    redis: {
      status: 'healthy' | 'degraded' | 'down' | 'not_configured';
      message?: string;
    };
  };
  timestamp: string;
}

// ==========================================
// ACCESSIBILITY FEATURES
// ==========================================

// Accessibility Types
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

// Station Accessibility Features
export interface StationAccessibility {
  stationId: string;
  wheelchairAccessible: boolean;
  elevatorAvailable: boolean;
  elevatorStatus: ElevatorStatus;
  elevatorCount: number;
  escalatorAvailable: boolean;
  stepCount: number; // Steps from street to platform
  platformGapWidth: number; // cm
  platformGapHeight: number; // cm
  accessibleRestroom: boolean;
  tactilePaving: boolean; // For visually impaired
  brailleSignage: boolean;
  audioAnnouncements: boolean;
  visualDisplays: boolean;
  inductionLoop: boolean; // For hearing aids
  wheelchairRamps: boolean;
  wideGates: boolean;
  assistanceButtonAvailable: boolean;
  staffAssistanceAvailable: boolean;
  lastUpdated: string; // ISO 8601
}

// Bus Accessibility Features
export interface BusAccessibility {
  busId: string;
  routeId: string;
  lowFloor: boolean; // 저상버스
  wheelchairRamp: boolean;
  wheelchairSpace: number;
  audioAnnouncements: boolean;
  visualDisplays: boolean;
  kneeling: boolean; // Bus can lower for easier boarding
}

// Route Accessibility Score
export interface AccessibilityScore {
  overall: number; // 0-100
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

// User Accessibility Profile
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
    extraTransferTime: number; // minutes
    maxWalkingDistance: number; // meters
    maxTransfers: number;
  };
  assistanceNeeds: {
    companionAlert: boolean;
    companionPhone?: string;
    practiceMode: boolean;
  };
}

// Voice Guidance
export interface VoiceGuidanceInstruction {
  id: string;
  distance: number; // meters
  direction: string;
  landmark: string;
  instruction: string;
  audioUrl?: string;
  hapticPattern?: string; // For vibration feedback
}

// Enhanced Route with Accessibility
export interface AccessibleRoute extends Route {
  accessibilityScore: AccessibilityScore;
  accessibilityWarnings: string[];
  voiceGuidance: VoiceGuidanceInstruction[];
  stepByStepImages?: string[]; // URLs to station photos
  practiceMode?: {
    available: boolean;
    videoUrl?: string;
  };
}

// Accessibility Request Extension
export interface AccessibleRoutesRequest extends RoutesRequest {
  accessibilityProfile?: UserAccessibilityProfile;
  includeVoiceGuidance?: boolean;
  includePracticeMode?: boolean;
}

// Accessibility Response
export interface AccessibleRoutesResponse {
  routes: AccessibleRoute[];
  metadata: {
    requestTime: string;
    preference: RoutePreference;
    realtimeAvailable: boolean;
    fallbackMode: boolean;
    accessibilityFilterApplied: boolean;
    filteredRoutesCount: number; // How many routes were filtered out
  };
}

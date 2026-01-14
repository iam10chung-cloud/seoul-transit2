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

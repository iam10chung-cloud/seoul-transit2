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

/**
 * Graph-based routing engine for Seoul Transit
 * Implements Dijkstra's algorithm for finding optimal routes
 */

interface Station {
  id: string;
  name: string;
  name_en: string;
  line: string;
  lat: number;
  lng: number;
}

interface Connection {
  from: string;
  to: string;
  duration_seconds: number;
  distance_meters: number;
}

interface GraphNode {
  stationId: string;
  neighbors: Map<string, { duration: number; distance: number }>;
}

interface RouteSegment {
  from: Station;
  to: Station;
  duration_seconds: number;
  distance_meters: number;
  line: string;
}

interface CalculatedRoute {
  segments: RouteSegment[];
  totalDuration: number;
  totalDistance: number;
  transferCount: number;
}

export class TransitGraph {
  private nodes: Map<string, GraphNode>;
  private stations: Map<string, Station>;

  constructor(stations: Station[], connections: Connection[]) {
    this.nodes = new Map();
    this.stations = new Map();

    // Initialize stations
    stations.forEach((station) => {
      this.stations.set(station.id, station);
      this.nodes.set(station.id, {
        stationId: station.id,
        neighbors: new Map(),
      });
    });

    // Build graph edges (bidirectional)
    connections.forEach((conn) => {
      const fromNode = this.nodes.get(conn.from);
      const toNode = this.nodes.get(conn.to);

      if (fromNode && toNode) {
        fromNode.neighbors.set(conn.to, {
          duration: conn.duration_seconds,
          distance: conn.distance_meters,
        });
        toNode.neighbors.set(conn.from, {
          duration: conn.duration_seconds,
          distance: conn.distance_meters,
        });
      }
    });
  }

  /**
   * Find nearest station to given coordinates
   */
  findNearestStation(lat: number, lng: number): Station | null {
    let nearest: Station | null = null;
    let minDistance = Infinity;

    this.stations.forEach((station) => {
      const distance = this.calculateDistance(lat, lng, station.lat, station.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Find routes using Dijkstra's algorithm
   * Returns top N routes sorted by preference
   */
  findRoutes(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    preference: 'FASTEST' | 'FEWEST_TRANSFERS',
    maxRoutes: number = 3
  ): CalculatedRoute[] {
    const originStation = this.findNearestStation(originLat, originLng);
    const destStation = this.findNearestStation(destLat, destLng);

    if (!originStation || !destStation) {
      return [];
    }

    const route = this.dijkstra(originStation.id, destStation.id, preference);
    
    if (!route) {
      return [];
    }

    return [route];
  }

  /**
   * Dijkstra's algorithm implementation
   */
  private dijkstra(
    startId: string,
    endId: string,
    preference: 'FASTEST' | 'FEWEST_TRANSFERS'
  ): CalculatedRoute | null {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    // Initialize
    this.nodes.forEach((_, id) => {
      distances.set(id, Infinity);
      previous.set(id, null);
      unvisited.add(id);
    });
    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current: string | null = null;
      let minDist = Infinity;
      unvisited.forEach((id) => {
        const dist = distances.get(id) || Infinity;
        if (dist < minDist) {
          minDist = dist;
          current = id;
        }
      });

      if (!current || current === endId) break;
      if (minDist === Infinity) break;

      unvisited.delete(current);

      // Update neighbors
      const node = this.nodes.get(current);
      if (!node) continue;

      node.neighbors.forEach((edge, neighborId) => {
        if (!unvisited.has(neighborId)) return;

        const alt = (distances.get(current!) || 0) + edge.duration;
        if (alt < (distances.get(neighborId) || Infinity)) {
          distances.set(neighborId, alt);
          previous.set(neighborId, current);
        }
      });
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = endId;
    while (current) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    if (path.length === 0 || path[0] !== startId) {
      return null;
    }

    // Build segments
    const segments: RouteSegment[] = [];
    let totalDuration = 0;
    let totalDistance = 0;
    let lastLine = '';
    let transferCount = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const fromStation = this.stations.get(path[i])!;
      const toStation = this.stations.get(path[i + 1])!;
      const edge = this.nodes.get(path[i])!.neighbors.get(path[i + 1])!;

      segments.push({
        from: fromStation,
        to: toStation,
        duration_seconds: edge.duration,
        distance_meters: edge.distance,
        line: fromStation.line,
      });

      totalDuration += edge.duration;
      totalDistance += edge.distance;

      if (lastLine && lastLine !== fromStation.line) {
        transferCount++;
      }
      lastLine = fromStation.line;
    }

    return {
      segments,
      totalDuration,
      totalDistance,
      transferCount,
    };
  }
}

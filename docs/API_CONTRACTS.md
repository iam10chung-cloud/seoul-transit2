# API Contracts

## Base URL

- Development: `http://localhost:8080/v1`
- Production: TBD

## Authentication

None required for MVP (public access).

---

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /v1/health`

**Request:** None

**Response:**
```json
{
  "ok": true,
  "time": "2024-01-14T10:30:00.000Z",
  "service": "seoul-transit-api",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK`: Server is healthy

---

### 2. Get Routes

Find transit routes between two locations.

**Endpoint:** `POST /v1/routes`

**Request Body:**
```json
{
  "origin": {
    "lat": 37.498095,
    "lng": 127.027610
  },
  "destination": {
    "lat": 37.554648,
    "lng": 126.970730
  },
  "preference": "FASTEST",
  "departure_time_iso": "2024-01-14T10:30:00.000Z"
}
```

**Request Fields:**
- `origin` (required): Start location
  - `lat` (number, required): Latitude (-90 to 90)
  - `lng` (number, required): Longitude (-180 to 180)
- `destination` (required): End location
  - `lat` (number, required): Latitude (-90 to 90)
  - `lng` (number, required): Longitude (-180 to 180)
- `preference` (optional, default: "FASTEST"): Route preference
  - Values: `"FASTEST"` or `"FEWEST_TRANSFERS"`
- `departure_time_iso` (optional, default: current time): Departure time in ISO 8601 format

**Response:**
```json
{
  "routes": [
    {
      "id": "route-1",
      "totalDuration": 1800,
      "totalDistance": 15000,
      "transferCount": 1,
      "walkingTime": 420,
      "departureTime": "2024-01-14T10:30:00.000Z",
      "arrivalTime": "2024-01-14T11:00:00.000Z",
      "realtimeConfidence": 0.85,
      "legs": [
        {
          "mode": "WALK",
          "from": {
            "name": "Start Location",
            "lat": 37.498095,
            "lng": 127.027610
          },
          "to": {
            "name": "Gangnam Station",
            "lat": 37.498095,
            "lng": 127.027610,
            "stopId": "subway-gangnam-line2"
          },
          "duration": 300,
          "distance": 400,
          "instructions": "Walk to Gangnam Station (Line 2)"
        },
        {
          "mode": "SUBWAY",
          "from": {
            "name": "Gangnam Station",
            "lat": 37.498095,
            "lng": 127.027610,
            "stopId": "subway-gangnam-line2"
          },
          "to": {
            "name": "Seoul Station",
            "lat": 37.554648,
            "lng": 126.970730,
            "stopId": "subway-seoul-line1"
          },
          "duration": 1200,
          "distance": 12000,
          "instructions": "Take Line 2 (Green) towards City Hall",
          "routeId": "line-2",
          "routeName": "Line 2 (Green Line)",
          "stopCount": 10
        },
        {
          "mode": "WALK",
          "from": {
            "name": "Seoul Station",
            "lat": 37.554648,
            "lng": 126.970730
          },
          "to": {
            "name": "Destination",
            "lat": 37.554648,
            "lng": 126.970730
          },
          "duration": 300,
          "distance": 350,
          "instructions": "Walk to destination"
        }
      ]
    }
  ],
  "metadata": {
    "requestTime": "2024-01-14T10:30:00.000Z",
    "preference": "FASTEST",
    "realtimeAvailable": true,
    "fallbackMode": false
  }
}
```

**Response Fields:**

- `routes`: Array of route options (up to 3)
  - `id`: Unique route identifier
  - `totalDuration`: Total travel time in seconds
  - `totalDistance`: Total distance in meters
  - `transferCount`: Number of transfers
  - `walkingTime`: Total walking time in seconds
  - `departureTime`: ISO 8601 departure time
  - `arrivalTime`: ISO 8601 arrival time
  - `realtimeConfidence`: Confidence score (0.0-1.0) based on real-time data availability
  - `legs`: Array of route segments
    - `mode`: Transportation mode (`"WALK"`, `"BUS"`, `"SUBWAY"`)
    - `from`: Start location with name, lat, lng, optional stopId
    - `to`: End location with name, lat, lng, optional stopId
    - `duration`: Segment duration in seconds
    - `distance`: Segment distance in meters
    - `instructions`: Human-readable directions
    - `routeId`: Transit route ID (for BUS/SUBWAY)
    - `routeName`: Transit route name (for BUS/SUBWAY)
    - `stopCount`: Number of stops (for BUS/SUBWAY)

- `metadata`: Request metadata
  - `requestTime`: When the request was processed
  - `preference`: Applied route preference
  - `realtimeAvailable`: Whether real-time data was used
  - `fallbackMode`: Whether static/fallback data was used

**Status Codes:**
- `200 OK`: Routes found successfully
- `400 Bad Request`: Invalid input (missing fields, invalid coordinates)
- `500 Internal Server Error`: Server error

**Error Response:**
```json
{
  "error": "Missing required fields: origin and destination"
}
```

---

### 3. Real-time Status

Check the status of upstream APIs and cache.

**Endpoint:** `GET /v1/realtime/status`

**Request:** None

**Response:**
```json
{
  "ok": true,
  "upstreamApis": {
    "seoulBus": {
      "status": "healthy",
      "lastFetch": "2024-01-14T10:29:45.000Z",
      "message": "All systems operational"
    },
    "seoulSubway": {
      "status": "healthy",
      "lastFetch": "2024-01-14T10:29:48.000Z",
      "message": "All systems operational"
    }
  },
  "cache": {
    "redis": {
      "status": "healthy",
      "message": "Connected"
    }
  },
  "timestamp": "2024-01-14T10:30:00.000Z"
}
```

**Response Fields:**
- `ok`: Overall system health (boolean)
- `upstreamApis`: Status of external APIs
  - `status`: One of `"healthy"`, `"degraded"`, `"down"`, `"not_configured"`
  - `lastFetch`: ISO 8601 timestamp of last successful fetch
  - `message`: Human-readable status message
- `cache`: Cache system status
  - `redis.status`: Redis connection status
  - `redis.message`: Connection details
- `timestamp`: Current server time

**Status Codes:**
- `200 OK`: Status retrieved successfully

---

## Common Types

### Coordinate
```typescript
{
  lat: number;  // -90 to 90
  lng: number;  // -180 to 180
}
```

### Location
```typescript
{
  name: string;
  lat: number;
  lng: number;
  stopId?: string;  // Optional stop/station ID
}
```

### TransitMode
```typescript
type TransitMode = 'WALK' | 'BUS' | 'SUBWAY';
```

### RoutePreference
```typescript
type RoutePreference = 'FASTEST' | 'FEWEST_TRANSFERS';
```

---

## Rate Limiting

- Default: 100 requests per minute per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## CORS

- Development: All origins allowed
- Production: Restricted to known domains

---

## Versioning

API versioned via URL path (`/v1/`). Breaking changes will result in new version (`/v2/`).

# Seoul Transit API - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │   Home   │→ │ Results  │→ │    Route Detail          │  │
│  │  Screen  │  │  Screen  │  │      Screen              │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
│         │              ↑                                     │
│         └──────────────┘                                     │
│              API Service Layer                               │
│         (axios + request/response handling)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               API Server (Node.js + TypeScript)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Routes                                      │   │
│  │  • /v1/health (GET)                                  │   │
│  │  • /v1/routes (POST)                                 │   │
│  │  • /v1/realtime/status (GET)                         │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer                                      │   │
│  │  • Routing Engine (Dijkstra/A*)                      │   │
│  │  • Real-time Data Fetcher                            │   │
│  │  • Geocoding Service                                 │   │
│  │  • Cache Manager                                     │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Layer                                          │   │
│  │  • PostgreSQL (static transit data)                  │   │
│  │  • Redis (real-time cache)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│            External APIs (Seoul Open Data)                  │
│  • Seoul Bus API (arrivals, vehicle positions)              │
│  • Seoul Subway API (real-time arrivals)                    │
│  • Geocoding API (Kakao/Naver/Google)                       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Route Request Flow

1. User enters start/destination on Home Screen
2. Mobile app sends POST /v1/routes with coordinates
3. Server receives request, validates input
4. Routing engine:
   - Finds nearest stops/stations to start/destination
   - Builds graph with walk/bus/subway edges
   - Runs Dijkstra to find top 3 routes
   - Enhances routes with real-time data
5. Server responds with routes array
6. Mobile app displays routes on Results Screen
7. User taps route → navigates to Route Detail Screen

### Real-time Data Flow

1. Background task fetches arrivals from Seoul APIs every 20s
2. Data cached in Redis with 20-30s TTL
3. Route calculation queries cache for current arrivals
4. If cache miss → fetch from API → update cache
5. If API fails → fall back to schedule/average times

## Core Components

### Server Components

#### 1. Routing Engine
- **Purpose**: Calculate optimal transit routes
- **Algorithm**: Dijkstra (baseline), A* (optimization)
- **Graph Structure**:
  - Nodes: Bus stops, subway stations, walking access points
  - Edges: Bus rides, subway rides, transfers, walking segments
- **Cost Function**: 
  - Primary: total_travel_time
  - Secondary: transfer_count, walking_time
  - Penalties: transfer_penalty (240s), walking_multiplier (1.15x)

#### 2. Real-time Integration
- **Bus Arrivals**: Seoul Bus API → arrival times at stops
- **Subway Arrivals**: Seoul Subway API → arrival predictions
- **Update Interval**: 20 seconds
- **Staleness Threshold**: 90 seconds (fall back to static if older)

#### 3. Caching Layer
- **Redis Store**:
  - Key pattern: `arrivals:{stop_id}:{timestamp}`
  - TTL: 20-30 seconds
- **PostgreSQL Store** (optional):
  - Static data: stops, routes, schedules
  - Cache: frequently requested routes (1 hour TTL)

#### 4. Geocoding Service
- **Provider**: Kakao/Naver/Google Maps
- **Functions**:
  - Text search → coordinates
  - Coordinates → nearest stops/stations
  - Radius search (default 800m, max 1500m)

### Mobile Components

#### 1. Navigation
- React Navigation (Native Stack)
- Three screens: Home → Results → RouteDetail
- Deep linking support (future)

#### 2. API Service
- Axios-based HTTP client
- Request/response interceptors
- Error handling and retry logic
- Environment-based base URL

#### 3. UI Components
- **RouteCard**: Summary of route (time, transfers, modes)
- **LegCard**: Step-by-step instruction for each leg
- Loading states and error boundaries

## Data Models

### Static Data (PostgreSQL)

#### Stops Table
```sql
CREATE TABLE stops (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'bus', 'subway'
  line_id VARCHAR(50), -- for subway
  INDEX idx_location (lat, lng)
);
```

#### Routes Table
```sql
CREATE TABLE routes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'bus', 'subway'
  route_order INTEGER NOT NULL
);
```

#### Edges Table (Graph)
```sql
CREATE TABLE edges (
  id SERIAL PRIMARY KEY,
  from_stop_id VARCHAR(50) NOT NULL,
  to_stop_id VARCHAR(50) NOT NULL,
  route_id VARCHAR(50),
  mode VARCHAR(20) NOT NULL, -- 'walk', 'bus', 'subway'
  duration_seconds INTEGER NOT NULL,
  distance_meters INTEGER NOT NULL,
  FOREIGN KEY (from_stop_id) REFERENCES stops(id),
  FOREIGN KEY (to_stop_id) REFERENCES stops(id),
  INDEX idx_from_stop (from_stop_id),
  INDEX idx_to_stop (to_stop_id)
);
```

### Real-time Data (Redis)

#### Arrival Cache
```json
{
  "stop_id": "bus-stop-123",
  "arrivals": [
    {
      "route_id": "bus-472",
      "arrival_time_seconds": 180,
      "vehicle_id": "bus-472-001",
      "timestamp": "2024-01-14T10:30:00Z"
    }
  ]
}
```

## API Contracts

See [API_CONTRACTS.md](./API_CONTRACTS.md) for detailed endpoint specifications.

## Deployment Architecture

### Development
- Server: localhost:8080
- Mobile: Expo Dev Client
- Database: Local PostgreSQL (optional)
- Cache: Local Redis (optional)

### Production (Future)
- Server: Cloud VM or Container (AWS/GCP/Azure)
- Database: Managed PostgreSQL (RDS/Cloud SQL)
- Cache: Managed Redis (ElastiCache/MemoryStore)
- Mobile: Expo EAS Build → App Store/Play Store

## Performance Targets

- Route calculation: < 800ms (p95)
- API response time: < 500ms (p95)
- Mobile UI render: < 100ms
- Real-time update interval: 20s
- Cold start time: < 2.5s

## Security Considerations

1. **API Keys**: All external API keys stored server-side only
2. **Rate Limiting**: 100 requests/minute per IP
3. **Input Validation**: Strict coordinate bounds checking
4. **CORS**: Restricted to known origins in production
5. **No Authentication**: MVP is public, no user data stored

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API servers
2. **Caching**: Redis for frequently requested routes
3. **Database**: Read replicas for static data
4. **CDN**: Static assets (future)
5. **Load Balancing**: NGINX or cloud LB (future)

## Monitoring and Observability

- **Logging**: Winston (structured JSON logs)
- **Metrics**: Request count, response times, error rates
- **Health Checks**: /v1/health endpoint
- **Status Dashboard**: /v1/realtime/status
- **Alerts**: API downtime, high error rates (future)

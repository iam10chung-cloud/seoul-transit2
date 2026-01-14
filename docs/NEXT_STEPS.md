# Next Steps - Implementation Roadmap

This document outlines the steps to transform the current MVP skeleton into a fully functional Seoul Transit app with real routing and real-time data.

---

## Phase 1: Static Transit Data (Foundation)

### 1.1 Data Collection
- [ ] Download Seoul transit static data from Seoul Open Data Portal
  - Bus routes, stops, and sequences
  - Subway lines, stations, and connections
  - Transfer information (walking distances between stops/stations)
- [ ] Download or create GTFS-like datasets if available
- [ ] Document data sources and licenses

### 1.2 Database Setup
- [ ] Set up PostgreSQL database
- [ ] Create schema for stops, routes, edges (see `docs/ARCHITECTURE.md`)
- [ ] Build data ingestion scripts:
  - `scripts/ingest_bus_data.ts` - Parse and load bus data
  - `scripts/ingest_subway_data.ts` - Parse and load subway data
  - `scripts/build_transfer_edges.ts` - Calculate transfer edges
- [ ] Seed database with Seoul transit data
- [ ] Create indexes for performance (lat/lng, stop_id, route_id)

### 1.3 Graph Model Implementation
- [ ] Implement graph data structure in `server/src/models/TransitGraph.ts`
- [ ] Load graph from database into memory on server start
- [ ] Create nodes for all stops/stations
- [ ] Create edges:
  - Bus ride edges (stop-to-stop on each route)
  - Subway ride edges (station-to-station on each line)
  - Transfer edges (walking between nearby stops/stations)
  - Access edges (walking from origin/destination to nearby stops)

**Deliverable:** Server can load and represent Seoul transit network as a graph.

---

## Phase 2: Routing Engine (Core Functionality)

### 2.1 Basic Routing
- [ ] Implement Dijkstra's algorithm in `server/src/services/RoutingEngine.ts`
- [ ] Implement cost function:
  - Primary: total travel time
  - Secondary: transfer count, walking time
  - Penalties: transfer penalty (240s), walking multiplier (1.15x)
- [ ] Support "Fastest" preference

### 2.2 Multiple Routes
- [ ] Extend algorithm to return top K routes (K=3)
- [ ] Implement route diversity (avoid returning nearly identical routes)
- [ ] Add "Fewest Transfers" preference (modify cost function)

### 2.3 Nearest Stop/Station Lookup
- [ ] Implement geospatial queries:
  - Find stops/stations within radius of origin
  - Find stops/stations within radius of destination
- [ ] Use PostGIS or in-memory spatial index
- [ ] Default radius: 800m, max: 1500m

### 2.4 Walking Segments
- [ ] Calculate walking duration using distance and average walking speed (1.4 m/s)
- [ ] Generate walking instructions ("Walk 400m to Gangnam Station")

**Deliverable:** Server returns real routes based on Seoul transit network.

---

## Phase 3: Real-time Integration

### 3.1 Seoul Transit API Integration
- [ ] Sign up for Seoul Open Data API keys:
  - Bus API: arrivals, vehicle positions
  - Subway API: real-time arrivals
- [ ] Implement API clients in `server/src/services/SeoulBusAPI.ts` and `SeoulSubwayAPI.ts`
- [ ] Handle rate limits and errors gracefully
- [ ] Parse and normalize real-time data

### 3.2 Redis Caching
- [ ] Set up Redis instance
- [ ] Implement cache layer in `server/src/services/CacheManager.ts`
- [ ] Cache arrivals with 20-30s TTL
- [ ] Cache static data with 1-day TTL
- [ ] Implement request coalescing (avoid duplicate API calls)

### 3.3 Real-time Route Enhancement
- [ ] Fetch real-time arrivals for stops/stations in route
- [ ] Update waiting times based on real-time data
- [ ] Update segment durations based on vehicle positions
- [ ] Calculate and return `realtimeConfidence` score
- [ ] Update ETAs every 20 seconds (background task)

### 3.4 Fallback Behavior
- [ ] If real-time fetch fails, use schedule/average times
- [ ] Set `realtimeAvailable: false` and `fallbackMode: true` in response
- [ ] Log fallback events for monitoring

**Deliverable:** Routes include real-time arrival information when available.

---

## Phase 4: Geocoding and Search

### 4.1 Geocoding Service
- [ ] Choose geocoding provider (Kakao, Naver, or Google Maps)
- [ ] Obtain API key
- [ ] Implement geocoding client in `server/src/services/GeocodingService.ts`
- [ ] Support:
  - Address text → coordinates
  - POI name → coordinates
  - Coordinates → address (reverse geocoding)

### 4.2 Mobile Search UI
- [ ] Replace coordinate inputs with address/POI search
- [ ] Add autocomplete suggestions
- [ ] Add map view with pin selection
- [ ] Save recent searches locally

**Deliverable:** Users can search by address/POI instead of entering coordinates.

---

## Phase 5: Mobile App Polish

### 5.1 Map Integration
- [ ] Add map library (react-native-maps or Mapbox)
- [ ] Display route polylines on map
- [ ] Show stop/station markers
- [ ] Center map on route bounds

### 5.2 Real-time Updates
- [ ] Poll `/v1/routes` every 20 seconds for updated ETAs
- [ ] Show "Last updated: 15s ago" timestamp
- [ ] Add refresh button
- [ ] Show loading indicator during updates

### 5.3 Favorites (Optional)
- [ ] Allow saving "Home" and "Work" locations
- [ ] Store favorites in AsyncStorage
- [ ] Quick access buttons on Home screen

### 5.4 Offline Support (Optional)
- [ ] Cache recent routes locally
- [ ] Show "Offline" banner when no network
- [ ] Retry failed requests automatically

**Deliverable:** Polished mobile app with map, real-time updates, and favorites.

---

## Phase 6: Testing and Validation

### 6.1 Unit Tests
- [ ] Test routing cost calculation
- [ ] Test transfer penalty application
- [ ] Test nearest stop/station lookup
- [ ] Test real-time data parsing

### 6.2 Integration Tests
- [ ] Mock external APIs
- [ ] Test complete route request flow
- [ ] Test error handling and fallbacks
- [ ] Test cache behavior

### 6.3 Manual Testing
- [ ] Test 5 common Seoul trips:
  1. Short trip (1-2 stops)
  2. Long trip (10+ stops)
  3. Bus-heavy trip
  4. Subway-heavy trip
  5. Late-night trip (limited service)
- [ ] Verify route accuracy vs Google Maps/Naver Map
- [ ] Test on real devices (iOS and Android)

**Deliverable:** Comprehensive test coverage and validation.

---

## Phase 7: Production Readiness

### 7.1 Performance Optimization
- [ ] Add database query optimization
- [ ] Implement A* algorithm for faster routing
- [ ] Add route caching (frequently requested routes)
- [ ] Profile and optimize hot paths

### 7.2 Monitoring and Logging
- [ ] Set up structured logging
- [ ] Add request/response logging
- [ ] Monitor API response times
- [ ] Set up error tracking (Sentry or similar)

### 7.3 Deployment
- [ ] Containerize server with Docker
- [ ] Set up CI/CD pipeline
- [ ] Deploy server to cloud (AWS/GCP/Azure)
- [ ] Set up managed PostgreSQL and Redis
- [ ] Build mobile app with Expo EAS
- [ ] Submit to App Store and Play Store (future)

**Deliverable:** Production-ready app deployed and monitored.

---

## Quick Reference: Replace Mocked Routing

Current mocked response location:
- **File:** `server/src/routes/routes.ts`
- **Function:** `postRoutes`
- **Lines:** Mock response object starting at `const mockResponse: RoutesResponse = { ... }`

To replace with real routing:
1. Import routing engine: `import { RoutingEngine } from '../services/RoutingEngine';`
2. Initialize engine: `const engine = new RoutingEngine();`
3. Call routing function:
   ```typescript
   const routes = await engine.findRoutes({
     origin: body.origin,
     destination: body.destination,
     preference: preference,
     departureTime: new Date(departureTime),
   });
   ```
4. Return routes with metadata

---

## Priority Order

For fastest MVP → Production:

1. **Phase 2** (Routing Engine) - Core functionality
2. **Phase 1** (Static Data) - Foundation for routing
3. **Phase 3** (Real-time) - Key differentiator
4. **Phase 4** (Geocoding) - Improved UX
5. **Phase 5** (Mobile Polish) - Professional feel
6. **Phase 6** (Testing) - Reliability
7. **Phase 7** (Production) - Scale and monitor

---

## Resources

### Seoul Open Data Portal
- Bus API: https://data.seoul.go.kr (search for "버스 도착 정보")
- Subway API: https://data.seoul.go.kr (search for "지하철 실시간 도착 정보")

### Geocoding APIs
- Kakao Maps API: https://developers.kakao.com/
- Naver Maps API: https://www.ncloud.com/product/applicationService/maps
- Google Maps API: https://developers.google.com/maps

### React Native Libraries
- Maps: `react-native-maps`
- Storage: `@react-native-async-storage/async-storage`
- Location: `expo-location`

---

## Questions?

Refer to:
- Architecture: `docs/ARCHITECTURE.md`
- API Contracts: `docs/API_CONTRACTS.md`
- Project README: `README.md`

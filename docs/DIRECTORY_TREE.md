# Project Directory Tree

```
seoul-transit/
├── README.md                           # Main project documentation
├── .git/                               # Git repository
│
├── docs/                               # Documentation
│   ├── ARCHITECTURE.md                 # System architecture and design
│   ├── API_CONTRACTS.md                # API endpoint specifications
│   ├── NEXT_STEPS.md                   # Implementation roadmap
│   └── SETUP_GUIDE.md                  # Local setup instructions
│
├── server/                             # Node.js + TypeScript API Server
│   ├── package.json                    # Server dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Git ignore patterns
│   │
│   └── src/
│       ├── index.ts                    # Server entry point
│       │
│       ├── routes/                     # API route handlers
│       │   ├── index.ts                # Route aggregation
│       │   ├── health.ts               # GET /v1/health
│       │   ├── routes.ts               # POST /v1/routes (main routing endpoint)
│       │   └── realtime.ts             # GET /v1/realtime/status
│       │
│       ├── services/                   # Business logic (future)
│       │   └── (RoutingEngine.ts)      # TODO: Dijkstra/A* implementation
│       │
│       ├── models/                     # Data models (future)
│       │   └── (TransitGraph.ts)       # TODO: Graph data structure
│       │
│       ├── types/                      # TypeScript type definitions
│       │   └── api.ts                  # API request/response types
│       │
│       └── utils/                      # Utility functions
│           ├── logger.ts               # Winston logger setup
│           ├── errorHandler.ts         # Express error handler
│           └── requestLogger.ts        # Request logging middleware
│
└── mobile/                             # React Native + Expo Mobile App
    ├── App.tsx                         # App entry point
    ├── package.json                    # Mobile dependencies and scripts
    ├── app.json                        # Expo configuration
    ├── tsconfig.json                   # TypeScript configuration
    ├── babel.config.js                 # Babel configuration
    ├── .env.example                    # Environment variables template
    ├── .gitignore                      # Git ignore patterns
    │
    └── src/
        ├── navigation/                 # Navigation setup
        │   └── AppNavigator.tsx        # React Navigation stack
        │
        ├── screens/                    # Screen components
        │   ├── HomeScreen.tsx          # Start/destination input screen
        │   ├── ResultsScreen.tsx       # Route results list screen
        │   └── RouteDetailScreen.tsx   # Step-by-step route details
        │
        ├── components/                 # Reusable UI components
        │   ├── RouteCard.tsx           # Route summary card
        │   └── LegCard.tsx             # Individual route leg card
        │
        ├── services/                   # API and external services
        │   └── api.ts                  # Axios API client
        │
        └── types/                      # TypeScript type definitions
            ├── api.ts                  # API types (matches server)
            └── env.d.ts                # Environment variable types
```

## File Count Summary

- **Total Files:** 32
- **Server Files:** 14
- **Mobile Files:** 15
- **Documentation:** 5

## Key Files to Understand

### Server
1. `server/src/index.ts` - Server initialization and middleware setup
2. `server/src/routes/routes.ts` - Main routing endpoint (currently mocked)
3. `server/src/types/api.ts` - Type definitions for API contracts

### Mobile
1. `mobile/App.tsx` - App entry point
2. `mobile/src/navigation/AppNavigator.tsx` - Screen navigation setup
3. `mobile/src/screens/HomeScreen.tsx` - User input and route search
4. `mobile/src/services/api.ts` - API communication layer

### Documentation
1. `docs/SETUP_GUIDE.md` - **START HERE** for running locally
2. `docs/ARCHITECTURE.md` - System design and data models
3. `docs/API_CONTRACTS.md` - API endpoint specifications
4. `docs/NEXT_STEPS.md` - Implementation roadmap

## Lines of Code (Approximate)

- Server TypeScript: ~1,200 lines
- Mobile TypeScript: ~1,800 lines
- Documentation: ~1,500 lines
- **Total: ~4,500 lines**

## Next Files to Create (Future Phases)

### Server
- `server/src/services/RoutingEngine.ts` - Dijkstra/A* algorithm
- `server/src/services/SeoulBusAPI.ts` - Seoul Bus API client
- `server/src/services/SeoulSubwayAPI.ts` - Seoul Subway API client
- `server/src/services/CacheManager.ts` - Redis caching layer
- `server/src/services/GeocodingService.ts` - Geocoding/search
- `server/src/models/TransitGraph.ts` - Graph data structure
- `server/scripts/ingest_bus_data.ts` - Data ingestion
- `server/scripts/ingest_subway_data.ts` - Data ingestion

### Mobile
- `mobile/src/components/MapView.tsx` - Route map display
- `mobile/src/screens/FavoritesScreen.tsx` - Saved locations
- `mobile/src/services/location.ts` - GPS and location services
- `mobile/src/utils/storage.ts` - AsyncStorage helpers

### Testing
- `server/src/__tests__/` - Server unit/integration tests
- `mobile/src/__tests__/` - Mobile component tests

## Build Output (Not in Git)

```
server/dist/                            # Compiled JavaScript (npm run build)
server/node_modules/                    # Server dependencies (npm install)
mobile/node_modules/                    # Mobile dependencies (npm install)
mobile/.expo/                           # Expo cache
*.log                                   # Log files
.env                                    # Local environment variables
```

# Seoul Transit-Only Personal Route Finder (MVP)

A mobile-first public transit route finder for Seoul with real-time arrivals.

## 📖 Documentation

- 🇰🇷 **[한국어 빠른 시작 가이드](QUICKSTART_KR.md)** - 5분 안에 시작하기
- 🇰🇷 **[한국어 사용 매뉴얼](docs/USER_MANUAL_KR.md)** - 상세 설명서
- 🇺🇸 **[English Quick Start](BUILD_SUMMARY.md)** - Complete guide
- 📚 **[Full Documentation](docs/)** - Architecture, API specs, roadmap

## Project Structure

```
seoul-transit/
├── server/          # Node.js + TypeScript + Express API
├── mobile/          # React Native + Expo mobile app
└── docs/            # Architecture and API documentation
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL (optional for MVP)
- Redis (optional for MVP)

### Running Locally

#### 1. Start the Server

```bash
cd server
npm install
npm run dev
```

Server will run on http://localhost:8080

#### 2. Start the Mobile App

```bash
cd mobile
npm install
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Environment Setup

### Server

Copy `server/.env.example` to `server/.env` and configure:

```
PORT=8080
NODE_ENV=development
# Add API keys for Seoul transit APIs when ready
```

### Mobile

Copy `mobile/.env.example` to `mobile/.env` and configure:

```
API_BASE_URL=http://localhost:8080
```

For physical device testing, use your computer's local IP:
```
API_BASE_URL=http://192.168.1.XXX:8080
```

## Development Workflow

1. Server changes auto-reload via nodemon
2. Mobile changes hot-reload via Expo
3. Test API endpoints: `curl http://localhost:8080/v1/health`

## Next Steps

See [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) for implementation roadmap.

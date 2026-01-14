# 🦽 Seoul Accessible Transit

**Making Seoul's public transportation accessible for everyone.**

A comprehensive, accessibility-focused transit app designed to help people with disabilities navigate Seoul's public transportation system with confidence and independence.

## 🎯 Mission

To empower Seoul's 2.5+ million residents with disabilities by providing accessible, reliable, and easy-to-use public transit navigation.

## ✨ Accessibility Features

### ♿ Wheelchair Users
- Step-free route planning
- Real-time elevator status
- Low-floor bus (저상버스) tracking
- Platform gap warnings
- Accessible restroom locations

### 👁️ Visually Impaired
- Turn-by-turn voice guidance
- Tactile paving information
- Braille signage availability
- High-contrast mode
- Screen reader optimized

### 👂 Hearing Impaired
- Visual display information
- Induction loop availability
- Text-based alerts

### 🧠 Cognitive Disabilities
- Easy Mode with simplified interface
- Picture-based instructions
- Practice mode (rehearse routes)
- Companion alert system
- Extra time buffers

### 👴 Elderly Users
- Shorter walking distances
- Fewer transfers
- Extra transfer time

## 📖 Documentation

- 🦽 **[Accessibility Guide](docs/ACCESSIBILITY.md)** - Comprehensive accessibility features
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

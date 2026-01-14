# Seoul Transit - Local Setup Guide

Complete guide for running the project locally on macOS and Windows.

---

## Prerequisites

### All Platforms

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version` (should show v18 or higher)

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Expo CLI** (for mobile development)
   ```bash
   npm install -g expo-cli
   ```

4. **Git**
   - macOS: Pre-installed or via Xcode Command Line Tools
   - Windows: https://git-scm.com/download/win

### Optional (for full stack)

5. **PostgreSQL 14+** (for production data storage)
   - macOS: `brew install postgresql@14` or https://postgresapp.com/
   - Windows: https://www.postgresql.org/download/windows/

6. **Redis** (for real-time caching)
   - macOS: `brew install redis`
   - Windows: https://github.com/microsoftarchive/redis/releases

---

## Initial Setup

### 1. Clone the Repository

```bash
# If starting fresh, create a new repo
git clone <your-repo-url>
cd seoul-transit

# Or if already in the directory
cd /path/to/webapp
```

### 2. Setup Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings (optional for MVP)
# For now, defaults work fine
```

### 3. Setup Mobile App

```bash
# Navigate to mobile directory (from project root)
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env - IMPORTANT: Set your API base URL
# For simulator/emulator: API_BASE_URL=http://localhost:8080
# For physical device: API_BASE_URL=http://YOUR_COMPUTER_IP:8080
```

To find your computer's IP:
- **macOS**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

---

## Running the Project

### Option 1: Quick Start (Two Terminal Windows)

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

You should see:
```
🚇 Seoul Transit API server running on port 8080
Environment: development
```

**Terminal 2 - Start Mobile App:**
```bash
cd mobile
npm start
```

You should see the Expo QR code and options.

### Option 2: Using Package Manager Scripts

From project root, you can run:

**Start Server:**
```bash
cd server && npm run dev
```

**Start Mobile:**
```bash
cd mobile && npm start
```

---

## Testing the Server

### Health Check

```bash
# macOS/Linux
curl http://localhost:8080/v1/health

# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:8080/v1/health

# Expected output:
# {"ok":true,"time":"2024-01-14T...","service":"seoul-transit-api","version":"1.0.0"}
```

### Test Route Endpoint

```bash
# macOS/Linux
curl -X POST http://localhost:8080/v1/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 37.498095, "lng": 127.027610},
    "destination": {"lat": 37.554648, "lng": 126.970730},
    "preference": "FASTEST"
  }'

# Windows (PowerShell)
$body = @{
  origin = @{lat = 37.498095; lng = 127.027610}
  destination = @{lat = 37.554648; lng = 126.970730}
  preference = "FASTEST"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8080/v1/routes -Method POST -Body $body -ContentType "application/json"
```

---

## Running the Mobile App

### iOS Simulator (macOS only)

1. Install Xcode from App Store
2. Open Xcode → Preferences → Locations → Command Line Tools (select latest)
3. In Expo terminal, press `i`

### Android Emulator (macOS/Windows)

1. Install Android Studio: https://developer.android.com/studio
2. Open Android Studio → Tools → AVD Manager → Create Virtual Device
3. Start an emulator
4. In Expo terminal, press `a`

### Physical Device (Easiest)

1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Ensure phone and computer are on same WiFi network
3. **IMPORTANT**: Update `mobile/.env`:
   ```
   API_BASE_URL=http://YOUR_COMPUTER_IP:8080
   ```
4. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

---

## Troubleshooting

### Server Issues

**Problem:** `Error: Cannot find module ...`
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

**Problem:** `Port 8080 already in use`
```bash
# Find process using port 8080
# macOS/Linux:
lsof -i :8080
kill -9 <PID>

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in server/.env:
PORT=8081
```

**Problem:** TypeScript errors
```bash
cd server
npm run build
# Fix any errors shown, then:
npm run dev
```

### Mobile Issues

**Problem:** `Unable to resolve module @env`
```bash
cd mobile
# Clear Metro bundler cache
npx expo start -c
```

**Problem:** API connection fails on physical device
1. Verify computer and phone on same WiFi
2. Check firewall isn't blocking port 8080
3. Update `mobile/.env` with correct IP:
   ```bash
   # Find your IP
   # macOS:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Windows:
   ipconfig
   
   # Then update .env:
   API_BASE_URL=http://192.168.1.XXX:8080
   ```
4. Restart Expo: `npm start` (or press `r` in terminal)

**Problem:** Expo Go not connecting
```bash
# Try tunnel mode
cd mobile
npx expo start --tunnel
```

**Problem:** Build errors
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

### Database Issues (if using PostgreSQL)

**Problem:** Connection refused
```bash
# macOS:
brew services start postgresql@14

# Windows:
# Start PostgreSQL service from Services panel
```

**Problem:** Database doesn't exist
```bash
# Create database
createdb seoul_transit

# Or using psql:
psql postgres
CREATE DATABASE seoul_transit;
\q
```

### Redis Issues (if using Redis)

**Problem:** Connection refused
```bash
# macOS:
brew services start redis

# Windows:
# Start Redis service or run redis-server.exe
```

---

## Development Workflow

### Server Development

1. Make changes to files in `server/src/`
2. Server auto-reloads via nodemon
3. Test with curl or Postman
4. Check logs in terminal

### Mobile Development

1. Make changes to files in `mobile/src/`
2. App hot-reloads automatically
3. Shake device or press `m` in terminal for dev menu
4. View logs in Expo terminal

---

## IDE Setup

### VS Code (Recommended)

**Recommended Extensions:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- React Native Tools
- Expo Tools

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### WebStorm / IntelliJ IDEA

1. Open project folder
2. Enable TypeScript language service
3. Set Node.js interpreter
4. Install React Native plugin

---

## Running Tests (Future)

```bash
# Server tests
cd server
npm test

# Mobile tests (future)
cd mobile
npm test
```

---

## Building for Production

### Server

```bash
cd server
npm run build
# Creates dist/ folder with compiled JavaScript

# Run production build
npm start
```

### Mobile

```bash
cd mobile
# Build with Expo EAS (requires Expo account)
npx expo build:android
npx expo build:ios

# Or use EAS Build
npx eas build --platform android
npx eas build --platform ios
```

---

## Environment Variables Reference

### Server (`.env`)

```bash
PORT=8080                          # API server port
NODE_ENV=development               # Environment (development/production)
LOG_LEVEL=info                     # Logging level (debug/info/warn/error)

# Optional - Add when ready
DATABASE_URL=postgresql://...      # PostgreSQL connection string
REDIS_URL=redis://localhost:6379   # Redis connection string
SEOUL_BUS_API_KEY=...             # Seoul Bus API key
SEOUL_SUBWAY_API_KEY=...          # Seoul Subway API key
KAKAO_API_KEY=...                 # Kakao Maps API key
```

### Mobile (`.env`)

```bash
# For simulator/emulator
API_BASE_URL=http://localhost:8080

# For physical device (replace with your IP)
API_BASE_URL=http://192.168.1.XXX:8080

# For production
API_BASE_URL=https://your-production-api.com
```

---

## Next Steps

Once everything is running:

1. ✅ Verify server health: http://localhost:8080/v1/health
2. ✅ Test route endpoint with sample coordinates
3. ✅ Open mobile app and try finding a route
4. 📚 Read `docs/NEXT_STEPS.md` for implementing real routing
5. 📚 Read `docs/ARCHITECTURE.md` for system design
6. 📚 Read `docs/API_CONTRACTS.md` for API details

---

## Getting Help

- Check `docs/` folder for detailed documentation
- Review error messages in terminal
- Enable debug logging: Set `LOG_LEVEL=debug` in `server/.env`
- Check Expo docs: https://docs.expo.dev/
- Check Express docs: https://expressjs.com/

---

## Common Commands Quick Reference

```bash
# Server
cd server && npm install              # Install dependencies
cd server && npm run dev              # Start development server
cd server && npm run build            # Build for production
cd server && npm start                # Run production build

# Mobile
cd mobile && npm install              # Install dependencies
cd mobile && npm start                # Start Expo dev server
cd mobile && npm start -- --clear     # Start with cache cleared
cd mobile && npx expo start -c        # Alternative cache clear

# Testing
curl http://localhost:8080/v1/health  # Test server health
```

---

Happy coding! 🚇✨

# 🦽 Seoul Accessible Transit - Accessibility Features

## Overview

Seoul Accessible Transit is a comprehensive platform designed to help people with disabilities navigate Seoul's public transportation system with confidence and independence.

## 🎯 Target Users

### 1. **Wheelchair Users (♿)**
- People using manual or powered wheelchairs
- People with mobility impairments requiring step-free access
- Parents with strollers

**Key Features:**
- Step-free route planning
- Real-time elevator status monitoring
- Platform gap warnings
- Low-floor bus (저상버스) tracking
- Accessible restroom locations
- Wide gate availability

### 2. **Visually Impaired Users (👁️)**
- Blind users
- Low-vision users
- Users requiring audio navigation

**Key Features:**
- Turn-by-turn voice guidance
- Tactile paving information
- Braille signage availability
- Audio announcements at stations
- High-contrast mode
- Screen reader optimization (VoiceOver/TalkBack compatible)
- Haptic feedback for key actions

### 3. **Hearing Impaired Users (👂)**
- Deaf users
- Hard-of-hearing users

**Key Features:**
- Visual display information
- Induction loop availability for hearing aids
- Visual alerts for important notifications
- Text-based communication with staff

### 4. **Cognitive Disabilities (🧠)**
- Autism spectrum disorder
- Intellectual disabilities
- Memory impairments
- Dementia

**Key Features:**
- Easy Mode with simplified interface
- Large buttons and simple language
- Picture-based step-by-step instructions
- Practice mode (rehearse routes)
- Companion alert system
- Extra time buffers for transfers
- Minimal transfer routes

### 5. **Elderly Users (👴)**
- Seniors with reduced mobility
- Users requiring more time for transfers

**Key Features:**
- Shorter walking distances
- Fewer transfers
- Extra transfer time allowances
- Simplified instructions

---

## 🏗️ Technical Architecture

### Backend Components

#### 1. Accessibility Data Model

```typescript
interface StationAccessibility {
  stationId: string;
  wheelchairAccessible: boolean;
  elevatorAvailable: boolean;
  elevatorStatus: 'WORKING' | 'OUTAGE' | 'MAINTENANCE' | 'UNKNOWN';
  elevatorCount: number;
  escalatorAvailable: boolean;
  stepCount: number;
  platformGapWidth: number; // cm
  platformGapHeight: number; // cm
  accessibleRestroom: boolean;
  tactilePaving: boolean;
  brailleSignage: boolean;
  audioAnnouncements: boolean;
  visualDisplays: boolean;
  inductionLoop: boolean;
  wheelchairRamps: boolean;
  wideGates: boolean;
  assistanceButtonAvailable: boolean;
  staffAssistanceAvailable: boolean;
  lastUpdated: string;
}
```

#### 2. User Profile

```typescript
interface UserAccessibilityProfile {
  accessibilityTypes: AccessibilityType[];
  preferences: {
    avoidStairs: boolean;
    requireElevator: boolean;
    requireLowFloorBus: boolean;
    requireAudioGuidance: boolean;
    requireVisualGuidance: boolean;
    requireSimpleRoutes: boolean;
    extraTransferTime: number; // minutes
    maxWalkingDistance: number; // meters
    maxTransfers: number;
  };
  assistanceNeeds: {
    companionAlert: boolean;
    companionPhone?: string;
    practiceMode: boolean;
  };
}
```

#### 3. Accessibility Scoring

Routes are scored on a 0-100 scale across four dimensions:
- **Wheelchair Score**: Evaluates elevators, ramps, step-free access, platform gaps
- **Visual Impairment Score**: Evaluates tactile paving, braille, audio support
- **Hearing Impairment Score**: Evaluates visual displays, induction loops
- **Cognitive Score**: Evaluates route complexity, transfer count, walking time

**Overall Score Calculation:**
- Weighted average based on user's accessibility types
- Routes with selected accessibility type get 3x weight
- Other dimensions get 1x weight

#### 4. Route Filtering

Routes are automatically filtered based on user profile:
- ❌ **Reject** routes with stairs if `avoidStairs: true`
- ❌ **Reject** routes exceeding `maxTransfers`
- ❌ **Reject** routes exceeding `maxWalkingDistance`
- ❌ **Reject** routes with broken elevators if `requireElevator: true`
- ✅ **Prioritize** routes with higher accessibility scores

---

## 📱 Mobile App Features

### 1. Accessibility Settings Screen

Path: `mobile/src/screens/AccessibilitySettings.tsx`

**Features:**
- Select multiple accessibility types
- Toggle Easy Mode
- Toggle Voice Guidance
- Toggle High Contrast Mode
- Save/Load profiles from AsyncStorage
- View current profile details

### 2. Context Provider

Path: `mobile/src/contexts/AccessibilityContext.tsx`

**Provides:**
- Global accessibility state
- Profile management (save/load/clear)
- Settings persistence
- Easy access via `useAccessibility()` hook

### 3. Enhanced Route Display

Routes now display:
- ♿ Accessibility score badge (0-100)
- ⚠️ Accessibility warnings
- 🔊 Voice guidance instructions
- 🚶 Step-by-step visual guide

---

## 🔌 API Endpoints

### 1. Get Station Accessibility

```http
GET /v1/accessibility/stations/:stationId

Response:
{
  "stationId": "2_gangnam",
  "accessibility": {
    "wheelchairAccessible": true,
    "elevatorStatus": "WORKING",
    "elevatorCount": 4,
    "stepCount": 0,
    ...
  }
}
```

### 2. Get All Accessible Stations

```http
GET /v1/accessibility/stations?wheelchairOnly=true

Response:
{
  "count": 8,
  "stations": [...],
  "filters": {
    "wheelchairOnly": true,
    "elevatorOnly": false
  }
}
```

### 3. Find Accessible Routes

```http
POST /v1/routes

Request:
{
  "origin": { "lat": 37.498095, "lng": 127.027610 },
  "destination": { "lat": 37.554648, "lng": 126.970730 },
  "accessibilityProfile": {
    "accessibilityTypes": ["WHEELCHAIR"],
    "preferences": {
      "avoidStairs": true,
      "requireElevator": true,
      "maxTransfers": 2
    }
  },
  "includeVoiceGuidance": true
}

Response:
{
  "routes": [
    {
      "id": "route-1",
      "totalDuration": 1800,
      "accessibilityScore": {
        "overall": 92,
        "wheelchair": 95,
        "visualImpairment": 88,
        "hearingImpairment": 90,
        "cognitive": 85,
        "details": {
          "stepFree": true,
          "elevatorsWorking": true,
          "lowFloorBusesAvailable": true,
          "tactileGuidance": true,
          "audioSupport": true,
          "visualSupport": true,
          "cognitiveSupport": true
        }
      },
      "accessibilityWarnings": [
        "🔧 2_hongik: 엘리베이터 점검 중 (Elevator under maintenance)"
      ],
      "voiceGuidance": [
        {
          "id": "route-1-0-start",
          "distance": 0,
          "direction": "START",
          "landmark": "강남역",
          "instruction": "출발지에서 지하철을 타고 서울역로 가세요.",
          "hapticPattern": "short"
        }
      ],
      ...
    }
  ],
  "metadata": {
    "accessibilityFilterApplied": true,
    "filteredRoutesCount": 3
  }
}
```

---

## 📊 Data Sources

### Current Implementation (MVP)

**Manual Data Entry:**
- 10 major stations with full accessibility data
- Sample elevator status (simulated)
- Baseline accessibility features

### Future Integration (Production)

**Seoul Open API:**
- Real-time elevator status: [Seoul Metro Elevator API](https://data.seoul.go.kr)
- Station facility information
- Low-floor bus real-time locations

**Third-party APIs:**
- Kakao Maps API: Geocoding, POI search
- Naver Maps API: Alternative route data
- Google Places API: Accessible restroom locations

---

## 🚀 Implementation Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Accessibility data models
- [x] User profile system
- [x] Accessibility scoring algorithm
- [x] Route filtering logic
- [x] Voice guidance generation
- [x] Mobile context provider
- [x] Settings screen

### 🔄 Phase 2: UI Enhancement (In Progress)
- [ ] Accessibility badges on route cards
- [ ] Warning display system
- [ ] Easy Mode UI implementation
- [ ] High contrast theme
- [ ] Large button mode

### 📋 Phase 3: Data Expansion (Planned)
- [ ] Expand from 10 to 50+ stations
- [ ] Add bus stop accessibility data
- [ ] Integrate Seoul Metro elevator API
- [ ] Add low-floor bus tracking
- [ ] Accessible restroom database

### 🔊 Phase 4: Audio Features (Planned)
- [ ] Text-to-speech engine integration
- [ ] Voice instruction playback
- [ ] Haptic feedback patterns
- [ ] Background audio navigation

### 🎓 Phase 5: Practice Mode (Planned)
- [ ] Station photo library
- [ ] Video walkthroughs
- [ ] Virtual route rehearsal
- [ ] Companion alert system

### 🌐 Phase 6: Real-time Integration (Planned)
- [ ] Live elevator status
- [ ] Real-time bus tracking
- [ ] Crowding information
- [ ] Delay notifications

---

## 🧪 Testing Accessibility Features

### Test User Profiles

#### Profile 1: Wheelchair User
```typescript
{
  accessibilityTypes: ['WHEELCHAIR'],
  preferences: {
    avoidStairs: true,
    requireElevator: true,
    maxTransfers: 2,
    maxWalkingDistance: 500
  }
}
```

**Expected Results:**
- Only step-free routes
- All stations must have working elevators
- Maximum 2 transfers
- Walking distance ≤ 500m

#### Profile 2: Visually Impaired
```typescript
{
  accessibilityTypes: ['VISUAL_IMPAIRMENT'],
  preferences: {
    requireAudioGuidance: true,
    maxTransfers: 1
  }
}
```

**Expected Results:**
- Voice guidance included
- Routes with tactile paving prioritized
- Simple routes with minimal transfers

#### Profile 3: Cognitive Disability
```typescript
{
  accessibilityTypes: ['COGNITIVE'],
  preferences: {
    requireSimpleRoutes: true,
    extraTransferTime: 5,
    maxTransfers: 1
  }
}
```

**Expected Results:**
- Direct routes preferred
- Extra 5 minutes per transfer
- Maximum 1 transfer

---

## 💡 Best Practices

### For Developers

1. **Always Test with Screen Readers**
   - iOS: VoiceOver
   - Android: TalkBack

2. **Use Semantic HTML/React Native Components**
   - Proper accessibility labels
   - ARIA attributes (web)
   - accessibilityLabel (mobile)

3. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - 3:1 for large text
   - Provide high contrast mode

4. **Keyboard Navigation**
   - All features accessible via keyboard
   - Logical tab order

5. **Error Handling**
   - Clear error messages
   - Suggest solutions
   - Never rely on color alone

### For Content Creators

1. **Write Clear Instructions**
   - Simple language
   - Short sentences
   - Active voice

2. **Provide Alternatives**
   - Text alternatives for images
   - Captions for audio
   - Transcripts for video

3. **Test with Real Users**
   - Conduct usability testing
   - Gather feedback
   - Iterate based on insights

---

## 📞 Support & Resources

### Accessibility Resources
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Seoul Metro Accessibility Guide](https://www.seoulmetro.co.kr)

### Contact
- Email: accessibility@seoul-transit.app
- Issue Tracker: [GitHub Issues](https://github.com/iam10chung-cloud/seoul-transit2/issues)
- Accessibility Feedback: Tag with `accessibility` label

---

## 🏆 Impact Goals

### Metrics to Track
- ✅ % of users with accessibility profiles enabled
- ✅ Average accessibility score of selected routes
- ✅ User satisfaction ratings
- ✅ Time saved compared to standard navigation
- ✅ Number of successful independent journeys

### Target Outcomes
- **2025 Q1**: 1,000+ users with accessibility profiles
- **2025 Q2**: 80%+ routes with accessibility score > 80
- **2025 Q3**: Partner with disability advocacy groups
- **2025 Q4**: Government recognition & funding

---

## 🙏 Acknowledgments

This project is inspired by the needs of Seoul's 2.5+ million residents with disabilities and their quest for independent, accessible transportation.

**Dedicated to making Seoul's public transit truly accessible for everyone.** ♿🚇✨

# 서울 대중교통 길찾기 - 사용 매뉴얼 (한국어)

## 📱 목차

1. [시작하기](#1-시작하기)
2. [서버 실행하기](#2-서버-실행하기)
3. [모바일 앱 실행하기](#3-모바일-앱-실행하기)
4. [앱 사용 방법](#4-앱-사용-방법)
5. [문제 해결](#5-문제-해결)
6. [개발 가이드](#6-개발-가이드)

---

## 1. 시작하기

### 1.1 필요한 프로그램 설치

#### 모든 운영체제 공통

**1) Node.js 18 이상**
- 다운로드: https://nodejs.org/ko/
- 설치 후 확인:
  ```bash
  node --version
  npm --version
  ```

**2) Expo CLI**
```bash
npm install -g expo-cli
```

**3) Git**
- macOS: 기본 설치되어 있음
- Windows: https://git-scm.com/download/win

#### 모바일 앱 실행 방법 선택

**옵션 1: 실제 스마트폰 사용 (권장)**
- iOS: App Store에서 "Expo Go" 설치
- Android: Play Store에서 "Expo Go" 설치
- 별도 설정 불필요, 가장 간단함

**옵션 2: 시뮬레이터/에뮬레이터**
- iOS (macOS만 가능): Xcode 설치 필요
- Android: Android Studio 설치 필요

---

## 2. 서버 실행하기

### 2.1 서버 설치 및 설정

```bash
# 1. 서버 폴더로 이동
cd server

# 2. 필요한 패키지 설치 (최초 1회만)
npm install

# 3. 환경 설정 파일 생성
cp .env.example .env

# Windows에서는:
# Copy-Item .env.example .env
```

### 2.2 서버 시작

```bash
# server 폴더에서 실행
npm run dev
```

**성공 메시지:**
```
🚇 Seoul Transit API server running on port 8080
Environment: development
```

### 2.3 서버 작동 확인

**새 터미널 창을 열고:**

**macOS/Linux:**
```bash
curl http://localhost:8080/v1/health
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:8080/v1/health
```

**정상 응답:**
```json
{
  "ok": true,
  "time": "2024-01-14T10:30:00.000Z",
  "service": "seoul-transit-api",
  "version": "1.0.0"
}
```

---

## 3. 모바일 앱 실행하기

### 3.1 모바일 앱 설치 및 설정

```bash
# 1. 모바일 폴더로 이동
cd mobile

# 2. 필요한 패키지 설치 (최초 1회만)
npm install

# 3. 환경 설정 파일 생성
cp .env.example .env

# Windows에서는:
# Copy-Item .env.example .env
```

### 3.2 실제 스마트폰으로 실행하는 경우 (권장)

#### 중요: 네트워크 설정

**1) 컴퓨터의 IP 주소 확인**

**macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```powershell
ipconfig
```

예시 출력:
```
IPv4 주소: 192.168.1.105
```

**2) mobile/.env 파일 수정**

텍스트 에디터로 `mobile/.env` 파일을 열고:

```bash
# 변경 전:
API_BASE_URL=http://localhost:8080

# 변경 후 (자신의 IP 주소로):
API_BASE_URL=http://192.168.1.105:8080
```

**⚠️ 중요:**
- 컴퓨터와 스마트폰이 **같은 WiFi**에 연결되어 있어야 합니다
- 공용 WiFi나 회사 WiFi는 연결이 차단될 수 있습니다

**3) Expo 앱 시작**

```bash
# mobile 폴더에서 실행
npm start
```

**4) QR 코드 스캔**

- **iOS:** 카메라 앱으로 QR 코드 스캔
- **Android:** Expo Go 앱으로 QR 코드 스캔

### 3.3 시뮬레이터/에뮬레이터로 실행하는 경우

**mobile/.env 설정은 기본값 사용:**
```bash
API_BASE_URL=http://localhost:8080
```

**Expo 시작 후:**

```bash
npm start

# 터미널에서:
# iOS 시뮬레이터: i 키 입력
# Android 에뮬레이터: a 키 입력
```

---

## 4. 앱 사용 방법

### 4.1 홈 화면

<img src="screenshot-home.png" alt="홈 화면" width="300"/>

**기능:**
1. **출발지 입력:** 위도, 경도 좌표 입력
2. **도착지 입력:** 위도, 경도 좌표 입력
3. **⇅ 바꾸기 버튼:** 출발지와 도착지 위치 교환
4. **경로 우선순위 선택:**
   - **가장 빠른:** 총 소요시간이 가장 짧은 경로
   - **최소 환승:** 환승 횟수가 가장 적은 경로
5. **경로 찾기 버튼:** 검색 시작

**기본 좌표 (테스트용):**
- 출발: 강남역 (37.498095, 127.027610)
- 도착: 서울역 (37.554648, 126.970730)

### 4.2 검색 결과 화면

**표시 정보:**
- 찾은 경로 개수 (최대 3개)
- 각 경로별 요약 정보:
  - ⏱️ **총 소요시간** (분 단위)
  - 🔄 **환승 횟수**
  - 🚶 **도보 시간**
  - 📏 **총 거리** (km)
  - 🚇🚌 **이용 교통수단** 요약
  - ✅ **실시간 신뢰도** (%)

**경로 카드 탭:** 상세 정보 화면으로 이동

### 4.3 경로 상세 화면

**상단 정보:**
- 🕐 출발 시각
- ⏱️ 총 소요시간
- 🕑 도착 예상시각
- 📊 통계 (환승, 도보, 거리)
- 📈 실시간 신뢰도 바

**단계별 안내:**

각 구간마다 표시:
- 🚶 **도보:** 거리와 소요시간
- 🚇 **지하철:** 호선, 정류장 수, 소요시간
- 🚌 **버스:** 노선번호, 정류장 수, 소요시간

**색상 구분:**
- 회색: 도보
- 파란색: 지하철
- 초록색: 버스

### 4.4 실제 사용 예시

**예시 1: 강남역 → 서울역**

```
1. 홈 화면에서 기본 좌표 확인
   출발: 37.498095, 127.027610 (강남역)
   도착: 37.554648, 126.970730 (서울역)

2. "가장 빠른" 선택

3. "경로 찾기" 버튼 클릭

4. 결과 화면에서 2개의 경로 확인:
   - 경로 1: 지하철 (30분, 환승 1회)
   - 경로 2: 버스 (35분, 환승 없음)

5. 경로 탭하여 상세 정보 확인
```

**예시 2: 출발지와 도착지 바꾸기**

```
1. 홈 화면에서 "⇅ 바꾸기" 버튼 클릭
2. 출발지와 도착지가 자동으로 교환됨
3. 다시 검색
```

---

## 5. 문제 해결

### 5.1 서버 관련 문제

**❌ 문제: "포트 8080이 이미 사용 중입니다"**

**해결 방법 1: 다른 프로그램 종료**

**macOS/Linux:**
```bash
# 8080 포트 사용 프로세스 찾기
lsof -i :8080

# 프로세스 종료 (PID는 위 명령어에서 확인)
kill -9 <PID>
```

**Windows:**
```powershell
# 8080 포트 사용 프로세스 찾기
netstat -ano | findstr :8080

# 프로세스 종료 (PID는 위 명령어에서 확인)
taskkill /PID <PID> /F
```

**해결 방법 2: 다른 포트 사용**

`server/.env` 파일 수정:
```bash
PORT=8081
```

그리고 `mobile/.env`도 수정:
```bash
API_BASE_URL=http://localhost:8081
# 또는 실제 IP 사용 시:
API_BASE_URL=http://192.168.1.XXX:8081
```

---

**❌ 문제: "Cannot find module" 오류**

**해결 방법:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**❌ 문제: TypeScript 컴파일 오류**

**해결 방법:**
```bash
cd server
npm run build
# 오류 확인 후 수정
npm run dev
```

---

### 5.2 모바일 앱 관련 문제

**❌ 문제: "서버에 연결할 수 없습니다"**

**체크리스트:**

1. ✅ 서버가 실행 중인가?
   ```bash
   curl http://localhost:8080/v1/health
   ```

2. ✅ 실제 기기 사용 시 같은 WiFi인가?
   - 컴퓨터와 스마트폰 모두 같은 WiFi 확인

3. ✅ mobile/.env 파일 확인
   ```bash
   # 실제 기기의 경우:
   API_BASE_URL=http://192.168.1.XXX:8080
   
   # 시뮬레이터의 경우:
   API_BASE_URL=http://localhost:8080
   ```

4. ✅ 방화벽 확인
   - macOS: 시스템 환경설정 → 보안 및 개인정보보호 → 방화벽
   - Windows: 제어판 → Windows Defender 방화벽

5. ✅ Expo 재시작
   ```bash
   # mobile 폴더에서
   npm start
   # 또는 터미널에서 'r' 키 입력
   ```

---

**❌ 문제: "Unable to resolve module @env"**

**해결 방법:**
```bash
cd mobile
npx expo start -c  # 캐시 삭제하고 시작
```

---

**❌ 문제: QR 코드가 스캔되지 않음**

**해결 방법: 터널 모드 사용**
```bash
cd mobile
npx expo start --tunnel
```

---

**❌ 문제: 앱이 빈 화면만 표시**

**해결 방법:**
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

---

### 5.3 일반적인 문제

**❌ 문제: 경로 검색이 실패함**

**현재 상태 확인:**
- 현재는 **테스트용 가상 데이터**를 사용합니다
- 실제 서울 대중교통 데이터는 아직 연결되지 않았습니다
- 개발 진행 사항은 `docs/NEXT_STEPS.md` 참고

**임시 해결:**
- 기본 좌표(강남역 → 서울역) 사용
- 비슷한 범위의 서울 지역 좌표 사용

---

**❌ 문제: 화면이 느리게 로딩됨**

**해결 방법:**
```bash
# 모바일 앱 개발자 메뉴 열기
# - 실제 기기: 기기 흔들기
# - iOS 시뮬레이터: Cmd+D
# - Android 에뮬레이터: Cmd+M (Mac) / Ctrl+M (Windows)

# "Reload" 선택
```

---

## 6. 개발 가이드

### 6.1 코드 수정 시 자동 반영

**서버 코드 수정:**
- `server/src/` 폴더의 파일 수정
- 저장하면 자동으로 재시작됨 (nodemon)
- 터미널에서 재시작 메시지 확인

**모바일 코드 수정:**
- `mobile/src/` 폴더의 파일 수정
- 저장하면 자동으로 앱이 새로고침됨 (Hot Reload)
- 변경사항이 즉시 반영됨

### 6.2 로그 확인

**서버 로그:**
```bash
# server 폴더에서 실행 중인 터미널에서 확인
# 모든 HTTP 요청과 응답이 표시됨
```

**모바일 로그:**
```bash
# Expo 터미널에서 확인
# 또는 개발자 메뉴 → "Debug Remote JS" 선택
# Chrome DevTools에서 Console 탭 확인
```

### 6.3 디버깅 모드

**상세 로그 활성화:**

`server/.env` 파일 수정:
```bash
LOG_LEVEL=debug
```

서버 재시작 후 모든 상세 로그 확인 가능

### 6.4 API 테스트

**Postman 사용 (권장):**

1. Postman 다운로드: https://www.postman.com/downloads/
2. 새 요청 생성:
   - Method: POST
   - URL: `http://localhost:8080/v1/routes`
   - Body → raw → JSON:
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
     "preference": "FASTEST"
   }
   ```
3. Send 버튼 클릭

**curl 사용:**

```bash
curl -X POST http://localhost:8080/v1/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 37.498095, "lng": 127.027610},
    "destination": {"lat": 37.554648, "lng": 126.970730},
    "preference": "FASTEST"
  }'
```

### 6.5 주요 파일 위치

**서버 관련:**
- API 엔드포인트: `server/src/routes/`
- 가상 데이터 응답: `server/src/routes/routes.ts` (40번째 줄부터)
- 타입 정의: `server/src/types/api.ts`
- 로깅 설정: `server/src/utils/logger.ts`

**모바일 관련:**
- 홈 화면: `mobile/src/screens/HomeScreen.tsx`
- 결과 화면: `mobile/src/screens/ResultsScreen.tsx`
- 상세 화면: `mobile/src/screens/RouteDetailScreen.tsx`
- API 클라이언트: `mobile/src/services/api.ts`

---

## 7. 자주 묻는 질문 (FAQ)

**Q1: 실제 서울 지하철/버스 데이터는 언제 연결되나요?**

A: 현재는 MVP 단계로 가상 데이터를 사용합니다. 실제 데이터 연결은 다음 단계이며, `docs/NEXT_STEPS.md` 파일에 상세한 로드맵이 있습니다.

---

**Q2: 현재 좌표만 입력 가능한데, 주소 검색은 언제 추가되나요?**

A: Phase 4 (지오코딩)에서 추가될 예정입니다. 카카오맵 또는 네이버 지도 API를 연동하여 주소 검색과 지도 핀 선택 기능을 추가할 계획입니다.

---

**Q3: iPhone과 Android 둘 다 지원하나요?**

A: 네, React Native를 사용하여 iOS와 Android를 모두 지원합니다.

---

**Q4: WiFi 없이 모바일 데이터로도 테스트 가능한가요?**

A: 로컬 개발 환경에서는 같은 WiFi가 필요합니다. 서버를 클라우드에 배포하면 모바일 데이터로도 사용 가능합니다.

---

**Q5: 지도에서 경로를 볼 수 있나요?**

A: 아직 지도 기능은 추가되지 않았습니다. Phase 5에서 지도 뷰와 경로 표시 기능을 추가할 예정입니다.

---

**Q6: 실시간 도착 정보는 실제인가요?**

A: 현재는 가상 데이터입니다. Phase 3에서 서울 열린 데이터 광장 API를 연동하여 실제 실시간 정보를 제공할 예정입니다.

---

**Q7: 프로젝트를 배포하려면 어떻게 하나요?**

A: 
- 서버: AWS, GCP, Azure 등 클라우드 서비스에 배포
- 모바일: Expo EAS Build를 사용하여 앱 스토어/플레이 스토어에 배포
- 상세 가이드는 `docs/NEXT_STEPS.md` Phase 7 참고

---

## 8. 유용한 명령어 모음

### 서버

```bash
# 개발 서버 시작 (자동 재시작)
cd server && npm run dev

# 프로덕션 빌드
cd server && npm run build

# 프로덕션 실행
cd server && npm start

# 의존성 재설치
cd server && rm -rf node_modules && npm install
```

### 모바일

```bash
# 개발 서버 시작
cd mobile && npm start

# 캐시 삭제하고 시작
cd mobile && npx expo start -c

# iOS 시뮬레이터로 실행
cd mobile && npm start
# 터미널에서 'i' 입력

# Android 에뮬레이터로 실행
cd mobile && npm start
# 터미널에서 'a' 입력

# 의존성 재설치
cd mobile && rm -rf node_modules && npm install
```

### 테스트

```bash
# 서버 헬스 체크
curl http://localhost:8080/v1/health

# 경로 검색 테스트
curl -X POST http://localhost:8080/v1/routes \
  -H "Content-Type: application/json" \
  -d '{"origin":{"lat":37.498095,"lng":127.027610},"destination":{"lat":37.554648,"lng":126.970730}}'
```

---

## 9. 추가 문서

더 자세한 정보는 다음 문서를 참고하세요:

- **영문 설치 가이드:** `docs/SETUP_GUIDE.md`
- **시스템 아키텍처:** `docs/ARCHITECTURE.md`
- **API 명세서:** `docs/API_CONTRACTS.md`
- **개발 로드맵:** `docs/NEXT_STEPS.md`
- **전체 요약:** `BUILD_SUMMARY.md`

---

## 10. 도움 받기

문제가 해결되지 않으면:

1. 터미널의 오류 메시지 확인
2. `server/.env`에서 `LOG_LEVEL=debug` 설정
3. 서버와 모바일 앱 모두 재시작
4. 위 문서들에서 관련 내용 검색

---

**개발을 시작할 준비가 되었습니다! 🚀**

서버를 실행하고 스마트폰에서 Expo Go로 QR 코드를 스캔하면 바로 앱을 사용할 수 있습니다.

**행운을 빕니다! 🚇✨**

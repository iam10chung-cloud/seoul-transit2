# 🚇 서울 대중교통 길찾기 - 빠른 시작 가이드

## ⚡ 5분 안에 시작하기

### 1단계: 준비물 설치

```bash
# Node.js 18+ 설치 필요
# https://nodejs.org/ko/ 에서 다운로드

# Expo CLI 설치
npm install -g expo-cli

# 스마트폰에 "Expo Go" 앱 설치
# - iOS: App Store
# - Android: Play Store
```

---

### 2단계: 서버 실행

```bash
# 터미널 1
cd server
npm install
cp .env.example .env
npm run dev

# ✅ "server running on port 8080" 메시지 확인
```

---

### 3단계: 모바일 앱 실행

```bash
# 터미널 2
cd mobile
npm install
cp .env.example .env

# ⚠️ 실제 스마트폰 사용 시:
# 1. 컴퓨터 IP 확인: ifconfig (Mac) 또는 ipconfig (Windows)
# 2. mobile/.env 수정:
#    API_BASE_URL=http://YOUR_IP:8080

npm start

# ✅ QR 코드가 나타나면 스마트폰으로 스캔
```

---

### 4단계: 앱 사용하기

1. **출발지/도착지** 입력 (기본값: 강남역 → 서울역)
2. **경로 우선순위** 선택 (가장 빠른 / 최소 환승)
3. **경로 찾기** 버튼 클릭
4. 결과에서 원하는 경로 선택하여 상세 정보 확인

---

## 🎯 주요 화면

### 홈 화면
- 출발지/도착지 좌표 입력
- ⇅ 바꾸기 버튼
- 경로 우선순위 선택
- 경로 찾기 버튼

### 결과 화면
- 최대 3개의 경로 옵션
- 소요시간, 환승, 거리 정보
- 실시간 신뢰도 표시

### 상세 화면
- 단계별 이동 안내
- 🚶 도보, 🚇 지하철, 🚌 버스 구분
- 출발/도착 시각 표시

---

## 🔧 문제 해결 (1분 해결)

### 서버 연결 안됨
```bash
# 1. 서버 실행 중인지 확인
curl http://localhost:8080/v1/health

# 2. 실제 기기 사용 시 같은 WiFi 확인

# 3. mobile/.env 파일 확인
# 실제 기기: API_BASE_URL=http://192.168.1.XXX:8080
# 시뮬레이터: API_BASE_URL=http://localhost:8080

# 4. 앱 재시작 (터미널에서 'r' 입력)
```

### 포트 8080 사용 중
```bash
# 다른 포트 사용
# server/.env 수정: PORT=8081
# mobile/.env 수정: API_BASE_URL=http://localhost:8081
```

### 모듈을 찾을 수 없음
```bash
cd server
rm -rf node_modules
npm install
npm run dev
```

---

## 📱 테스트 좌표

**강남역 → 서울역 (기본값)**
```
출발: 37.498095, 127.027610
도착: 37.554648, 126.970730
```

**홍대입구역 → 잠실역**
```
출발: 37.557192, 126.925381
도착: 37.513294, 127.100388
```

**신촌역 → 강남역**
```
출발: 37.555946, 126.936893
도착: 37.498095, 127.027610
```

---

## 🎓 더 알아보기

- **전체 매뉴얼:** `docs/USER_MANUAL_KR.md`
- **영문 가이드:** `docs/SETUP_GUIDE.md`
- **개발 로드맵:** `docs/NEXT_STEPS.md`

---

## ✅ 체크리스트

시작 전 확인:
- [ ] Node.js 18+ 설치됨
- [ ] Expo Go 앱 설치됨 (스마트폰)
- [ ] 서버 실행 중 (포트 8080)
- [ ] 모바일 앱 실행 중
- [ ] 같은 WiFi 연결 (실제 기기)
- [ ] mobile/.env 파일 설정 완료

---

## 🚀 현재 상태

**✅ 작동 중:**
- 서버 API (3개 엔드포인트)
- 모바일 UI (3개 화면)
- 가상 경로 데이터 (테스트용)

**🔜 개발 예정:**
- 실제 서울 대중교통 데이터
- 실시간 도착 정보
- 주소 검색 기능
- 지도 뷰

---

**준비 완료! 이제 앱을 실행해보세요! 🎉**

문제가 있으면 `docs/USER_MANUAL_KR.md` 5장 "문제 해결" 참고

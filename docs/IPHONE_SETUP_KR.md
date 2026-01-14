# 📱 아이폰에서 Seoul Transit 앱 사용하기

## 🎯 목표

Windows PC에서 개발 서버를 실행하고, 아이폰에서 앱을 테스트합니다.

---

## ✅ 사전 준비사항

### **1. 아이폰에 Expo Go 설치**

1. **App Store** 열기
2. **"Expo Go"** 검색
3. **다운로드** 및 설치

### **2. 같은 WiFi 연결 확인**

⚠️ **매우 중요**: 컴퓨터와 아이폰이 **같은 WiFi 네트워크**에 연결되어 있어야 합니다!

- 공용 WiFi는 보안상 차단될 수 있습니다
- 가정용 WiFi 사용 권장

---

## 🖥️ 1단계: 서버 실행

### **CMD 창 1 - API 서버**

```cmd
cd C:\Users\user\Desktop\seoul-transit2\server
npm run dev
```

**성공 메시지:**
```
🚇 Seoul Transit API server running on port 8080
```

이 창은 **닫지 말고** 그대로 두세요!

---

## 📱 2단계: 모바일 앱 실행

### **CMD 창 2 - 모바일 앱**

```cmd
cd C:\Users\user\Desktop\seoul-transit2\mobile
npm start
```

---

## 🔧 문제 해결: 모듈 오류가 나는 경우

이전에 오류가 있었다면 완전히 재설치하세요:

```cmd
cd C:\Users\user\Desktop\seoul-transit2\mobile

rmdir /s /q node_modules
del package-lock.json

npm cache clean --force

npm install

npm start
```

---

## 📲 3단계: 아이폰 설정

### **A. 컴퓨터 IP 주소 확인**

**새 CMD 창 (창 3):**

```cmd
ipconfig
```

**IPv4 주소**를 찾으세요. 예:
```
IPv4 Address: 192.168.1.105
```

이 숫자를 **메모**하세요! 📝

### **B. .env 파일 수정**

1. 파일 탐색기 열기
2. `C:\Users\user\Desktop\seoul-transit2\mobile` 폴더로 이동
3. `.env` 파일을 **메모장**으로 열기
4. 다음과 같이 수정:

```
API_BASE_URL=http://192.168.1.105:8080
```

**192.168.1.105를 자신의 IP로 바꾸세요!**

5. 저장하고 닫기

### **C. 앱 재시작**

CMD 창 2에서:
- **Ctrl+C** 눌러서 중단
- 다시 `npm start` 실행

---

## 📱 4단계: QR 코드 스캔

### **터널 모드로 시작 (추천)**

WiFi 연결이 잘 안 되면 터널 모드를 사용하세요:

```cmd
npm start -- --tunnel
```

이 모드는 인터넷을 통해 연결하므로 WiFi 문제를 우회합니다!

### **QR 코드가 나타나면:**

1. **아이폰에서 Expo Go 앱** 열기
2. **"Scan QR code"** 버튼 탭
3. 카메라가 켜지면 **PC 화면의 QR 코드**를 스캔
4. 자동으로 앱이 로딩됩니다!

또는:

1. **아이폰 카메라 앱** 열기
2. **QR 코드**를 스캔
3. 알림이 나타나면 탭
4. **Expo Go로 열기** 선택

---

## ⏳ 5단계: 앱 로딩 대기

처음 실행 시 1-2분 정도 걸립니다:

```
Building JavaScript bundle... [█████████░] 85%
```

인내심을 가지고 기다리세요! ☕

---

## 🎉 6단계: 앱 사용하기

앱이 열리면:

### **홈 화면**
- 출발지: 37.498095, 127.027610 (강남역)
- 도착지: 37.554648, 126.970730 (서울역)
- "가장 빠른" 또는 "최소 환승" 선택
- **"경로 찾기"** 버튼 탭!

### **결과 화면**
- 2개의 경로 옵션이 나타납니다
- 각 경로를 탭해서 상세 정보 확인

### **상세 화면**
- 단계별 이동 방법
- 도보, 지하철, 버스 구분
- 소요 시간과 거리

---

## 🔧 문제 해결

### **문제 1: QR 코드 스캔 후 "Network response timed out"**

**해결:**
```cmd
npm start -- --tunnel
```

터널 모드를 사용하세요!

---

### **문제 2: "Unable to connect to server"**

**체크리스트:**

1. ✅ 서버가 실행 중인가? (CMD 창 1)
2. ✅ 모바일 앱이 실행 중인가? (CMD 창 2)
3. ✅ 같은 WiFi에 연결되어 있나?
4. ✅ `.env` 파일에 올바른 IP가 설정되어 있나?
5. ✅ Windows 방화벽이 차단하고 있지 않나?

**방화벽 확인:**
- Windows 설정 → 업데이트 및 보안 → Windows 보안 → 방화벽 및 네트워크 보호
- Node.js 접근 허용 확인

---

### **문제 3: "Bundling failed" 오류**

**해결:**

```cmd
cd C:\Users\user\Desktop\seoul-transit2\mobile
npm run clean
npm start
```

---

### **문제 4: 앱이 계속 로딩 중**

**해결:**

1. Expo Go 앱 완전히 종료
2. 아이폰 재시작
3. QR 코드 다시 스캔

---

## 💡 팁과 트릭

### **개발자 메뉴 열기**

앱 실행 중 **아이폰을 흔들면** 개발자 메뉴가 열립니다:
- Reload - 앱 새로고침
- Debug Remote JS - 디버깅
- Show Performance Monitor - 성능 확인

### **빠른 새로고침**

코드를 수정하면 **자동으로 새로고침** 됩니다! (Hot Reload)

### **로그 확인**

CMD 창 2에서 앱의 모든 로그를 볼 수 있습니다.

---

## 🌐 대안: 웹 브라우저로 테스트

모바일 설정이 어려우면 아이폰 브라우저에서 테스트하세요:

1. PC에서 IP 주소 확인 (예: 192.168.1.105)
2. 아이폰 Safari 열기
3. 주소창에 입력: `http://192.168.1.105:19006`
4. 웹 버전 앱이 열립니다!

---

## 📋 전체 명령어 요약

### **서버 (CMD 창 1):**
```cmd
cd C:\Users\user\Desktop\seoul-transit2\server
npm run dev
```

### **모바일 앱 (CMD 창 2):**
```cmd
cd C:\Users\user\Desktop\seoul-transit2\mobile
npm start
```

### **터널 모드 (WiFi 문제 시):**
```cmd
npm start -- --tunnel
```

### **완전 재설치 (오류 시):**
```cmd
npm run clean
npm start
```

---

## ✅ 성공 체크리스트

- [ ] Expo Go 앱 설치 완료
- [ ] 서버 실행 중 (포트 8080)
- [ ] 모바일 앱 실행 중
- [ ] 컴퓨터 IP 주소 확인
- [ ] .env 파일 수정 완료
- [ ] 같은 WiFi 연결 확인
- [ ] QR 코드 스캔 성공
- [ ] 앱이 아이폰에서 실행 중!

---

## 🎯 다음 단계

앱이 성공적으로 실행되면:

1. 다양한 좌표로 경로 검색 테스트
2. UI 개선 및 커스터마이징
3. 실제 서울 데이터 연동 준비
4. 추가 기능 개발

---

## 🆘 도움이 필요하면

1. CMD 창의 오류 메시지 캡처
2. 아이폰 화면 스크린샷
3. 어느 단계에서 문제가 생겼는지 설명

**행운을 빕니다! 🚀📱✨**

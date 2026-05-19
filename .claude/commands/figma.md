# /figma — Figma → Storybook 컴포넌트 변환 + 자동 검증

Figma URL을 받아 YDS 2.0 기반 React 컴포넌트를 생성하고, Storybook에서 렌더링 결과를 원본과 비교해 자가 수정합니다.

## 실행 전 확인
- Storybook dev server가 실행 중이어야 합니다 (`npm run dev` → `localhost:5173`)
- 실행 중이지 않으면 먼저 시작하세요

## Step 1 — Figma 디자인 추출
Figma MCP로 URL의 `fileKey`와 `nodeId`를 파싱하고:
1. `get_design_context` — 레이아웃, 스타일, 컴포넌트 구조 추출
2. `get_screenshot` — 원본 디자인 스크린샷 캡처 (비교 기준)

## Step 2 — 코드 생성 규칙
아래 규칙을 반드시 준수해 `src/components/` 아래에 컴포넌트를 생성합니다.

### YDS 2.0 토큰 사용 (`src/tokens.js`)
- **폰트**: `metaTokens.typography.meta_sf_{size}_{r|b}` — 예: `meta_sf_14_r: { size: 14, weight: 400, lineHeight: 19 }`
- **스페이싱**: `metaTokens.spacing.meta_s1~s13` — 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40px
- **라디우스**: `metaTokens.radius.meta_r1~r6, rfull` — 4, 8, 10, 12, 16, 20, 360px
- **컬러**: `metaTokens.colors.*` 에서 정확한 색상 참조
- **폰트 패밀리**: `"Pretendard, -apple-system, sans-serif"` 고정

### 이미지 처리
Figma 이미지 URL(figma.com 도메인)은 인증 없이 로드 불가 → 아래로 대체:
- 사람/라이프스타일: `https://picsum.photos/{width}/{height}?random={n}`
- 음식: `https://source.unsplash.com/{width}x{height}/?food`
- 상품: `https://source.unsplash.com/{width}x{height}/?product`
- 기타 일반: `https://picsum.photos/{width}/{height}`

### 컴포넌트 구조
```jsx
// src/components/{ComponentName}.jsx
import { metaTokens } from '../tokens';
const { typography, spacing, radius, colors } = metaTokens;

export default function ComponentName({ ...props }) {
  return ( ... );
}
```

### App.jsx 등록
생성한 컴포넌트를 `src/App.jsx`의 적절한 섹션에 추가해 Storybook에서 볼 수 있게 합니다.

## Step 3 — 자동 검증 루프 (최대 3회)

### 3-1. 렌더링 캡처
Chrome DevTools MCP로:
1. `localhost:5173` 열기 (이미 열려있으면 reload)
2. 해당 컴포넌트 섹션으로 스크롤 또는 직접 이동
3. `take_screenshot` — 렌더링 결과 캡처

### 3-2. 비교 분석
Figma 원본 스크린샷 vs Storybook 렌더링 스크린샷을 나란히 보며 차이점을 목록화:
- 간격(spacing), 색상, 타이포그래피, 라디우스, 정렬, 크기
- 이미지 로드 실패 여부 (`get_console_message`로 에러 확인)
- 보더, 그림자, 오버플로우

### 3-3. 수정 판단
- 차이 없음 → 완료
- 차이 있음 + 반복 < 3회 → 수정 후 Step 3 반복
- 3회 시도 후 여전히 차이 있음 → 남은 차이를 목록으로 보고하고 종료

## 완료 보고
최종 스크린샷과 함께:
- 생성된 파일 경로
- 수정 반복 횟수
- 해결된 차이점 목록
- 남은 차이점 (있다면)

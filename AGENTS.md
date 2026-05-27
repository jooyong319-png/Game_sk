# 4명의 AI Claude 협업 규칙

이 프로젝트는 **4명의 Claude 에이전트가 자율적으로 협업**해서 만드는 게임 출시 캘린더입니다. 각 에이전트는 정해진 시간에 깨어나서 자기 역할을 수행하고, GitHub과 CHAT.md를 통해 서로 소통합니다.

## 1. 4명의 역할

### 📚 리서처 Claude (Researcher)
- **깨어나는 시간**: 매일 아침 9:00
- **주 업무**:
  - WebSearch로 신규/예정 게임 정보 찾기 (3개 카테고리)
  - `data/games.json` 파일 업데이트 (중복 제거, 날짜 갱신, 신규 추가)
  - `last_updated` 필드 갱신
  - `CHAT.md`에 "오늘 추가/갱신한 게임 N개" 보고
  - git commit + push
- **금지**: 프론트엔드 코드 수정 금지, JSON 스키마 임의 변경 금지
- **리서치 카테고리**:
  - `mobile_kr`: 국내 출시 모바일 게임
  - `pc_console_kr`: 국내 출시 PC/콘솔 게임
  - `global_aaa`: 글로벌 대작 게임

### 🎯 기획자 Claude (PM)
- **깨어나는 시간**: 4시간마다 정각 (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
- **주 업무**: 다음에 만들 기능 결정, PROJECT_STATUS.md의 TODO 갱신
- **금지**: 코드 직접 작성 금지, `data/games.json` 수정 금지 (리서처 영역)

### 💻 개발자 Claude (Dev)
- **깨어나는 시간**: 4시간마다 +20분
- **주 업무**: 기획자가 정한 가장 위 TODO 1개만 구현, 프론트엔드 코드 수정
- **금지**: `data/games.json` 수정 금지 (리서처 영역)

### 🔍 QA Claude
- **깨어나는 시간**: 4시간마다 +40분
- **주 업무**: 배포된 https://game-sk.vercel.app/ 확인, 버그/개선 제안 등록
- **금지**: 코드/데이터 직접 수정 금지

## 2. 영역 분리

- **리서처**: `data/*.json`, `CHAT.md`, `PROJECT_STATUS.md`
- **기획자**: `CHAT.md`, `PROJECT_STATUS.md`, `AGENTS.md`
- **개발자**: `*.html`, `*.css`, `*.js` (단, `data/*` 제외), `CHAT.md`, `PROJECT_STATUS.md`
- **QA**: `CHAT.md`, `PROJECT_STATUS.md`만 수정

## 3. 작업 흐름

```
매일 09:00  → 리서처: games.json 업데이트
4시간:00    → 기획자: 다음 TODO 결정
4시간:20    → 개발자: TODO 보고 코드 작성, push
4시간:40    → QA: 배포된 사이트 점검
```

## 4. data/games.json 스키마

```json
{
  "schema_version": 1,
  "last_updated": "ISO 날짜",
  "last_researched_by": "...",
  "categories": { "mobile_kr": "...", "pc_console_kr": "...", "global_aaa": "..." },
  "games": [
    {
      "id": "고유-슬러그-2026",
      "name_ko": "한국어명",
      "name_en": "English",
      "release_date": "2026-MM-DD",
      "release_date_approx": false,
      "category": "mobile_kr | pc_console_kr | global_aaa",
      "platforms": ["PC", "PS5", ...],
      "developer": "...",
      "publisher": "...",
      "description": "한 줄 설명",
      "genres": ["RPG", ...],
      "image_url": null,
      "source_url": "출처 URL"
    }
  ]
}
```

## 5. Phase 1 목표

- [x] 정적 JSON 기반 데이터 구조
- [x] 카테고리/플랫폼/기간 필터
- [x] D-Day 표시 + 출시 임박 강조
- [ ] 게임 카드 클릭 시 상세 모달
- [ ] 검색 기능 (게임명)
- [ ] 위시리스트 (localStorage)
- [ ] 카테고리별 개수 뱃지

## 6. 절대 규칙

1. 자기 영역만 손대기
2. 한 사이클에 한 가지만
3. 항상 PROJECT_STATUS.md, CHAT.md 먼저 읽기
4. 3사이클 동안 같은 자리면 IDEAS로 이동

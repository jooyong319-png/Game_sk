# 프로젝트 현재 상태

마지막 갱신: 2026-05-29 15:46 (개발자 — 퀵칩 필터 행 이동+모바일 가로 스크롤 완료)

## 현재 단계
Phase 1 — 정적 JSON 기반 게임 출시 캘린더 (3개 카테고리)

## 🔁 방향 (2026-05-27 유지)
메인 뷰를 월간 캘린더로 전환 중. 카드 그리드는 "리스트 뷰"로 보존 → 5단계 토글에서 정리.
캘린더 1·2단계 완료. 남은 3·4·5단계를 한 사이클당 1개씩 진행.

## 아키텍처
- **프론트** → `/data/games.json` (리서처 Claude가 매일 9시 갱신)
- RAWG API 의존성 없음. 모든 데이터는 리서처 Claude가 WebSearch로 큐레이션.

## 완료한 기능
- [x] 프로젝트 스켈레톤 (HTML/CSS/JS)
- [x] 정적 JSON 데이터 파일 (`data/games.json`)
- [x] 카테고리 필터 (국내 모바일 / 국내 PC/콘솔 / 글로벌 대작)
- [x] 플랫폼 필터 (PC, PS5, Xbox, Switch, iOS, Android)
- [x] 기간 필터 (30일~1년, 전체)
- [x] D-Day 표시 + 출시 임박 강조 (7일 이내 노란 보더)
- [x] 모바일 반응형
- [x] 다크 테마 디자인
- [x] 카테고리별 색상 구분
- [x] 게임 카드 클릭 시 상세 모달 (X / 배경 / ESC 닫기, body 스크롤 잠금)
- [x] 월간 캘린더 뷰 1단계: 그리드 뼈대 (현재 월, 7x6, 오늘 강조, 이전·다음 달 칸 흐리게)
- [x] 월간 캘린더 뷰 2단계: 셀에 그날 출시 게임 카테고리 점(dot) 표시 (최대 3개 + "+N", title 툴팁)
- [x] **푸터 교체 (운영자 정보 2줄, AI 협업 문구·GitHub 링크 제거)** — 개발자 완료(05-27 09:30), QA 소스 검증 통과(05-27 09:40). ※배포 CDN 캐시 반영은 시간 경과로 자연 해소.
- [x] 월간 캘린더 뷰 3단계: 이전/다음 달 네비게이션 (‹ › + 오늘로, calendarYear/calendarMonth 상태, 12월↔1월 연도 처리)
- [x] 월간 캘린더 뷰 4단계: 셀 클릭 → 그날 게임 목록 패널 → openModal 재사용 (× 닫기, 다른 날 클릭 시 교체)
- [x] 월간 캘린더 뷰 5단계: 캘린더/리스트 뷰 토글 (📅/📋, localStorage 'gcalen.view')
- [x] 검색 기능 (게임명 name_ko/name_en 부분일치, 결과 건수 표시, / 단축키)
- [x] 카테고리별 개수 뱃지 (필터 옵션 라벨에 현재 건수 표시)
- [x] 리스트 뷰 출시일별 그룹핑 (같은 release_date 게임을 `YYYY.MM.DD (요일)` 헤더 아래로 묶음, 헤더는 그리드 전체 폭)
- [x] **카테고리 통계 요약 한 줄** (헤더 아래 `#stats-summary`, 현재 데이터 기준 `국내 모바일 N · 국내 PC/콘솔 N · 글로벌 N · 신규서버 N · 총 N`)
- [x] **검색/필터 결과 0건 빈 상태 안내** (리스트 뷰 `.empty-state` — 위시리스트/검색/일반 분기 메시지, 기획자 스펙 문구 '필터를 바꿔보세요.' 정렬)
- [x] **상세 모달 '링크 복사' 버튼** (`🔗 링크 복사` → `현재URL?game={id}` 클립보드 복사, navigator.clipboard + execCommand 폴백, '링크 복사됨' 2초 토스트)

- [x] 공유 링크 진입(?game={id}) 시 해당 게임 상세 모달 자동 오픈 (데이터 로드 후 1회)
- [x] **[캘린더] 날짜 클릭 시 '그날 이후 출시 전체' 목록 패널** (release_date>=클릭일, 날짜별 그룹핑 리스트 재활용, 현재 필터 반영, openModal 재사용, 패널 세로 스크롤) — 개발자 완료 2026-05-29
- [x] **[가독성] 본문/메타 텍스트 대비·크기 상향** (`.desc`#cdd2db `.meta-row`#b3b8c2/0.85rem `.subtitle`#9aa0ac `.name-en`#8b92a0, `.info h3`1.1rem; 카테고리태그/링크 색 미변경) — 개발자 완료 2026-05-29
- [x] **[컨트롤 정리] 검색바 + 필터 한 줄 묶기** (`.controls-row` flex 래퍼, 데스크탑 가로/≤480px 세로, gap 1rem, 검색 input max-width 360px 유지) — 개발자 완료 2026-05-29
- [x] **[컨트롤 정리] 퀵칩을 필터 행 끝으로 이동 + 모바일 가로 스크롤** (`.quick-chips`를 `.controls-row` 안 필터 우측 끝으로 이동, 데스크탑 `margin-left:auto`, ≤480px `flex-wrap:nowrap;overflow-x:auto`·chip `flex:0 0 auto`) — 개발자 완료 2026-05-29

## 다음 TODO (우선순위 순)

> 갱신 2026-05-29 (기획자): **사용자 직접 요청 — "전체적으로 보기 편하게" 가독성/UX 개선**(USER_REQUESTS 활성). 4개 테마를 개발자 1시간 단위로 쪼갬. 한 사이클 1개. CSS only 항목은 회귀 위험 낮음.

### 1순위 — [캘린더] 셀 키우고 대표 게임명 1건 텍스트 노출
점(dot)만으로는 그날 뭐가 나오는지 안 보임. 셀을 키우고 그날 첫 게임명을 텍스트로(1줄 말줄임).
- `.calendar-grid .day` min-height 60→84(모바일 44→60). 렌더에서 그날 게임 있으면 첫 게임 `name_ko`를 `.day-game-label`(font 0.7rem, 1줄 ellipsis)로 추가, 점은 보조 유지.
- 예상 변경: script.js ~12줄, styles.css ~8줄. (50줄 넘으면 '셀 크기'와 '게임명 노출' 두 TODO로 분리)

### 2순위 — [정리] 핵심 색을 :root CSS 변수로 1차 토큰화
파일 하단에 "overrides earlier rule" 패치가 누적됨. 색부터 변수화해 일관성 확보(겉보기 변화 없음, 리팩터).
- `:root`에 `--bg`,`--surface`,`--border`,`--text`,`--text-dim`,`--text-faint`,`--accent` 정의 후 가장 많이 쓰이는 #0f1115/#1a1d24/#2a2e38/#e6e6e6/#4a90e2부터 치환. 한 번에 전부 X, 핵심 색만.
- 예상 변경: styles.css ~30줄(치환). 동작/외형 변화 없어야 함(QA: 시각 회귀 확인).

### 3순위 — 상세 모달에 유튜브 트레일러 검색 링크
모달 내 `▶ 트레일러 검색` 링크(새 탭): `https://www.youtube.com/results?search_query=` + encodeURIComponent(`{name_ko} 트레일러`).
- 임베드 아님(데이터 없음), 검색 링크만. 예상 변경: index.html +1, script.js +5.

### (큐 소진 후 후보) — 일간/주간 캘린더 뷰, 카카오 SDK 정식 공유(IDEAS)

## 알려진 버그 (BUGS)
- [2026-05-29] ✅ 해소 — (배포 지연) Chrome 실측 결과 배포본 gcalen.com 데이터 갱신 05-29 11:30·20건으로 최신화 확인. 직전 17건/05-28은 WebFetch 자체 캐시였음(실제 배포 정상). 빌드 파이프라인 이상 없음.
- [2026-05-29] ✅ 해소 — (데이터 중복) 프로야구 스피리츠 2026 중복(pro-spirit-2026 / pro-yakyu-spirits-2026). 리서처가 11:00 사이클에 pro-yakyu-spirits-2026 삭제. QA 확인: repo games.json 17건, release_date 2026-07-16 항목 1건(pro-spirit-2026)만 존재. 배포본 gcalen.com/data/games.json도 7/16 1건 확인.
- (코드 버그 없음) 05-27 09:40 QA가 배포본에 구 푸터 문구 잔존 보고 → 소스는 정상, Vercel/CDN 캐시 지연으로 판단. 시간 경과로 해소되었을 가능성 높음. 다음 QA 사이클에서 gcalen.com 재확인만 권고.

## 개선 아이디어 (IDEAS)
- 출시일별 그룹핑 (리스트 뷰 옵션)
- 한국 게임 vs 글로벌 게임 통계 차트
- 게임 트레일러 YouTube 임베드
- 카카오톡 공유 기능
- 일간/주간 뷰 (월간 안정화 후)

## 최근 변경 로그
- 2026-05-29 15:46 [개발자] 1순위 완료: [컨트롤 정리] 퀵칩을 필터 행 끝으로 이동 + 모바일 가로 스크롤. `.quick-chips` section을 `.controls-row` 안(필터 뒤)으로 이동, 데스크탑은 `margin-left:auto`로 우측 끝 정렬. ≤480px에서 `flex-wrap:nowrap;overflow-x:auto`+chip `flex:0 0 auto`로 줄바꿈 대신 가로 스크롤. 동작 로직 미변경(위치/스타일만). index.html(위치 이동), styles.css +6. CSS brace 201/201.
- 2026-05-29 [개발자] 1순위 완료: [컨트롤 정리] 검색바+필터 한 줄 묶기. `.controls-row` flex 래퍼로 `.search-bar`+`.filters`를 같은 행에(align-items:flex-end, gap 1rem, flex-wrap). 자식 margin-bottom 0, 래퍼에 margin-bottom 1.5rem. ≤480px는 flex-direction:column·align-items:stretch로 세로. 검색 input max-width 360px 유지. index.html +3(래퍼 div), styles.css +5. CSS brace 197/197.
- 2026-05-29 [개발자] 1순위 완료: [가독성] 본문/메타 텍스트 대비·크기 상향(CSS only). styles.css 6곳 수정 — .subtitle #888→#9aa0ac, .info h3 1.05→1.1rem, .name-en #777→#8b92a0, .desc #bbb→#cdd2db, .meta-row 0.8→0.85rem·#999→#b3b8c2. 카테고리 태그/링크 색·모달 .name-en 미변경. CSS brace 192/192.
- 2026-05-29 [개발자] 1순위 완료: 캘린더 날짜 클릭 시 'release_date>=클릭일' 게임을 날짜별 그룹핑(renderGroupedList 재활용)으로 패널 표시. 패널 제목 'YYYY.MM.DD (요일) 이후 출시 N건', 현재 카테고리/플랫폼/기간/주/위시리스트/검색 필터 반영(getActiveFilteredGames 헬퍼 추가), 빈 셀도 이후 목록 노출. openModal·위시리스트 토글 재사용, .day-panel-list max-height:60vh 스크롤. script.js 교체, styles.css +2. node --check 통과, CSS brace 192/192.
- 2026-05-29 [기획자] 사용자 요청: 캘린더 날짜 클릭 시 '그날 하루'→'그날 이후 전체 목록'으로 교체(그룹핑 리스트 재활용). 1순위 등록, 기존 가독성 TODO들은 2~6순위로 한 칸씩 밀림.
- 2026-05-29 [기획자] 사용자 직접 요청 '전체적으로 보기 편하게' 접수 → 가독성 4테마(텍스트 대비/컨트롤 정리/캘린더 셀/CSS 변수)를 1시간 단위 TODO 5개로 쪼개 1~5순위 등록. 기존 트레일러 검색은 6순위로 밀림.
- 2026-05-29 15:29 [개발자] 공유 링크 진입 시 ?game={id} 모달 자동 오픈 구현 (loadData 후 openGameFromUrl, script.js +8)
- 2026-05-29 [개발자] 1순위 완료: 상세 모달 '링크 복사' 버튼. modal-actions 버튼 추가 → 클릭 시 location.origin+pathname+`?game={id}` 클립보드 복사(navigator.clipboard, 비지원 시 textarea+execCommand 폴백) + #toast '링크 복사됨' 2초 노출. index.html 미변경(모달 본문은 script.js 템플릿), script.js +~30, styles.css +33. node --check 통과, CSS brace 191/191. ※2순위(공유링크 진입 자동 오픈)가 짝 TODO.
- 2026-05-29 [개발자] 1순위 완료: 검색/필터 0건 빈 상태 안내. 기존 `.empty-state` 구현(commit a191012, styles.css 371-373) 확인 → 일반 분기 메시지를 기획자 스펙 문구('필터를 바꿔보세요.')에 정확히 정렬. script.js 1줄. node --check 통과.
- 2026-05-29 [개발자] 카테고리 통계 요약 한 줄 구현(renderStatsSummary + #stats-summary, 헤더 아래 표시, 현재 데이터 기준 카테고리별 건수+총합). index.html +2, script.js +17, styles.css +7. node --check 통과, styles.css brace 186/186.
- 2026-05-29 [기획자] 빈 TODO 큐 → 구체 TODO 5개 확정(통계 요약/빈 상태/링크 복사/공유 자동오픈/트레일러 검색). 개발자 3사이클 대기 해소. IDEAS 통계·공유·트레일러 항목을 작은 단위로 승격.
- 2026-05-29 [개발자] 리스트 뷰 출시일별 그룹핑 구현(renderGroupedList + .date-group-header). 기획자 미지정 상태라 TODO 후보 큐 최상단(출시일 그룹핑)을 선택해 진행함을 명시. script.js +15, styles.css +10. node --check 통과.
- 2026-05-29 [개발자] 큐 재정비: 캘린더 3·4·5단계+검색+카테고리 뱃지가 코드에 이미 구현됨을 확인(node --check 통과, 스타일 존재) → 완료한 기능으로 이동. 코드 변경 없음(문서만 갱신).
- 2026-05-29 [기획자] 푸터 교체 완료 처리(완료한 기능으로 이동, USER_REQUESTS 아카이브). 캘린더 3·4·5단계를 1~3순위로 승격, 검색·카테고리 개수 뱃지 추가하여 큐 5개 유지.
- 2026-05-27 09:40 [QA] 푸터 소스 검증 통과, 배포 캐시 잔존 보고
- 2026-05-27 09:30 [개발자] 푸터 교체 완료 (운영자 정보 2줄)
- 2026-05-27 08:30 [기획자] 사용자 직접 요청 반영: 푸터 교체를 1순위로 끼움
- 2026-05-27 08:20 [개발자] 캘린더 2단계 완료
- 2026-05-27 07:50 [개발자] 캘린더 1단계 완료
- 2026-05-27 07:30 [기획자] 방향 전환: 메인 뷰를 월간 캘린더로
- 2026-05-27 07:20 [개발자] 게임 카드 클릭 시 상세 모달 구현
- 2026-05-27 [Phase 0.5] RAWG API 제거, 정적 JSON + 리서처 Claude 구조로 전환
- 2026-05-27 [Phase 0] 초기 스켈레톤 + GitHub/Vercel 셋업

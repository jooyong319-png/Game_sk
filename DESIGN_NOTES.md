# 🎨 디자인 노트 (UX/UI)

AI 디자이너 Claude가 배포된 사이트(https://gcalen.com/)를 직접 보고 작성하는 UX/UI 개선 제안 모음.
디자이너는 코드를 직접 수정하지 않는다. 여기 제안 → 기획자가 TODO로 → 개발자가 구현.

## 작성 형식
```

---

_(오래된 37 개 항목은 archive/DESIGN_NOTES_2026-05.md로 이동됨)_

## [2026-06-09 17:40] [디자이너] - 🔴 운영자 피드백: 미니멀 리셋(정리) 방향 + 메인/상세 목업 확정
**모드 전환: '외형 추가' → '정리(declutter)'.** 운영자(쌀먹닷컴) 라이브 피드백 — "디자인이 너무 지저분하다 / UX도 검색·필터 굳이 필요한가 / 게임 상세 페이지 디자인도 별로". 정리 방향 4축(① 색 가짓수 ② 그라데·이펙트 ③ 요소·밀도 ④ 칩 통일) + 검색/필터는 '3컬럼 정렬'(제거 아님), 적용 범위 '전부' 확정. 디자이너가 메인+상세 **정리 목업 2종 제시 → 운영자 '이 방향으로 확정·스펙 기록' 승인.** 아래는 그 목업의 hex/셀렉터/파일 스펙. **이번 사이클부터 기존 '추가' 큐(핫카드 카운트다운·필터 아이콘칩 등 장식 추가성)는 정리 방향과 상충하므로 보류 권장**, 진행 중인 #4a90e2 청산·SEO 랜딩 정합은 본 정리에 흡수. 디자이너는 코드 미수정(제안만).

### 진단 (지저분함의 정체 — 라이브 실측)
- **색 11개 경쟁·의미 중복**: 블루 3종(`--accent` #5b9dff 브랜드 / `cat-pc_console_kr` #64b5f6 / 폐기 #4a90e2) · 퍼플 2종(`--accent-2` #c98ad6 / `cat-global_aaa` #ba68c8) · warm 4종(`--accent-warm`/임박 #f5a623 / D-day #ff7a59 / `cat-new_server` #ff8a65 / 위시 #f5b400) · 카테고리 green #81c784. 같은 색이 표면마다 다른 뜻 → 산만.
- **이펙트 중첩**: HeroStrip `.card` 하나에 7중첩(베이스 `linear-gradient(135deg)` + `::before` radial glow + `.glowCat` color-mix box-shadow + `.glowDday` 주황 글로우+`scale(1.02)` + `.dday` text-shadow + `.today` `pulse` 애니메이션). 헤더 `::before` 듀얼 radial, 리스트 `.cardBanner` 세로 그라데+45° 해치(`repeating-linear-gradient`), 캘린더 `.cellHas` color-mix tint+inset 바, 상세 카드 카테고리 라디얼 백드롭.
- **밀도**: 메인이 광고슬롯→핫카드→토글→월탭12→필터3종→통계줄(4색)→캘린더→범례→패널20행 무여백 적층.
- **칩 혼재**: `genreChip`·`category-tag`·`releasedTag`·플랫폼 select가 제각각.

### A. 절제 시스템 (규칙 — 모든 표면 공통)
1. **색 = 3역할 고정.** (a) 인터랙션/브랜드 = 블루 `--accent` #5b9dff **하나**(#4a90e2·#64b5f6 흡수). (b) 임박 강조 = warm `--accent-warm` #f5a623 **하나**(#ff7a59·#ff4d4d·#f5b400 흡수, D-day는 '오늘=warm 진하게/임박=warm/그 외=muted #888' 한 계열). (c) 카테고리 4색 = '정보색'으로 격하 — **채도/명도 낮춰 점·얇은 좌측 바에서만**, 텍스트/큰 면엔 미사용. 목업 적용값: 모바일 #6f9c7a·PC #5f86b8·글로벌 #9a7bb0·신서버 #c08560(현 #81c784/#64b5f6/#ba68c8/#ff8a65에서 톤다운). 퍼플 `--accent-2` #c98ad6은 **h1 그라데 끝색으로만** 잔존.
2. **그라데 = 1곳 원칙.** 메인 `.site-header h1 a` 시그니처 클립(블루→퍼플)만 유지. 그 외 그라데/radial/해치/글로우 전부 제거 → **플랫 면 + 0.5~1px 보더**.
3. **칩 = 1언어.** 중립 글래스 칩 통일 — `background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text-faint); border-radius:999px; font-size:0.7rem; padding:0.1rem 0.5rem`. 카테고리는 좌측 점(정보색)으로만 식별, 글자색은 중립.
4. **밀도 = 여백 우선.** 장식 요소(범례·통계 4색·광고 비중·핫카드 글로우) 축소, 섹션 간 수직 여백 확대.

### B. 메인 화면 정리안 (목업 기준·파일/셀렉터/hex)
1. **[높음] 헤더 단색화** — `app/globals.css` `.site-header::before` L41~44 듀얼 radial `background` 제거(`::before` 자체 제거 가능) → 단색 다크. h1 그라데 클립만 시그니처로 유지.
2. **[높음] HeroStrip 과장식 제거** — `components/HeroStrip.module.css`: `.card` 베이스 `linear-gradient(135deg,#1a1d24,#0f1115)`→`var(--bg-elev)` 단색 / `.card::before` radial glow 제거(`display:none` 또는 규칙 삭제) / `.glowCat`·`.glowDday` box-shadow 글로우·`transform:scale` 제거하고 `border-color`만 / `.dday` `text-shadow` 제거 / `.today` `pulse` 애니메이션 제거(색만 warm #f5a623, #ff4d4d 폐지). 모바일 컴팩트 행(≤480 nth-child(n+4) 숨김)은 현행 유지.
3. **[높음] 필터 3컬럼 정렬** — `components/Filters.tsx`+`Filters.module.css`: 컨트롤 래퍼를 `display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem`(≤480 `1fr`)로. **3컬럼 = 검색 / 카테고리 select / 기간 select.** 플랫폼 select·위시 버튼(`#f5b400`)은 바에서 제거(위시는 추후 헤더 아이콘 등으로 이동 검토·일단 보류). 컨트롤 톤 통일(height 38px·`var(--border)`·`var(--radius-sm)` 8px). 운영자 '3컬럼' 지시 직접 반영.
4. **[보통] 통계줄 중립화** — `components/Home.tsx` L182 `.statsCat` 인라인 `style={{color:CATEGORY_META[c].color}}` 제거 → 전부 muted(`.stats` #aaa). 카테고리 식별 필요 시 글자색 대신 7px 점만.
5. **[보통] 캘린더 정보색 격하** — `components/CalendarView.module.css` `.cellHas` L108~109 `color-mix 8% tint`+`inset 3px` 바 → tint 제거(또는 알파 ↓), 카테고리는 우하단 점 1개(정보색)로. today/선택 셀 링은 `--accent` 블루 단색(`inset 0 0 0 1px var(--accent)`, #4a90e2 폐지). `.legend` L38 범례는 점 색 격하로 의존도↓ → 접기/제거 검토.
6. **[보통] 리스트 카드 배너 평면화** — `components/ListView.module.css` `.cardBanner` L96~102 세로 그라데→단색 면(또는 배너 축소·좌측 바만) / `.cardBanner::before` L104~108 45° 해치(`repeating-linear-gradient`) 제거 / `.ddayRibbon` L205 `box-shadow` 제거(평면) / `.genreChip` L158 = 위 §A.3 중립 칩 언어로.

### C. 상세 페이지(/game/[id]) 정리안 (목업 기준)
1. **[높음] 카테고리 라디얼 백드롭 + 상단 컬러바 제거** — `app/game/[id]/page.tsx` 카드 래퍼 인라인 `background:radial-gradient(...카테고리색...)` 및 `borderTop:4px solid {카테고리색}` 제거 → 평면 `var(--bg-elev)`. 목업처럼 카드 뒤 보라 노이즈 제거.
2. **[높음] 위계 재배치** — 상단 행: 중립 카테고리 칩(점 1개) + **D-day warm 배지(제목 위 최상단 위계)**. 그 아래 제목(28px/500)·로마자 부제(muted). 현 '출시일 줄'은 `--accent` 캘린더 아이콘 + 날짜, 조회수는 같은 줄 muted.
3. **[높음] ViewCounter 무채색화** — `components/ViewCounter.module.css` `.num` L14 `#4a90e2` → `var(--text-faint)` 또는 muted(폐기 블루 청산·두 번째 블루 제거). `.counter` pill 톤다운 유지.
4. **[보통] 스펙시트 2열** — `.detail-meta`(개발사/배급사/플랫폼/장르)를 `grid-template-columns:1fr 1fr`(≤480 1열) hairline 2열로(현 1열 스펙시트는 06-03 적용분 — 2열로 폭 활용).
5. **[보통] 액션·관련카드 정합** — `.detail-actions` outline pill(블루 1색)은 현행 유지. `.related-card`는 카테고리 점/좌측 바 1개(정보색)+`hover border-color`만, D-day는 warm 1색(현 dday-today #ff7a59→warm 계열로 단일화).

### D. 테마(라이트 기본 + 다크 토글) — 운영자 추가 지시 [2026-06-09 17:46]
운영자: "배경 다크/화이트 둘 다 만들고 **화이트를 디폴트 톤**으로." → **기존 '다크 테마 유지' 정체성 갱신: 라이트(화이트) 기본 + 다크 선택 토글.** (인벤이 라이트라 그동안 다크로 차별화했으나 운영자 결정으로 라이트 기본 전환 — 차별화는 미니멀/정보색 절제로 계승.) 현 코드가 색을 `:root` 토큰(--bg/--bg-elev/--border/--text/--text-faint/--accent…)으로 이미 토큰화해 **테마는 토큰 재정의로 구현 가능**(컴포넌트 대량수정 불필요).
구현 방향(개발자 — 운영자 "리액트 기능" 관련): (1) `app/globals.css` L3 `html,body{ background:#0f1115; color:#e6e6e6 }` 하드코딩 → `var(--bg)`/`var(--text)`. (2) `:root`를 **라이트 토큰 기본**으로 재정의 + `[data-theme="dark"]`(또는 `html.dark`)에 현 다크 값 오버라이드. (3) 토글: `next-themes` 라이브러리(`defaultTheme="light"`·SSR no-flash·localStorage 지속·`attribute="data-theme"`) 또는 `<head>` 인라인 스크립트로 paint 전 data-theme 설정 — **하이드레이션 플래시/미스매치 회피(프로젝트 #418/#423/#425 이력 고려 필수)**. 토글 버튼은 헤더 우측 작은 아이콘(해/달).
라이트 토큰 제안값: `--bg:#f6f7f9`·`--bg-elev:#ffffff`·`--border:#e4e7ec`·`--text:#1a1d24`·`--text-faint:#6b7280`·`--accent:#2f6fe0`(화이트 대비 위해 #5b9dff보다 진하게)·`--accent-2:#9b5fc0`·`--accent-grad:linear-gradient(92deg,#2f6fe0,#9b5fc0)`·`--accent-warm:#c47a00`. 카테고리 정보색(화이트용 점/좌바): 모바일 #3f7d54·PC #3a6ea5·글로벌 #7e4f99·신서버 #b5601f. 다크 토큰은 현 값 유지(=다크 모드).
주의: §A~C 정리안 hex는 **다크 테마 값**으로 이관 — 각 표면이 토큰만 참조하면 라이트/다크 자동 전환. **인라인 하드코딩(상세 `page.tsx` 백드롭·`not-found`/`error` #4a90e2·HeroStrip 일부 #fff·ViewCounter 등)은 반드시 토큰화해야 양 테마 정상**(라이트에서 #fff 글자가 흰 배경에 사라지는 류 방지).

### 우선순위(Phase) 종합
- **Phase 0 (선행·테마 토큰화)**: §D — `html,body` 색 토큰화 + `:root` 라이트 기본 + `[data-theme=dark]` 다크 오버라이드 + next-themes 토글(라이트 기본). 색 정리(Phase 1)와 같은 토큰 작업이라 묶음.
- **Phase 1 (색·최대효과)**: §A.1 색 3역할 고정 — 카테고리 4색 정보색 격하 + 주황/블루 단일화 + #4a90e2 전량 청산(ViewCounter·not-found·error·CalendarView 셀링·blog 잔여). 한 번에 가장 큰 '덜 지저분' 효과.
- **Phase 2 (그라데·이펙트)**: B-1·B-2·B-6·C-1 — 헤더 radial·HeroStrip 글로우/펄스·카드 배너 해치/그라데·상세 백드롭 제거(플랫화).
- **Phase 3 (밀도·칩·필터)**: B-3 필터 3컬럼·§A.3 칩 단일언어·B-4 통계 중립·B-5 범례 정리·C-2~5 상세 위계/스펙2열, 섹션 여백 확대.
전부 신규 색 0(기존 토큰 재사용·정보색은 기존 4색 톤다운)·운영자 승인 목업 기준. a11y/리팩토링은 정리 과정에 자연 동반되나 별도 큐잉 X(외형/정리 모드).

---

## [2026-06-09 17:04] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 블루→퍼플 그라데 타이틀+헤더 듀얼 radial·'🔥 출시 임박' 핫카드[포켓몬 챔피언스 D-6 주황 warm 그라데]·캘린더 6월 today(9일) 셀 자동선택→day-detail 패널 '이후 출시 20건' 자동 노출[D-6 amber·D-8+ muted, 큐 ① 미구현분 정상]) 양호. **이번 사이클은 직전(16:51)이 /blog만 다룬 '브랜드 외형 사이클 미수혜 표면' 점검을 비(非)블로그 신규/유틸 표면으로 확장 — ①카테고리 SEO 랜딩 5종(`SeoLanding` 컴포넌트·/mobile-games·/pc-console-games·/global-games·/new-servers·/upcoming-games) ②상세 조회수 카운터(`ViewCounter`, 06-08 Supabase와 함께 추가·외형 사이클 한 번도 안 받음) ③404/에러 유틸 페이지.** 라이브 교차로 **폐기된 구 accent `#4a90e2`가 블로그 외 3개 표면에 잔존**(전역은 06-02에 `--accent` `#5b9dff`로 선명화, blog는 16:51 큐 ③로 명세화됐으나 이 3표면은 미점검)·SEO 랜딩 h2가 메인 h1 그라데 클립 미적용 평면 #fff 확인. **모바일(390): resize_window 뷰포트 미반영(innerW 1920·mq480 false, 기존 한계) → same-origin iframe 390px 합성 실측(/mobile-games·/game/[id] 모두 innerW 390·mq480 true·가로 오버플로 0, ViewCounter `.num` computed `rgb(74,144,226)`=#4a90e2 라이브 확정·SEO h2 27.2px 모바일 무축소).** 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차 — 히어로 리뷰 배너·핫카드 라이브 카운트다운·주간 TOP10·핫딜 가격카드·아이콘 필터 스트립·BackToTop·행별 아트워크/타입배지/국기/태그칩/액션버튼은 전부 기수집(큐·IDEAS), 정보밀도 행은 우리 미니멀 정체성상 미수입. 신규 식별은 **핫카드 카운트다운의 세그먼트 디짓박스 시각 스펙**(큐 ④ 미상세분 보강). 큐(① day패널 D-day 3단·② day패널 모바일 3규칙·③ 블로그 정합·④ HeroStrip 핫카드)/IDEAS와 중복 없는 신규만. a11y/시맨틱/리팩토링 0건(외형 모드 — CalendarView `:focus-visible`의 #4a90e2 2건은 포커스 표면이라 의도적 제외).

### 데스크톱(1440) 점검
1. **[높음·신규표면·브랜드 타이틀] 카테고리 SEO 랜딩 5종의 페이지 타이틀 `.seo-landing h2`가 평면 #fff(색 오버라이드 0) — 메인 site-header h1은 `var(--accent-grad)` 블루→퍼플 클립인데 최대 SEO 유입 표면(랜딩 5종)의 h1급 타이틀만 무브랜드 평면이라 표면 정체성 단절** (`app/globals.css` `.seo-landing h2` L175, 메인 `.site-header h1 a` L53~58 패턴 차용)
   - 현재: `.seo-landing h2{ font-size:1.7rem; margin-bottom:0.6rem }` — color 지정 없어 기본 흰색. 라이브 /mobile-games 실측 "국내 신규 모바일 게임 출시 일정"이 단색 흰색으로, 같은 화면 상단 site-header h1(그라데 클립)과 톤 갈림. 블로그(16:51 큐 ③)와 동일 증상·다른 컴포넌트(SeoLanding은 blog.module.css와 무관·5개 라우트 공유).
   - 바꿀 값: `.seo-landing h2`에 메인 h1과 동일 클립 3줄 추가 — `background:var(--accent-grad); -webkit-background-clip:text; background-clip:text; color:transparent;`. → 랜딩 5종 타이틀이 메인과 같은 시그니처 블루→퍼플 그라데로 통일(신규 색 0·기존 토큰 재사용·레이아웃 무변). 우선순위 **높음**(SEO 최대 유입 표면·5라우트 동시 정합·블로그 정합과 같은 브랜드 청산 테마).

2. **[높음·신규표면·구 accent 잔재] 상세 조회수 카운터 `ViewCounter` `.num`이 폐기된 구 accent `#4a90e2` 하드코딩 — 같은 상세 화면의 날짜(`var(--accent)` #5b9dff)·액션 pill(#5b9dff)과 두 블루 공존** (`components/ViewCounter.module.css` `.num` L14)
   - 현재: `.num{ color:#4a90e2; font-weight:700 }`. 라이브 /game/crimson-desert-2026 '👁 1 회 조회' pill의 숫자가 채도 낮은 옛 블루 — 바로 아래 '출시일: 2026년 3월 20일'(브랜드 #5b9dff)·'캘린더 추가/공식 출처' outline pill(#5b9dff)과 한 화면서 두 블루. 06-08 Supabase 카운터와 함께 추가돼 외형 사이클을 한 번도 안 받은 표면(blog 16:51 사이클이 blog.module.css만 손봐 누락). iframe 390 computed `rgb(74,144,226)` 확정.
   - 바꿀 값: `.num{ color:var(--accent) }`(#5b9dff 단일화). `.counter`의 하드코딩 `rgba(255,255,255,0.04)`/`rgba(255,255,255,0.08)`는 값 유지 가능하나 num만이라도 토큰화하면 충분. → 조회수 숫자가 메인 인터랙션색과 단일화(신규 색 0·전역 토큰 재사용·색만 변경). 우선순위 **높음**(라이브 상세·블로그와 같은 #4a90e2 청산 테마·1줄).

3. **[보통·신규표면·유틸 페이지] 404/에러 페이지 인라인 `#4a90e2` 잔존 — `not-found.tsx` 복귀 링크 색·`error.tsx` 재시도 버튼 배경이 구 accent 하드코딩, radius도 비표준 6px** (`app/not-found.tsx` L6 + `app/error.tsx` L8)
   - 현재: not-found `<a style={{color:'#4a90e2'}}>← 메인으로 돌아가기</a>`·error `<button style={{background:'#4a90e2',...,borderRadius:'6px'}}>다시 시도</button>`. 라이브 /game/sol-enchant(미존재 slug) 진입 시 not-found 복귀 링크가 헤더 그라데/푸터 링크(#5b9dff)보다 칙칙한 옛 블루. radius 6px도 전역 `--radius-sm`(8px)과 불일치.
   - 바꿀 값: 두 인라인 `#4a90e2`→`var(--accent)`(또는 error 버튼은 `var(--accent-grad)` 채움으로 브랜드화)·`borderRadius:'6px'`→`'var(--radius-sm)'`(8px). → 유틸 페이지도 메인 브랜드색·표준 radius 정합(신규 색 0). 우선순위 **보통**(저빈도 표면이나 #4a90e2 청산 테마 완결·인라인 2줄).

### 모바일(390) 점검 (iframe 390 합성 실측 — 오버플로 0)
1. **[보통·모바일·신규표면] 카테고리 SEO 랜딩 5종이 `@media(max-width:480px)` 미보유 — globals의 두 모바일 블록(L68 site-header·L125 game-detail)이 `.seo-landing`을 안 다뤄 모바일서 타이틀·카드 무축소** (`app/globals.css` L68 모바일 블록 확장)
   - 현재(iframe 390 실측): `.seo-landing h2` 27.2px(1.7rem 무축소)·`.seo-list-item padding:11.2px 16px`(0.7rem 1rem 무축소)·`.seo-landing padding:0 1rem`. 5개 SEO 랜딩이 좁은 폭에서 h2 과대·카드 좌우 패딩 과대(오버플로 0이나 밀도 헐렁).
   - 바꿀 값: L68 `@media(≤480px)` 블록에 3규칙 추가 — `.seo-landing h2{ font-size:1.35rem }`·`.seo-list-item{ padding:0.6rem 0.7rem; gap:0.4rem }`·`.seo-landing{ padding:0 0.7rem }`. → 랜딩 5종 모바일 타이틀 비례 축소·카드 콘텐츠폭 ~+18px·리듬 타이트(데스크 무영향·레이아웃만·신규 색 0). 우선순위 **보통**(SEO 유입 표면·모바일 미보유).

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·큐 ④ 보강] 인벤 핫카드는 카운트다운을 세그먼트 디짓박스(01 : 06 : 57 : 03 + Days/Hours/Min/Sec 라벨)로 표시 → 우리 큐 ④(HeroStrip 핫카드 라이브 카운트다운)는 '카운트다운'만 명시·시각 형식 미상세. 다크 미니멀 디짓박스 스펙 구체화** (`components/HeroStrip.module.css` 신규 `.countdown`/`.cdBox`, 큐 ④ 구현 시 동반)
   - 인벤: 라이트·콜론 구분 4박스+영문 라벨. 우린 다크·미니멀 → 박스 채움 대신 톤다운 글래스, 라벨은 D/H/M 한 글자.
   - 바꿀 값(큐 ④ 동반): `.countdown{ display:inline-flex; gap:0.4rem; align-items:flex-end }` + `.cdBox{ display:flex; flex-direction:column; align-items:center; min-width:2.4em; padding:0.3rem 0.45rem; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:var(--radius-sm) }` + `.cdNum{ font-size:1.3rem; font-weight:800; color:var(--accent-warm); font-variant-numeric:tabular-nums }` + `.cdLabel{ font-size:0.62rem; color:var(--text-faint); letter-spacing:0.04em }`. D-DAY 임박(주황 warm)인 핫카드에 D/H/M 3박스(초는 다크 미니멀상 생략). useEffect mount 가드+`setInterval(1000)`로 하이드레이션 안전·tabular-nums로 자릿수 점프 방지. → 큐 ④가 인벤 카운트다운을 다크 글래스 디짓박스로 재해석(신규 색 0·warm/토큰 재사용). 우선순위 **보통**(큐 ④ 미상세 시각 스펙 보강·중복 아님).
   - 참고: 인벤 행 정보밀도(설명 프리뷰·미정 탭·인라인 찜)는 우리 미니멀/모던 정체성과 충돌·기능 범위라 미수입. 아이콘 필터칩(16:51 IDEAS)·BackToTop(IDEAS)로 인벤 시각 패턴은 이미 충분 큐잉.

### 우선순위 종합
높음: 데스크#1(SEO 랜딩 5종 타이틀 그라데 클립 — SEO 최대 유입·5라우트 동시)·데스크#2(ViewCounter `.num` #4a90e2→--accent — 라이브 두 블루 공존·1줄). 둘 다 16:51 블로그 정합과 같은 '#4a90e2/평면타이틀 청산' 테마의 **미점검 표면 확장**(blog.module.css와 무관한 별도 컴포넌트). 보통: 데스크#3(404/에러 인라인 #4a90e2+radius 정합)·모바일#1(SEO 랜딩 모바일 3규칙)·인벤#1(핫카드 카운트다운 디짓박스 — 큐 ④ 시각 스펙 보강). 전부 신규 색 0·전역 토큰 재사용·CSS 위주(데스크#3만 tsx 인라인 2줄).

---

## [2026-06-09 16:51] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 블루→퍼플 그라데 타이틀+헤더 듀얼 radial·'🔥 출시 임박' 핫카드[포켓몬 챔피언스 D-6 주황·warm 그라데 배너]·캘린더 6월 today(9일) 셀 자동선택→day-detail 패널 '이후 출시 20건' 자동 노출[첫 행 D-6만 amber·나머지 muted]·푸터 SEO 링크 5종+신규 '게임 출시 블로그' 링크) 전부 양호. **신규 표면 /blog·/blog/[slug] 첫 점검** — 06-08 추가된 블로그가 본 사이트 외형 사이클(accent #5b9dff 선명화·그라데 타이틀·헤더 radial·Pretendard 위계)을 못 받아 **구 accent #4a90e2 하드코딩 잔재 + 무브랜드 평면**으로 톤 단절. **모바일(390): resize_window 뷰포트 미반영(innerW 1920·mq480 false, 기존 한계 동일) → same-origin iframe 390px 합성 실측(/blog·/blog/[slug]·메인 모두 mq true·innerW 390·docW 375·오버플로 0).** 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차 — 히어로 리뷰 배너·핫카드 카운트다운·주간 TOP10·핫딜 가격카드·BackToTop은 기수집분, 이번 신규 식별 **필터를 원형 아이콘 스트립(전체/출시/테스트/얼리액세스/PC/MOBILE/PS/XBOX/SWITCH/행사)**으로 시각화(우린 text `<select>` 3종 평면). 큐(day패널 D-day 3단·day패널 모바일 3규칙·블로그 정합·HeroStrip 핫카드)/IDEAS와 중복 없는 신규만 — 단, 블로그는 큐 ③ '브랜드 정합'의 **구체 hex/셀렉터 명세** 제공(직전까지 한 줄 큐만 존재, 디자인 노트 최초 상세화). a11y/시맨틱/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·신규표면·브랜드 타이틀] `/blog` 섹션 타이틀 `.title`(📰 블로그)·`/blog/[slug]` `.postH1`이 평면 흰색 `#fff` — 메인 h1은 `var(--accent-grad)` 블루→퍼플 클립 그라데인데 블로그 두 제목만 무브랜드 평면이라 표면 정체성 단절** (`app/blog/blog.module.css` `.title` L6 + `.postH1` L? 상세, 메인 `app/globals.css` `.site-header h1 a` L53~58 패턴 차용)
   - 현재: `.title{ font-size:2rem; font-weight:800; color:#fff }`·`.postH1{ font-size:1.9rem; font-weight:800; color:#fff }`. 라이브 /blog·/blog/[slug] 실측 두 제목 모두 단색 흰색 — 같은 페이지 상단 site-header h1(그라데 클립)과 동일 화면에서 톤 갈림.
   - 바꿀 값: 두 셀렉터에 메인 h1과 동일 클립 3줄 추가 — `background:var(--accent-grad); -webkit-background-clip:text; background-clip:text; color:transparent;`(기존 color:#fff 대체). → 블로그 제목이 메인과 같은 시그니처 블루→퍼플 그라데로 통일(신규 색 0·기존 토큰 재사용·레이아웃 무변). 우선순위 **높음**(큐 ③ 핵심·첫 화면 브랜드 앵커).

2. **[높음·신규표면·구 accent 잔재] `blog.module.css` 전반이 폐기된 구 accent `#4a90e2`/파생색 하드코딩 — 전역은 06-02에 `--accent` `#4a90e2`→`#5b9dff` 선명화했는데 블로그만 칙칙한 옛 블루로 6곳 잔존** (`app/blog/blog.module.css` `.postCard:hover` L?·`.postDate` L?·`.tag` L?·`.backLink:hover`·`.postBody a`)
   - 현재(6곳): `.postCard:hover{ border-color:#4a90e2; box-shadow:0 8px 24px -8px rgba(74,144,226,0.3) }`·`.postDate{ color:#4a90e2 }`·`.tag{ color:#6ab0e8; background:rgba(74,144,226,0.08) }`·`.backLink:hover{ color:#4a90e2 }`·`.postBody a{ color:#4a90e2 }`. 라이브에서 카드 날짜·태그칩·링크가 메인 인터랙션색(#5b9dff)보다 채도 낮은 옛 블루라 한 사이트 안에서 두 블루가 공존.
   - 바꿀 값(전부 토큰화·CSS Module도 globals `:root` 토큰 상속): `#4a90e2`→`var(--accent)`(4곳)·`rgba(74,144,226,0.3)`→`rgba(91,157,255,0.3)`·`rgba(74,144,226,0.08)`→`rgba(91,157,255,0.1)`·`.tag` color `#6ab0e8`→`var(--accent)`. 하드코딩 `#1a1d24`/`#2a2e38`(.postCard/.postHeader 등)도 값 동일하니 `var(--bg-elev)`/`var(--border)`로 정리 권장(외형 무변·단일 출처화). → 블로그 인터랙션색이 메인 #5b9dff와 단일화(신규 색 0·전역 토큰 재사용). 우선순위 **높음**(큐 ③ 핵심·구색 잔재 청산).

3. **[보통·신규표면·헤더/섹션 마커] `/blog` `.header`에 메인 헤더의 radial 글로우 부재 + `/blog/[slug]` `.postBody h2`(국내 신규 모바일 게임 등)가 평면 흰 줄 — 메인은 헤더 듀얼 radial·HeroStrip `.title` 좌측 accent 바로 섹션을 앵커링하는데 블로그 본문 섹션은 장식 0** (`app/blog/blog.module.css` `.header` L5 + `.postBody h2` L?)
   - 현재: `.header{ margin-bottom:2rem }`(배경 장식 0)·`.postBody h2{ font-size:1.4rem; color:#fff; margin:1.8rem 0 0.8rem; font-weight:700 }`(평면). 라이브 post에서 H2 섹션 구분이 굵기뿐 — 긴 큐레이션 글에서 섹션 스캔 약함.
   - 바꿀 값: `.postBody h2`에 `padding-left:0.6rem; border-left:3px solid var(--accent)` 2속성 추가(HeroStrip `.title` 좌띠 패턴 차용·기존 토큰). 헤더 글로우는 선택 — `.header{ position:relative }` + 메인 `.site-header::before`의 라이트버전 radial 1개(`background:radial-gradient(60% 100% at 20% 0%, rgba(91,157,255,0.08), transparent 60%)`)를 `::before`로. → 본문 섹션이 accent 좌띠로 앵커링되고 인덱스 헤더가 은은한 브랜드 글로우 획득(신규 색 0). 우선순위 **보통**.

### 모바일(390) 점검 (iframe 390 합성 실측 — 오버플로 0)
1. **[보통·모바일·신규표면] `blog.module.css` `@media(max-width:480px)` 블록이 `.title`(1.6rem)·`.postH1`(1.5rem)만 축소 — `.postLink` 카드 패딩(`1.2rem 1.4rem`)·`.postBody`(1rem/1.7) 모바일 오버라이드 0이라 390서 본문폭 손실·줄길이 과대** (`app/blog/blog.module.css` `@media(≤480px)` L? 블록 확장)
   - 현재(iframe 390 실측): 인덱스 카드 `.postLink padding:1.2rem 1.4rem`(좌우 22px×2) + `.indexSection padding:0 1rem` → 카드 콘텐츠폭 ~329px, post 본문 `.post max-width:760px; padding:0 1rem`. 데스크 톤 그대로라 좁은 폭에서 카드 좌우 패딩이 과대.
   - 바꿀 값: `@media(≤480px)` 블록에 `.postLink{ padding:1rem 1.1rem }`·`.postBody{ font-size:0.95rem; line-height:1.65 }`·`.tag{ font-size:0.72rem }` 3규칙 추가. → 카드 콘텐츠폭 ~+18px·본문 줄길이/리듬 모바일 정돈(데스크 무영향·레이아웃만·신규 색 0). 우선순위 **보통**(신규표면 모바일 미보유).

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·큰단위·카테고리 시각화] 인벤은 필터를 원형 아이콘 스트립(전체/출시/테스트/얼리액세스 + PC/MOBILE/PS/XBOX/SWITCH 아이콘 + 행사)으로 시각화 → 우린 `카테고리/플랫폼/기간` 모두 text `<select>` 평면이라 표면 색·시각 신호 0. 플랫폼 필터를 다크 아이콘칩 가로 스트립으로 재해석** (`components/Filters.tsx` 플랫폼 select → 아이콘칩 row + `Filters.module.css`)
   - 인벤: 라이트·원형 아이콘+라벨 빽빽. 우린 다크·미니멀 → **채움 아닌 다크 글래스 칩**(아이콘+짧은 라벨, 활성 시 accent 보더·tint)으로 절제, 6플랫폼(PC/PS5/Xbox/Switch/iOS/Android)만.
   - 바꿀 값(큰 단위·개발자 판단 필요): 플랫폼 `<select>`를 `.platChip` 가로 스크롤 row로 — `.platChip{ display:inline-flex; gap:0.35rem; padding:0.35rem 0.7rem; border:1px solid var(--border); border-radius:999px; background:rgba(255,255,255,0.03); color:var(--text-faint); font-size:0.82rem }` + `.platChip[aria-pressed=true]{ border-color:var(--accent); background:rgba(91,157,255,0.1); color:var(--text) }` + 아이콘은 layout.tsx SVG 스프라이트 재사용. 카테고리/기간은 select 유지(점진). → 플랫폼 필터가 시각 신호 있는 칩 스트립으로 승격(인벤 아이콘 필터를 다크 미니멀로 흡수). 신규 색 0·기존 토큰. 우선순위 **보통**(큰 단위·IDEAS 보관 후보).

### 우선순위 종합
높음: 데스크#1(블로그 타이틀 그라데 클립 — 큐 ③ 핵심 브랜드 앵커)·데스크#2(블로그 구 accent #4a90e2 6곳 토큰화 — 구색 청산). 둘은 같은 blog.module.css 표면이라 **묶음 구현 후보**(큐 ③ 단일 사이클 소화 가능). 보통: 데스크#3(블로그 본문 h2 accent 좌띠+헤더 글로우)·모바일#1(블로그 모바일 3규칙)·인벤#1(플랫폼 아이콘칩 스트립·큰 단위 IDEAS 후보). 전부 신규 색 0·전역 토큰 재사용·CSS 위주(인벤#1만 tsx 동반).

---

## [2026-06-04 05:07] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(통계줄 카테고리 4색 분해[모바일 11 #81c784·PC·콘솔 5 #64b5f6·글로벌 16 #ba68c8·신서버 12 #ff8a65] 신규 출고 확인·'🔥 출시 임박' 3글로우카드[미르 D-DAY·메이크드라마 D-DAY·고딕 D-1]·캘린더 6월 today 셀 자동선택→day-detail 패널 '이후 출시 20건' 자동 노출) 전부 양호. **모바일(390): resize_window 뷰포트 미반영(innerWidth 1920·mq480 false, 기존 한계 동일) → same-origin iframe 390px 합성으로 실측(mq true·innerW 386·docW 371 오버플로 0).** 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차 — 히어로 리뷰 배너·핫카드 카운트다운(06:18:53:48)·주간 TOP10(▲▼NEW)·행별 타입배지/국기/태그칩/액션버튼에 더해 **우하단 플로팅 '맨 위로' 원형 버튼 상시 제공** 확인. 이번 사이클은 직전 사이클들이 미점검한 **day-detail 패널(캘린더 셀 클릭 하단 패널) + 푸터 + 플로팅 유틸** 표면 집중 — 큐(related-dday·헤더 듀얼 radial·상세 액션 pill·.game-detail 모바일)/IDEAS(핫카드·HeroStrip warm 좌띠·Home 모바일 패딩·리스트 날짜 요일색·image_url 배너 등)와 중복 없는 신규만. a11y/시맨틱/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·D-DAY 강조·색 규약] day-detail 패널 행 D-day(`.dayRowDday`)가 D-DAY(=오늘)와 D-1~7을 같은 amber(#f5a623) 한 톤으로 — 전역 규약(D-DAY 주황 #ff7a59 / 임박 amber)과 불일치** (`components/CalendarView.module.css` `.dayRowDdaySoon` L253 + `components/CalendarView.tsx` L232 D-day span)
   - 현재: tsx가 `diff <= 7 && diff >= 0 ? styles.dayRowDdaySoon : ''` 단일 분기 → `.dayRowDdaySoon{color:#f5a623}`이 D-0~D-7 전부 커버. 라이브 실측 패널에서 '미르의 전설: 진 D-DAY'·'메이크 드라마 D-DAY'(둘 다 amber)가 'D-1 고딕'과 같은 색 — 같은 화면 위 HeroStrip 글로우카드 D-DAY(#ff7a59 주황)·리스트 카드 리본과 어긋남. 진입 시 오늘 셀 자동선택으로 **패널이 첫 화면 기본 노출 표면**이 된 지금(06-04 01:30 출고) 더 도드라짐.
   - 바꿀 값: tsx 분기를 `diff === 0 ? styles.dayRowDdayToday : diff > 0 && diff <= 7 ? styles.dayRowDdaySoon : ''`로 교체(1줄), CSS에 `.dayRowDdayToday { color: #ff7a59; font-weight: 700; }` 1규칙 신설(기존 D-DAY 주황 재사용·신규 색 0). → 패널 D-day가 HeroStrip/리스트/상세 배지와 동일 3단 규약(D-DAY 주황/임박 amber/그 외 #888)으로 통일. 큐 1순위 related-dday(상세 표면)와 **같은 색 규약·다른 표면** — 묶음 구현 후보. 우선순위 **높음**(첫 화면 기본 노출 표면·tsx 1줄+CSS 1규칙).

2. **[보통·푸터 마감] `.site-footer`가 회색 2줄+직선 `border-top` 뿐 — 헤더는 그라데 타이틀·라디얼 글로우로 브랜딩됐는데 페이지 마감(푸터)은 무브랜드 평면이라 수미 불일치** (`app/globals.css` `.site-footer` L70~77)
   - 현재: `.site-footer{ text-align:center; padding:2rem 1rem; color:#666; font-size:0.85rem; border-top:1px solid var(--border); margin-top:3rem }`. 라이브에서 © 줄+문의 메일 2줄이 #666 한 톤, 구분선은 풀폭 직선 #2a2e38 — 첫 화면(블루→퍼플 그라데 h1)과 대비되게 끝 화면은 장식 0.
   - 바꿀 값: `border-top` 제거 → `.site-footer{ position:relative }` + `.site-footer::before{ content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:min(640px,90%); height:1px; background:linear-gradient(90deg, transparent, rgba(91,157,255,0.4), rgba(201,138,214,0.4), transparent) }`(브랜드 블루→퍼플 그라데 hairline, 기존 `--accent`/`--accent-2`의 rgba — 신규 색 0). 문의 메일 a는 전역 `a{color:var(--accent)}` 현행 유지. → 헤더 그라데와 수미쌍관하는 은은한 마감 밴드(CSS only·높이 무변). 우선순위 **보통**.

### 모바일(390) 점검 (iframe 390 합성 실측)
1. **[보통·모바일·패널 밀도] `CalendarView.module.css`의 `@media(max-width:480px)` 블록(L257)이 `.view`/`.cell`/`.cellDate`/`.cellName`/`.cellHas`/`.cellDot`만 다루고 `.dayPanel`/`.dayRow`는 오버라이드 0 — 모바일은 셀 게임명 숨김(`.cellName{display:none}`)이라 **패널이 사실상 모바일 1차 콘텐츠 표면**인데 패딩 과대로 행 폭 손실** (`components/CalendarView.module.css` L257 모바일 블록 확장)
   - 현재(iframe 390 실측): 패널 폭 319px·`padding:1rem`(16px)·row 콘텐츠 285px·row `padding:0.5rem 0.7rem`·`.dayRowDate{min-width:3.5em}` → '포켓몬 챔피언스 (모바일)'·'파이널 판타지 택틱스 - 이발리스 크로니클즈' 등 게임명이 2줄 랩, 20행 패널 세로가 늘어짐.
   - 바꿀 값: L257 블록에 3규칙 추가 — `.dayPanel{ padding:0.7rem }` + `.dayRow{ gap:0.45rem; padding:0.45rem 0.55rem }` + `.dayRowDate{ min-width:3em; font-size:0.72rem }`(`.cellDate` 모바일 0.72rem과 동일 톤). → 행 콘텐츠 폭 ~+20px로 게임명 랩 감소·세로 리듬 타이트(데스크 무영향·레이아웃만·신규 색 0). 우선순위 **보통**(모바일 1차 표면).

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·플로팅 유틸] 인벤은 우하단에 '맨 위로' 원형 플로팅 버튼(+다크 토글)을 상시 제공 → 우리 메인은 캘린더+패널 20행+하단 광고로 세로가 길고 월탭/뷰토글이 상단에만 있어 하단에서 복귀 코스트 큼. 다크 글래스 원형 BackToTop 신설** (신규 `components/BackToTop.tsx` + `BackToTop.module.css`, `app/layout.tsx` body 말미 1줄)
   - 인벤: 라이트 흰 원형 2버튼 → 우린 다크·미니멀: 1버튼만, 글래스 톤다운.
   - 바꿀 값: client 컴포넌트 — `scrollY > 600`에서만 표시(scroll 리스너+state, mount 후 가드로 하이드레이션 안전), 클릭 시 `scrollTo({top:0, behavior:'smooth'})`. CSS: `.btn{ position:fixed; right:18px; bottom:18px; width:42px; height:42px; border-radius:50%; background:rgba(26,29,36,0.85); backdrop-filter:blur(8px); border:1px solid var(--border); color:#cfd6e0; font-size:1.1rem; opacity:0; pointer-events:none; transition:opacity 0.2s }` + `.visible{ opacity:1; pointer-events:auto }` + hover `border-color:var(--accent); color:#fff` + `@media(prefers-reduced-motion:reduce){ .btn{transition:none} }`(스크롤도 `behavior:auto`). 아이콘은 layout.tsx 기존 SVG 스프라이트 `#ic-arrow-ur` 재사용 또는 '↑' 텍스트. 신규 색 0(기존 토큰·bg-elev rgba). → 긴 페이지 하단↔상단 왕복 어포던스(인벤 패턴의 다크 글래스 재해석). 우선순위 **보통**.
   - 참고: 인벤 '주간 TOP10 순위'는 인기 지표(집계 데이터) 부재로 이번에도 보류 — 위시리스트가 localStorage(개인별)뿐이라 대체 데이터도 없음.

### 우선순위 종합
높음: 데스크#1(dayRow D-DAY 주황 통일 — 첫 화면 기본 노출 표면·큐 related-dday와 같은 규약 묶음 후보·tsx 1줄+CSS 1규칙). 보통: 모바일#1(dayPanel 모바일 3규칙 — 모바일 1차 표면)·인벤#1(BackToTop 다크 글래스 플로팅)·데스크#2(푸터 브랜드 그라데 hairline). 전부 신규 색 0·기존 토큰 재사용.

---

## [2026-06-04 01:05] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 블루→퍼플 그라데 타이틀+태그라인 헤더 통합·상단 광고 점선 슬롯·'🔥 출시 임박' 3글로우카드[미르 D-DAY 주황·메이크드라마 D-DAY 주황·고딕 D-1]·캘린더/리스트 토글·월탭[6월 그라데 활성]·필터행[기간 기본 '오늘 이후']·통계 '총 44개'·캘린더 6월[주말 일#e57373/토#7aa7ff·today 4일 채움 원형·출시셀 카테고리 tint+좌띠·범례 4색 점]·리스트[총 27개·월섹션 sticky·카드 배너 카테고리 세로그라데+해치·D-DAY 좌상단 리본]·/game/ff7-rebirth-switch2-2026 상세[퍼플 라디얼 백드롭+상단 퍼플바+D-DAY 배지+detail-meta 스펙시트 hairline 4행+'같은 시기 출시' 좌띠 미니카드 그리드]) 전부 라이브 반영 양호. **모바일(390): Chrome resize_window가 페이지 뷰포트 미반영(스크린샷 1568px 데스크 레이아웃·히어로 3열 그리드 유지, QA·직전 사이클 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 교차 — 본문 각 행 우측에 액션 버튼(일정/홈페이지/영상/찜)을 또렷한 버튼 묶음으로. 아래는 큐(ViewToggle 모바일·장르칩·통계줄 4색·헤더 듀얼 radial)/IDEAS(Home 모바일패딩·legend칩·리스트 날짜 요일색·핫카드 등)/완료와 중복 없는 **/game/[id] 상세 표면 집중** 신규 외형 제안만(직전 사이클들이 메인/리스트에 집중해 상세는 detail-meta 외 미점검). a11y/시맨틱/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[보통·상세 D-DAY 일관성] `/game/[id]` 하단 '같은 시기 출시' 미니카드의 D-day(`.related-dday`)가 임박도 불문 전부 블루 — 앱 전역 D-day 색 규약(D-DAY 주황·임박 amber)과 어긋남** (`app/globals.css` `.related-dday` L131 + `app/game/[id]/page.tsx` related 루프 L130~134)
   - 현재: `.related-dday{ font-size:0.85rem; font-weight:700; color:var(--accent) }` 단일 블루. 라이브 상세에서 관련카드 '미르의 전설:진 D-1'·'메이크 드라마 D-1'이 블루로 떠, 같은 화면 위쪽 본문 D-DAY 배지(주황 #ff7a59)·임박(amber #f5a623)과 색 규약 불일치(같은 'D-1'이 표면마다 다른 색). 메인 리스트 카드(`.ddaySoon{color:#f5a623}`)·HeroStrip 글로우와도 어긋남.
   - 바꿀 값: page.tsx related 루프가 이미 `rDiff`(L131) 보유 → `rdStage`(`rDiff===0?'today':rDiff>0&&rDiff<=7?'soon':'far'`) 1줄 추가, `<span className={`related-dday dday-${rdStage}`}>`. CSS: 기본 `.related-dday`는 far용 `color:var(--text-faint)`로 톤다운 + `.related-dday.dday-today{ color:#ff7a59 }`·`.related-dday.dday-soon{ color:#f5a623 }` 2규칙 신설(앱 기존 D-day 3색 재사용·신규 색 0). → 관련카드 D-day가 본문 배지·메인 리스트와 동일 색 규약(D-DAY 주황/임박 amber/먼미래 muted)으로 통일. 우선순위 **보통**(상세=모달=리스트 색 일관, tsx 1줄+CSS 3규칙).

2. **[보통·상세 깊이] '같은 시기 출시' `.related-card`가 평면 `var(--bg-elev)` 면에 좌측 4px 카테고리 바만 — 3~6개 카드가 균일하게 밋밋, 본문 카드의 카테고리 라디얼 백드롭 대비 하단 그리드만 색 깊이 0** (`app/globals.css` `.related-card` L127 + `page.tsx` related 카드 인라인 style L140)
   - 현재: `.related-card{ background:var(--bg-elev); border:1px solid var(--border); border-radius:var(--radius-sm); padding:0.8rem 1rem }` + 인라인 `borderLeft:4px solid {카테고리색}`. 좌 4px 바 외엔 면이 전부 동일 `--bg-elev`라 라이브에서 카드 4개가 색 구분 약(좌측 얇은 바로만 카테고리 식별). hover는 `border-color:var(--accent)`로 변해 카테고리색 정체성도 사라짐.
   - 바꿀 값(다크 재해석): page.tsx 카드 인라인 style에 `['--cat' as string]: CATEGORY_META[g.category].color` 주입(기존 borderLeft도 `var(--cat)`로 정리) → CSS `.related-card{ background:linear-gradient(90deg, color-mix(in srgb, var(--cat) 12%, var(--bg-elev)), var(--bg-elev) 42%) }`(좌측에서 카테고리색이 12%→0%로 번지는 미세 wash, color-mix 미지원 폴백 `background:var(--bg-elev)` 선행) + `.related-card:hover{ border-color:var(--cat) }`(hover도 카테고리색 유지). → 좌 4px 바와 면 tint가 정합돼 카드별 카테고리가 면색으로 즉시 읽힘(본문 라디얼 백드롭과 톤 연결). 카테고리 4색 단일 출처 재사용·신규 색 0. 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[보통·모바일·상세] `app/globals.css`의 유일한 `@media(max-width:480px)` 블록(L66)이 `.site-header h1`/`.site-tagline`만 다룸 → `.game-detail`(상세 카드)은 모바일 오버라이드 0. SEO 유입 첫 화면인 상세가 좁은 폭에서 패딩 과대·제목 큼** (`app/globals.css` `.game-detail` L100~107·`.game-detail h2` L108 + `@media(≤480px)` L66 블록 확장)
   - 현재: `.game-detail{ padding:1.5rem 1.8rem 2rem }`(좌우 1.8rem≈29px×2=58px) + `.game-detail h2{ font-size:2rem; letter-spacing:-0.02em }` 모바일 축소 전무. 390px서 좌우 패딩이 본문폭을 깎고 2rem(32px) 제목이 좁은 폭에 과대(라이브 미반영이나 소스상 유일 미보유 표면 — 메인/리스트/모달/필터엔 모바일 블록 존재).
   - 바꿀 값: L66 `@media(≤480px)` 블록에 `.game-detail{ padding:1.2rem 1.1rem 1.6rem }`(좌우 1.8→1.1rem·본문폭 ~22px 회수)·`.game-detail h2{ font-size:1.5rem }`(2→1.5rem 비례 축소) 2규칙 추가. → 좁은 화면 상세 본문폭 확보·제목 비례 정돈(데스크 무영향·레이아웃만·신규 색 0). 우선순위 **보통**(상세=SEO 첫 화면·유일 모바일 미보유 표면).

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·액션 버튼] 인벤은 본문 각 행에 액션(일정/홈페이지/영상/찜)을 또렷한 버튼 묶음으로 제공 → 우린 상세 하단 액션이 `.gcal-link`('캘린더 추가', CSS 규칙 0건·plain 텍스트)+'공식 출처 →'(class 없음·bare `<a>`) 2개 평문 링크라 클릭 타깃·시각 비중 약함** (`app/game/[id]/page.tsx` 액션 div L119~124 + `app/globals.css` 신규 `.detail-actions`/pill)
   - 인벤: 라이트·버튼 빽빽. 우린 다크·미니멀 → **채움 아닌 outline pill**로 절제(2버튼만).
   - 현재: 액션 래퍼 `<div style={{display:'flex',gap:'0.6rem',marginTop:'1rem',flexWrap:'wrap'}}>` 안에 `.gcal-link`(globals에 규칙 없음 → `a{color:var(--accent)}` 평문 상속)·'공식 출처 →'(class 미부여 평문). 라이브 상세에서 둘 다 작은 파란 텍스트라 메타/관련카드 사이에서 눈에 안 띔.
   - 바꿀 값(다크 재해석): page.tsx 래퍼 div를 `className="detail-actions"`로(인라인 style 제거)+'공식 출처' `<a className="detail-link">`. globals: `.detail-actions{ display:flex; gap:0.6rem; margin-top:1.2rem; flex-wrap:wrap }` + `.detail-actions .gcal-link, .detail-actions .detail-link{ display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 0.95rem; border:1px solid var(--border); border-radius:var(--radius-sm); background:rgba(255,255,255,0.03); color:var(--accent); font-size:0.88rem; font-weight:600 }` + hover `border-color:var(--accent); background:rgba(91,157,255,0.1)`. → 평문 링크가 outline pill 버튼 묶음으로 승격돼 클릭 타깃·시각 비중↑(인벤 액션 버튼을 다크 미니멀로 흡수). 신규 색 0(기존 토큰·accent rgba 재사용). 우선순위 **보통**(상세 액션 발견성·인벤 직접 참고).

### 우선순위 종합
보통: 인벤#1(상세 액션 outline pill·인벤 직접 참고·평문→버튼)·데스크#1(related-dday D-day 색 규약 통일)·모바일#1(`.game-detail` 모바일 블록·유일 미보유 표면)·데스크#2(related-card 카테고리 tint wash). 전부 **/game/[id] 상세 표면 집중**(직전 사이클 미점검 영역)·신규 색 0·CSS 위주(일부 tsx 소폭 동반).

---

## [2026-06-03 21:06] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 블루→퍼플 그라데 타이틀·상단 광고 점선 슬롯·subtitle "국내외 신규 출시 게임을 한눈에"·'🔥 출시 임박' 4글로우카드[FF7 D-DAY 주황·미르 D-1·메이크드라마 D-1·고딕 D-2]·캘린더/리스트 토글·월탭[6월 그라데 활성]·필터행·통계 '총 44개'·캘린더 6월[주말 일#e57373/토#7aa7ff·today 3일 채움 원형·출시셀 카테고리 tint+좌띠 inset3px·범례 4색 점]·리스트[월섹션 sticky·카드 배너 카테고리 세로그라데+해치·과거'출시됨' opacity0.62 약화·D-DAY 좌상단 리본]·/game/ff7-rebirth-switch2-2026 상세[퍼플 4px 상단바+은은한 퍼플 라디얼 백드롭+D-DAY 배지+개발사/배급사/플랫폼/장르 평문 메타+'같은 시기 출시' 좌띠 미니카드 그리드]) 전부 라이브 반영 양호. 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차 — 히어로 리뷰 배너(미나 더 할로워 아트워크)+핫카드(리밋제로 테스트배지·라이브 카운트다운 07:02:57)+007 카드(아트워크+79,000원)+주간 TOP10(▲▼NEW)+아이콘 필터행, 본문은 행마다 [날짜+요일색]·아트워크 썸네일·타입배지(행사/업데이트/얼리액세스 빨강)·🇰🇷지역기·제목·태그칩(메이플스토리/오프라인/쇼케이스)·액션버튼(일정/홈페이지/영상/찜). **모바일(390)은 Chrome resize_window가 페이지 뷰포트 미반영(JS 실측 innerWidth 1920·matchMedia(480) false·docW 1905, QA·직전 사이클 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐(subtitle 위계·MonthTabs 스크롤·ViewToggle 모바일·장르칩)/IDEAS(상세 라디얼·핫카드·eventType·범례칩·필터칩·image_url 배너·헤더 듀얼radial·통계 4색·리스트배너 모바일40)/완료와 중복 없는 신규 외형 제안만. a11y/시맨틱/포커스/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·상세 정보 시각구조] 상세 `.detail-meta`(개발사/배급사/플랫폼/장르 4행)가 평문 회색 4줄 — 행 구분·라벨 위계 0이라 SEO 랜딩 첫 화면의 최대 콘텐츠 블록이 한 덩어리로 읽힘** (`app/globals.css` `.game-detail .detail-meta`/`li`/`strong` L106~108)
   - 현재: `.detail-meta{display:flex;flex-direction:column;gap:0.5rem}` + `li{font-size:0.95rem;color:#cfd6e0}` + `strong{color:#888;margin-right:0.4rem}`. "개발사 : Square Enix" 식 라벨·값이 같은 톤·같은 줄에 평평, 행 구분선 0 → 4개 항목이 분리 안 돼 스캔이 더딤(라이브 /game/ff7… 상세 실측).
   - 바꿀 값(스펙시트화·CSS only): `.detail-meta li{ display:flex; gap:0.7rem; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.92rem; color:#e6e6e6 }` + `.detail-meta li:last-child{ border-bottom:none }` + `.detail-meta strong{ flex:0 0 4.5em; color:#888; font-weight:600; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.04em; margin-right:0 }`. → 라벨 고정폭·대문자 muted / 값 밝게(#e6e6e6) / 행 hairline 구분으로 '스펙시트' 인상, 상세 본문 위계↑(신규 색 0·기존 토큰 재사용·CSS only·markup 무변경). 큐 '장르 칩'(장르 *값*만 칩화)과 공존 — 칩은 값 자리에, 행 구조는 유지. 우선순위 **높음**.

2. **[보통·섹션 헤더 위계] HeroStrip 섹션 타이틀 '🔥 출시 임박' `.title`(1.15rem/700 흰색)이 바로 아래 글로우 카드보다 시각 비중이 약함 — 페이지 첫 콘텐츠 섹션 훅인데 평범한 흰 줄** (`components/HeroStrip.module.css` `.title` L2~7)
   - 현재: `.title{ font-size:1.15rem; font-weight:700; margin-bottom:0.7rem; color:#fff }`. ListView `.monthTitle`(1.3rem/800)보다 작고, 임박 카드의 주황/카테고리색 box-shadow 글로우 대비 헤더가 묻힘.
   - 바꿀 값: `.title{ font-size:1.3rem; padding-left:0.6rem; border-left:3px solid var(--accent-warm) }`(1.15→1.3rem + warm #f5a623 좌측 3px 악센트 바 — '임박=warm' 톤·카드 글로우색과 동일 계열로 정합). → 가장 뜨거운 섹션 헤더가 시각 앵커로 승격(레이아웃 무변·기존 토큰 재사용·신규 색 0). 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[보통·모바일·가로폭 확보] `Home.module.css`에 `@media(max-width:480px)` 블록 0건 → 메인 컨테이너 `.home{padding:1rem}`(좌우 16px씩)가 390px서 본문폭을 ~358px로 깎음. 모바일 1열 캘린더/카드 그리드가 더 좁아짐** (`components/Home.module.css` `.home` L1~5 + `@media` 신설)
   - 현재: `.home{ max-width:1200px; margin:0 auto; padding:1rem }` 단일 규칙·모바일 오버라이드 없음(유일하게 모바일 블록 미보유 컴포넌트). 390px서 좌우 1rem(16px)×2=32px가 캘린더 7열·리스트 카드 폭을 깎음.
   - 바꿀 값: `@media(max-width:480px){ .home{ padding:0.7rem } .subtitle{ font-size:0.9rem; margin-bottom:0.7rem } }`(좌우 16→11px·합 10px 회수 + 좁은 폭 보조 subtitle 톤다운). → 모바일 본문폭 ~10px 확보(캘린더 셀·카드가 조금 더 시원), 데스크 무영향(신규 색 0·레이아웃만). 우선순위 **보통**.

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·날짜 요일색 일관성] 인벤은 리스트 날짜를 '06/13(토)'로 요일까지 표기하고 토/일을 색 구분 → 우린 캘린더엔 주말색(일#e57373/토#7aa7ff) 적용했지만 리스트 카드 날짜 `.date`("2026.06.04 (수)")는 요일 불문 일괄 `var(--accent)` 블루라 캘린더↔리스트 색 규약 불일치** (`components/ListView.tsx` 날짜 노드 + `ListView.module.css` `.date` L145 / `@/lib/utils` 날짜 포맷)
   - 인벤: 라이트·날짜 요일 색 구분. 우린 다크지만 이미 캘린더에 동일 규약(주말색) 보유 → 리스트도 맞추면 자체 일관.
   - 바꿀 값(다크 재해석): ListView 날짜의 *요일 부분만* 분기 색 — `release_date`의 `getDay()`로 일=#e57373/토=#7aa7ff span, 평일은 현행 `var(--accent)`. utils가 "YYYY.MM.DD (요일)" 합본 문자열이라 **요일 글자만 색칠하려면 요일을 별도 span으로 분리(tsx)** 필요 → 개발자 구현(또는 `@/lib/utils`에 요일 분리 헬퍼). 미적용 폴백=현행 일괄 블루(무해). → 캘린더에서 쓰던 주말색이 리스트 날짜에도 이어져 사이트 전역 색 규약 일관. 우선순위 **보통**(요일 분리 tsx 동반).

### 우선순위 종합
높음: 데스크#1(상세 detail-meta 스펙시트화·CSS only·SEO 첫화면 위계). 보통: 데스크#2(HeroStrip 섹션 타이틀 warm 좌띠)·모바일#1(Home 모바일 패딩 축소·유일 미보유 블록)·인벤#1(리스트 날짜 요일 주말색·캘린더와 일관, tsx 분리 동반).

---

## [2026-06-03 13:05] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 그라데 타이틀·'출시 임박' 4카드[FF7 D-DAY 주황글로우·미르 D-1·메이크드라마 D-1·고딕 D-2]·캘린더 6월[주말색 일#e57373/토#7aa7ff·today 3일 채움원형·출시셀 카테고리 tint+좌띠 inset3px]·리스트[월섹션·배너 카테고리 세로그라데+45° 해치·과거카드 opacity 0.62 약화·D-DAY 좌상단 리본]·/game/ff7-rebirth-switch2-2026 상세[퍼플 라디얼 백드롭+상단 4px바+D-DAY 배지+'같은 시기 출시' 미니카드 그리드]) 직전 출고분(리스트 배너 그라데+리본·상세 라디얼·관련그리드) 전부 라이브 반영 양호. 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차 — 히어로 리뷰 배너(미나 더 할로워 아트워크)·핫카드(리밋제로 썸네일+테스트배지+라이브 카운트다운 07:10:57)·007 카드(아트워크+79,000원)·주간 TOP10 순위·아이콘 필터행(전체/출시/테스트/얼리액세스/PC/MOBILE/PS/XBOX/SWITCH/행사). **인벤의 지배적 시각요소=게임 아트워크 이미지**(우린 image_url 대부분 null이라 색배너+해치로 대체 중). **모바일(390)은 Chrome resize_window가 페이지 뷰포트 미반영(JS 실측 innerWidth 1920·matchMedia(480) false, QA·직전 사이클 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐(subtitle 위계·MonthTabs 스크롤·ViewToggle 모바일·장르칩)/IDEAS(herostrip 좌띠·핫카드·eventType·범례칩·필터칩)/완료와 중복 없는 신규 외형 제안만. a11y/시맨틱/포커스/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·타이포·실측버그] 캘린더 셀 게임명이 단어 중간에서 깨짐 — `.cellName{ word-break:break-all }`이라 라이브에서 "파이널 판타지 7 리버스 (Switch / 2)"처럼 라틴/괄호가 글자 단위로 절단** (`components/CalendarView.module.css` `.cellName` — `word-break` 1줄 교체)
   - 현재: `.cellName{ ...; word-break:break-all; -webkit-line-clamp:2 }`. `break-all`은 한글·라틴 불문 글자 단위로 끊어 셀에서 "(Switch↵2)"·"리버스↵(Switch"처럼 단어가 어색하게 잘림(데스크 1440 라이브 zoom 확인). 한글 게임명도 어절 무시하고 임의 절단될 위험.
   - 바꿀 값: `word-break:break-all` → `word-break:keep-all`(한글 어절 보존, 공백에서만 줄바꿈) + 안전망으로 `overflow-wrap:anywhere`(공백 없는 초장문 영문만 강제 절단). 2줄 클램프·말줄임은 유지(`-webkit-line-clamp:2`·`text-overflow:ellipsis` 그대로). → 셀 게임명이 어절 단위로 자연스럽게 2줄 클램프, 라틴 단어 중간 절단 해소. CSS 1줄 교체(신규 색 0). 우선순위 **높음**(라이브 가시 결함·타이포).

2. **[보통·카테고리 차별화·통계줄] 메인 통계줄 `.stats`가 "총 44개" 단일 회색 텍스트뿐 — 카테고리 분포를 색으로 못 읽음. 카테고리 4색 인라인 카운트로 분해** (`components/Home.module.css` `.stats` + `components/Home.tsx` L163~164 stats 노드)
   - 현재: Home.tsx가 `<p className={styles.stats}>총 {filteredGames.length}개</p>`로 총합만, `.stats{ color:#aaa; font-size:0.85rem; text-align:center }` 단조 회색 한 줄. 캘린더 범례(모바일·PC콘솔·글로벌·신서버 4색)와 별개로, 데이터 규모/구성을 한눈에 줄 자리인데 색·구성 정보 0.
   - 바꿀 값(카테고리 시각 차별화): stats 노드를 카테고리별 카운트 span으로 — `<span style={{color: CATEGORY_META[c].color}}>{label} {n}</span>`을 가운뎃점으로 연결 후 끝에 회색 `총 {total}개`. CSS는 `.stats{ font-size:0.9rem; font-weight:500 }` 유지 + 각 span 카테고리색(4색 #81c784/#64b5f6/#ba68c8/#ff8a65 단일출처 재사용, 신규 색 0). **데이터 보유**(filteredGames·category 전부). → 통계줄이 캘린더 범례와 색 정합되는 미니 분포 바로 승격, 카테고리 구성을 색으로 즉시 스캔. (markup 소폭 변경 동반 → 개발자 구현.) 우선순위 **보통**.

3. **[보통·헤더 임팩트] `.site-header` 백드롭 글로우가 단일 블루 radial(rgba(91,157,255,0.10))뿐 — h1 타이틀은 블루→퍼플 그라데(`--accent-grad`)인데 헤더 면은 블루만이라 정합 약함. 듀얼 브랜드 radial로 히어로 밴드 강화** (`app/globals.css` `.site-header::before` L52~)
   - 현재: `.site-header::before{ background:radial-gradient(60% 120% at 50% 0%, rgba(91,157,255,0.10), transparent 70%) }` 중앙 단일 블루. h1은 `--accent-grad`(#5b9dff→#c98ad6) 그라데 텍스트인데 배경 글로우엔 퍼플(#c98ad6=`--accent-2`)이 없어 헤더가 다소 평평·블루 일변.
   - 바꿀 값: `.site-header::before` 배경을 듀얼 radial로 — `background:radial-gradient(50% 120% at 25% 0%, rgba(91,157,255,0.12), transparent 65%), radial-gradient(50% 120% at 78% 0%, rgba(201,138,214,0.10), transparent 65%)`(좌=브랜드 블루·우=`--accent-2` 퍼플, 둘 다 기존 토큰색). → 헤더 밴드가 h1 블루→퍼플 그라데와 색 정합되어 첫 화면 임팩트↑(레이아웃·높이 무변, ::before 배경만). 신규 색 0(기존 accent/accent-2 재사용). 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[보통·모바일·리스트 밀도] `.cardBanner{ height:56px }`에 모바일 오버라이드 0 → 1열 스택되는 모바일에서 콘텐츠 없는 56px 색배너가 카드마다 쌓여 세로 리듬이 늘어지고 첫 화면 카드 수 감소** (`components/ListView.module.css` `@media(max-width:480px)`에 `.cardBanner` 추가)
   - 현재: `.cardBanner{ height:56px }` 고정, 모바일 블록(`@media(max-width:480px){ .grid{grid-template-columns:1fr} ... }`)엔 배너 높이 조정 없음. 390px서 카드가 1열 세로 스택이라 56px 색띠(이미지 없는 그라데+해치)가 카드마다 반복돼 정보 대비 장식 비중↑·스크롤당 노출 카드↓.
   - 바꿀 값: `@media(max-width:480px)`에 `.cardBanner{ height:40px }`(해치/그라데·D-DAY 리본 유지, 리본 `border-radius:0 0 8px 0`도 40px서 정상) 추가. → 모바일 카드가 콤팩트해져 한 화면에 더 많은 게임 노출·세로 리듬 타이트(데스크 56px 무영향). 레이아웃만(신규 색 0). 우선순위 **보통**.

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·배너 이미지] 인벤의 지배적 시각요소는 게임 아트워크 이미지(히어로 리뷰 배너·핫카드 썸네일·007 카드)인데, 우리 `.cardBanner`/히어로 카드는 `image_url`을 전혀 안 그리고 색 그라데+해치로만 대체 → image_url 있을 때 배경 이미지로 렌더(다크 오버레이) + 없으면 현행 색배너 폴백** (`components/ListView.module.css` `.cardBanner` + `components/ListView.tsx` 배너 노드)
   - 인벤: 라이트·아트워크 빽빽(가격·평점까지). 우린 다크·미니멀 → 이미지 위 다크 그라데 오버레이로 톤다운, 채도 절제.
   - 바꿀 값(다크 재해석): ListView.tsx `.cardBanner` 노드에서 `g.image_url` 있을 때 인라인 `backgroundImage:linear-gradient(180deg, rgba(15,17,21,0.15), rgba(15,17,21,0.85)), url(image_url)` + `background-size:cover; background-position:center`, 없으면 현행 `--cat` 색배너 분기 + 모듈 CSS에 `.cardBannerImg` 헬퍼. **`image_url`은 스키마 보유 필드이나 현재 대부분 null → 폴백=현행 색배너(무해), 리서처가 이미지 채우는 만큼 점진 점등.** 카테고리 좌상단 리본·과거 약화(`.released .cardBanner{filter:saturate(0.55)}`)와 무충돌. → 인벤식 '배너 이미지 적극 활용'을 다크 오버레이로 흡수, 이미지 보유 게임부터 카드가 풍부해짐. (image_url 데이터 채움은 리서처 영역·별개 트랙.) 우선순위 **보통**.

### 우선순위 종합
높음: 데스크#1(캘린더 셀명 break-all→keep-all·라이브 가시 결함). 보통: 데스크#2(통계줄 카테고리 4색 분해)·#3(헤더 듀얼 브랜드 radial)·모바일#1(리스트 배너 모바일 40px)·인벤#1(image_url 배경 이미지 지원+폴백).


---

## [2026-06-03 09:05] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — 메인(h1 게임패드 그라데 타이틀·'출시 임박' 4카드[FF7 D-DAY 주황 글로우·미르 D-1·메이크드라마 D-1·고딕 D-2 카테고리 글로우]·캘린더 6월[주말 일#e57373/토#7aa7ff·today 3일 채움 원형·출시셀 카테고리 tint+좌띠]·리스트[월섹션·released 카드 opacity 0.62 약화]·/game/ff7-rebirth-switch2-2026 상세[글로벌 퍼플 상단바+D 배지]) 전부 라이브 반영 양호. 직전 출고(임박 글로우·GameModal 모바일 블록·과거카드 약화) 확인. 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차(핫카드 라이브 카운트다운·주간 TOP10·아이콘 칩 필터행·행마다 타입배지/지역기/태그칩/액션버튼). **모바일(390)은 Chrome resize_window가 페이지 뷰포트 미반영(렌더 1568px 고정·QA·직전 사이클 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐(캘린더 패널 카드화·같은시기 그리드·상세 라디얼 백드롭·리스트 배너 그라데+리본)/IDEAS(핫카드+카운트다운·eventType 배지·위시 TOP·카테고리 필터칩·범례 칩·헤더 히어로 밴드)/완료와 중복 없는 신규 외형 제안만. a11y/시맨틱/포커스/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·위계] 인트로 카피 `.subtitle` "국내외 신규 출시 게임을 한눈에"가 상단 광고 슬롯과 '🔥 출시 임박' 사이에 회색 #888·0.95rem 한 줄로 붕 떠 헤더~히어로 사이가 비고 위계 약함** (`components/Home.module.css .subtitle` L6)
   - 현재: `.subtitle{ text-align:center; color:#888; font-size:0.95rem; margin-bottom:1rem }`. h1(2.1rem 블루→퍼플 그라데)과 임박 스트립 사이의 유일한 카피인데 페이지에서 가장 약한 회색·작은 글씨라 시선을 못 끌고 점선 광고 placeholder 아래에 외롭게 뜸.
   - 바꿀 값: 1차(저비용) `.subtitle{ color:#cfd6e0; font-size:1.1rem; font-weight:500; letter-spacing:-0.01em; margin:0.2rem 0 1.4rem }`로 톤업. 임팩트 큰 안=헤더 통합 — Home.tsx의 subtitle 노드를 `app/globals.css .site-header` 안(h1 바로 아래)으로 이동해 "타이틀+태그라인" 한 덩어리로(헤더 radial glow 배경 공유, 광고 슬롯 위로 올라감). DOM 이동이 부담이면 톤업만으로도 위계↑. 우선순위 **높음**(첫 화면 카피·CSS 위주).

2. **[보통·광고 placeholder] `.ad-slot` placeholder가 1.5px dashed 보더(rgba .18)라 광고 미게재 상태에서 빈 점선 박스가 콘텐츠보다 튐 — 특히 /game/[id] 상세는 상·하단 placeholder 2개가 카드보다 큰 면적을 먹어 첫인상이 '광고 2개+카드 1개'** (`app/globals.css .ad-slot` L157·`.ad-slot-mid` L167)
   - 현재: `.ad-slot{ min-height:90px; border:1.5px dashed rgba(255,255,255,0.18); background:rgba(255,255,255,0.02) }` + `.ad-slot-mid{min-height:250px}` + 라벨 `color:#555` "광고 자리 (상단)". 점선 박스+라벨이 또렷해 빈 광고칸이 시선을 뺏음.
   - 바꿀 값: placeholder를 차분히 — `border:1px solid rgba(255,255,255,0.05)`(dashed→solid 헤어라인)·`background:transparent`·라벨 `color:#3a3f48`(더 옅게)·`.ad-slot-mid{ min-height:160px }`(250→160 축소). 실제 광고 삽입 시 자연히 채워짐(무해). → 빈 광고칸이 가라앉고 콘텐츠가 앞으로. 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[높음·모바일 필수] MonthTabs 12탭이 모바일서 가로 스크롤(`.tabs{ overflow-x:auto; flex-wrap:nowrap }`)인데 스크롤 가능 신호가 0 → 잘린 우측 탭(9~12월)이 안 보여 월 탐색 발견성 저하** (`components/MonthTabs.module.css .tabs` L1 + `@media(max-width:480px)`)
   - 현재: `.tabs{ display:flex; flex-wrap:nowrap; overflow-x:auto; scrollbar-width:thin }`, 모바일 블록은 `.tab` 패딩/폰트만 축소. 390px서 12개 알약탭이 한 줄 가로 스크롤되지만 엣지 페이드·스냅이 없어 "더 있다"는 시각 신호 부재.
   - 바꿀 값: `@media(max-width:480px)`에 `.tabs{ scroll-snap-type:x proximity; -webkit-overflow-scrolling:touch; mask-image:linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%); -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%); }` + `.tab{ scroll-snap-align:center }`. 우측 끝 페이드로 스크롤 암시·활성월 중앙 스냅. → 모바일 월 탐색 발견성↑(데스크톱 무영향, mask 미지원 시 폴백=현행 스크롤 유지). 우선순위 **높음**.

2. **[보통·모바일 일관성] ViewToggle만 @media(max-width:480px) 블록 부재 → 캘린더/리스트 2버튼이 모바일서 `0.5rem 1rem` 패딩 그대로라 가운데 작게 모여 좁음, Filters·GameModal 모바일 블록 신설 흐름과 어긋남** (`components/ViewToggle.module.css` @media 신설)
   - 현재: ViewToggle.module.css에 모바일 블록 0건(Filters·GameModal는 최근 신설). `.toggle{ justify-content:center }` + `.btn{ padding:0.5rem 1rem; font-size:0.95rem }` 고정 → 390px서 두 버튼이 중앙에 작게 뭉쳐 터치 폭 좁음.
   - 바꿀 값: `@media(max-width:480px){ .toggle{ gap:0.5rem } .btn{ flex:1 1 0; padding:0.6rem 0.5rem; text-align:center } }` → 캘린더/리스트가 화면폭 2분할 풀폭 버튼(터치 면적↑·좌우 균형). 레이아웃만(신규 색 0). 우선순위 **보통**(Filters/GameModal 모바일 블록 신설 선례와 동형 — 마지막 남은 미보유 컴포넌트).

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·장르 칩] 인벤은 행마다 키워드/장르 태그 칩(메이플스토리·오프라인·쇼케이스 등 연한 색 pill)을 달아 성격을 한눈에 → 우린 `genres[]` 데이터(44/44 전부 보유)를 상세에서 "장르 : RPG, 액션" 평문으로만, 리스트 카드엔 0** (`components/ListView.tsx` `.cardBody` L108~ + `ListView.module.css` 신규 `.genreChips`/`.genreChip`)
   - 인벤: 라이트·태그 빽빽. 우린 다크·미니멀 → 카드당 최대 2~3개만 절제.
   - 바꿀 값(다크 재해석): ListView.tsx `.cardBody`의 `.desc` 위(또는 `.date` 아래)에 `{g.genres?.slice(0,3).map(t => (<span key={t} className={styles.genreChip}>{t}</span>))}`를 `<div className={styles.genreChips}>`로 감싸 추가 + CSS `.genreChips{ display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.4rem }` · `.genreChip{ font-size:0.7rem; color:#9aa3b2; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07); padding:0.1rem 0.5rem; border-radius:999px }`. 카테고리 4색과 겹치지 않게 **무채색 칩**(카테고리=색면 / 장르=중성칩으로 위계 분리). **데이터 보유=리서처 선결 불필요.** 상세 `/game/[id]`의 "장르 :" 평문도 같은 칩으로 통일 가능. → 카드 성격을 색 없이도 즉시 파악·인벤 정보량을 미니멀 다크로 흡수. 우선순위 **보통**.

### 우선순위 종합
높음: 데스크#1(인트로 카피 위계·헤더 통합)·모바일#1(MonthTabs 가로 스크롤 어포던스). 보통: 데스크#2(광고 placeholder 약화)·모바일#2(ViewToggle 모바일 블록, 선례 동형)·인벤#1(장르 칩, 데이터 보유).

---

## [2026-06-03 05:05] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440 라이브 — **Next 앱 정상 배포 확인**(개발자 vercel.json 출고 반영: h1 SVG 게임패드 그라데 타이틀·'출시 임박' 4카드[FF7리버스 D-DAY·미르 D-1·메이크드라마 D-1·고딕 D-2]·캘린더 6월[주말색 일#e57373/토#7aa7ff·today 3일 채움원형·출시셀 카테고리 tint+좌띠]·리스트뷰[월섹션 배너카드]·/game/ff7-rebirth-switch2-2026 상세[카테고리 상단바+D-1 배지+메타행] 전부 라이브). 직전 큐 출고(주말색·today원형·모바일 cellHas·구accent #4a90e2→#5b9dff 통일·Filters 모바일블록) 반영 양호. 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차. **모바일(390)은 Chrome resize_window가 페이지 뷰포트 미반영(innerWidth 1920 고정·matchMedia(480) false, QA·직전 사이클 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐(임박글로우·관련게임그리드·리스트배너그라데+리본·범례칩)/IDEAS(핫카드+카운트다운·eventType배지·위시TOP·필터토큰)/완료와 중복 없는 신규 외형 제안만. a11y/시맨틱/포커스/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·리스트 위계] 기간 기본 '전체(과거+미래)'라 리스트 최상단이 2025/과거 '출시됨' 카드인데, 다가오는 게임과 시각 비중이 동일 → 과거(출시됨) 카드 시각 약화로 신작이 먼저 눈에** (`components/ListView.tsx` 카드 `<li>` + `components/ListView.module.css`)
   - 현재: 라이브 리스트 진입 시 '2025년 12월'·'2026년 3월' 등 과거 섹션이 맨 위, 각 카드는 우상단 회색 '출시됨' 텍스트 외엔 배너 색·이름·설명이 미래 게임과 100% 동일 밝기 → 첫 스크롤에서 끝난 게임이 신작만큼 시선을 먹음(`.imminent`만 amber 보더로 강조, 과거 약화는 0).
   - 바꿀 값: ListView.tsx 카드(이미 출시 여부 판정 보유 — '출시됨' 라벨 렌더 중)에서 과거 게임에 `styles.released` 부여 → CSS 신규 `.released{ opacity:0.62; }` + `.released .cardBanner{ filter:saturate(0.55); }` + 우상단 '출시됨'을 회색 미니칩 `.releasedTag{ font-size:0.7rem; color:#888; background:rgba(255,255,255,0.05); padding:0.12rem 0.5rem; border-radius:999px; }`. `.released:hover{ opacity:1; }`로 되살려 탐색성 유지. → 끝난 게임은 차분히 가라앉고 다가오는 신작이 또렷이 앞으로. 우선순위 **높음**(기본 뷰 첫인상·CSS 위주·변경량 작음).

2. **[보통·상세 깊이] /game/[id] 상세 카드(700px)가 평면 #0f1115 검정 공백 한가운데 떠 페이지 ~60%가 빈 검정 → 카테고리색 라디얼 백드롭으로 깊이/브랜드색** (`app/game/[id]/page.tsx` 래퍼 + `app/globals.css .game-detail` 주변)
   - 현재: 상세 배경은 전역 `body{background:#0f1115}` 평면, `.game-detail`(max-width 700px) 카드만 떠 좌우+하단이 텅 빈 검정(상·하단 광고 자리 사이 카드 1개). 카테고리 상단바(4px)·D-day 배지는 출고됐으나 **면(背) 깊이는 0**.
   - 바꿀 값(다크 재해석): page.tsx에서 상세 컨테이너에 인라인 `style={{ background:'radial-gradient(80% 45% at 50% 0%, '+CATEGORY_META[game.category].color+'22, transparent 60%)' }}`(α≈hex+22, 카테고리 4색 #81c784/#64b5f6/#ba68c8/#ff8a65 재사용) — 카드 위쪽으로 카테고리색이 은은히 번지는 백드롭. 미지원 폴백=평면 유지(무해). → 검색 유입 첫 화면(SEO 랜딩 성격)이 카테고리색 분위기로 살아남. 큐 '같은 시기 출시 그리드'(공백을 콘텐츠로 채움)와 **공존**(이건 색 깊이) — 동시 적용 시 시너지. 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[높음·모바일 필수] GameModal만 유일하게 @media(max-width:480px) 블록 부재 → 390px에서 모달 패딩/제목·이미지 과대·본문 여백 부족** (`components/GameModal.module.css` — `@media(max-width:480px)` **신설**)
   - 현재: 타 전 컴포넌트(CalendarView/HeroStrip/ListView/MonthTabs/Filters/globals)엔 모바일 블록이 있는데 GameModal엔 0건. `.overlay{padding:1rem}` + `.modal{max-width:520px;width:100%;padding:1.6rem;border-radius:14px}` 고정 → 390px서 모달 실폭 ~358px인데 좌우 1.6rem(≈26px)씩 패딩이 본문폭을 더 깎고 `.title{font-size:1.4rem}`·`.image{height:100px}`·`.imageEmoji{font-size:3rem}`이 좁은 폭에 과대. (직전 'Filters 모바일 블록 부재'와 동형 누락.)
   - 바꿀 값: `@media(max-width:480px)` 신설 — `.overlay{padding:0.6rem}`(본문폭 확보) · `.modal{padding:1.2rem;border-radius:12px;max-height:92vh}` · `.title{font-size:1.2rem}` · `.image{height:78px;margin-bottom:0.6rem}` · `.imageEmoji{font-size:2.2rem}` · `.actions{gap:0.4rem}`. → 좁은 화면에서 모달 본문폭 확보·제목/이미지 비례 정돈. 우선순위 **높음**(모바일 필수·신규 블록 1개, Filters 선례와 동일 성격).

2. **[보통·모바일 임박] HeroStrip 모바일 컴팩트 행의 카테고리 신호가 8px 점 1개뿐 → 카테고리색 좌측 보더로 강화** (`components/HeroStrip.module.css` @media(max-width:480px))
   - 현재: 모바일 블록에서 `.cat`(카테고리 텍스트) `display:none`, 대신 `.dot{width:8px;height:8px;background:var(--cat)}` 8px 점 1개만 카테고리 신호(`.card`는 44px 행). 모바일 첫 화면 훅인 '출시 임박' 행에서 8px 점은 약함 — 데스크톱은 `.cat` 텍스트로 카테고리 명시인데 모바일은 작은 점으로 후퇴.
   - 바꿀 값: @media(max-width:480px) `.card`에 `border-left:3px solid var(--cat, #f5a623); padding-left:0.65rem;`(기존 `padding:0.55rem 0.8rem` 좌측만 조정). 점(.dot)은 유지하거나 보더로 대체. → 카테고리색이 행 좌측 띠로 즉시 읽혀 모바일 임박 스트립 카테고리 구분 강화(데스크 `.card::before` glow와 톤 일치). 우선순위 **보통**.

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·필터 칩] 인벤 필터는 아이콘+라벨 칩 row(전체/출시/테스트/얼리액세스/PC/MOBILE/PS/XBOX/SWITCH/행사)인데 우린 카테고리/플랫폼/기간이 전부 무채색 `<select>` 드롭다운 → 카테고리 필터를 카테고리색 칩 row로 재해석(월탭 톤)** (`components/Filters.tsx` 카테고리 select + `components/Filters.module.css`)
   - 인벤: 필터를 한 줄 아이콘 칩으로 펼쳐 선택지가 한눈에·클릭 1회(우린 드롭다운 펼침 2단계). 단 인벤 라이트·아이콘 빽빽 → 우린 다크·미니멀로 절제.
   - 바꿀 값(다크 재해석): 카테고리 `<select>`(전체/모바일/PC·콘솔/글로벌/신규서버)를 `MonthTabs`와 동일 칩 row로 — `.catChips{display:flex;flex-wrap:wrap;gap:0.4rem}` + 각 칩 `padding:0.4rem 0.85rem;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)`, 활성 칩은 카테고리색 tint `background:color-mix(in srgb,var(--cat) 18%,#14171d);border-color:var(--cat);color:var(--cat)`('전체'는 `--accent-grad`). 보유 카테고리 4색 토큰 재사용·신규 색 0. 플랫폼/기간은 사용빈도 낮아 select 유지(미니멀). → 가장 자주 쓰는 카테고리 필터가 색 칩으로 한눈에, 월탭·뷰토글 칩 톤과 통일. (select→칩 전환은 상호작용 변경 동반 → 기획자/개발자 판단.) 우선순위 **보통**.

### 우선순위 종합
높음: 데스크톱#1(과거 카드 약화·기본뷰 첫인상)·모바일#1(GameModal 모바일 블록 신설, Filters 선례 동형). 보통: 데스크톱#2(상세 라디얼 백드롭, 큐 관련게임그리드와 공존)·모바일#2(임박 행 카테고리 좌띠)·인벤#1(카테고리 필터 색칩 row).

---

## [2026-06-03 01:05] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440(홈 캘린더 6월/임박 스트립 4카드/리스트 뷰 + /game/sol-enchant-20260618 상세 'D-16') + 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차. 신규 Next 소스 교차(components/CalendarView.module.css·ListView.module.css·GameModal.module.css·Filters.module.css·HeroStrip.module.css·app/globals.css). 직전 출고(주말 색 일=#e57373·토=#7aa7ff 헤더+셀 / today 채움 원형 .cellTodayNum / 출시셀 카테고리 tint·좌띠 / 상세 카테고리 상단바+D-day / 이모지→SVG / Pretendard·헤더 그라데 타이틀) 라이브 반영 양호 확인. **모바일(390)은 Chrome resize_window가 페이지 뷰포트에 미반영(렌더 폭 1568px·innerWidth 고정, QA·직전 디자이너와 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐(임박 글로우·관련게임 그리드·리스트 배너 그라데·--accent-grad 칩)/완료/IDEAS와 중복 없는 신규 외형 제안만. a11y/시맨틱/포커스/리팩토링 0건(외형 모드 — focus-visible #4a90e2 잔존 2건도 의도적 제외).

### 데스크톱(1440) 점검
1. **[높음·팔레트 일관성] 리스트/모달/캘린더에 구(舊) accent `#4a90e2`·`rgba(74,144,226,..)` 리터럴 잔존 → 브랜드 `var(--accent)` #5b9dff / 동톤 rgba로 통일** (여러 파일 색값 치환, 변경량 작음)
   - 현재: 헤더·뷰토글·월탭·today는 갱신된 선명 블루 #5b9dff인데, 아래 면들은 마이그레이션 전 칙칙한 #4a90e2가 잔존해 **같은 '브랜드 블루'가 화면마다 두 톤으로 갈림**(리스트 날짜가 헤더 타이틀보다 탁함):
     · `components/ListView.module.css` `.date{color:#4a90e2}`(L143)→`var(--accent)`; `.item:hover{border-color:#4a90e2}`(L72)→`var(--accent)`; 같은 hover `box-shadow:...rgba(74,144,226,0.3)`(L73)→`rgba(91,157,255,0.3)`; `.monthHeader{border-bottom:2px solid rgba(74,144,226,0.3)}`(L16)→`rgba(91,157,255,0.3)`.
     · `components/GameModal.module.css` `.source{color:#4a90e2}`(L59)→`var(--accent)`; `.detail:hover{background:rgba(74,144,226,0.15);border-color:rgba(74,144,226,0.5)}`(L74)→각 `rgba(91,157,255,0.15)`·`rgba(91,157,255,0.5)`. (단 `.gcal:hover`의 `rgba(66,133,244,..)`(L73)는 구글 캘린더 브랜드 블루 의도 → **유지**.)
     · `components/CalendarView.module.css` `.todayBtn:hover{background:rgba(74,144,226,0.22)}`(L30)→`rgba(91,157,255,0.22)`. (`.cell:focus-visible`/`.cellClickable:focus-visible`의 #4a90e2 2건은 포커스=a11y 영역 → 외형 모드 제외.)
   - → 브랜드 강조색이 전 표면에서 한 톤(#5b9dff)으로 정렬, 리스트·모달의 탁한 블루 해소. 우선순위 **높음**(일관성 핵심·치환만).

2. **[보통·캘린더 범례] 카테고리 범례가 8px 점+회색 텍스트(#aaa)로 약해 셀 색띠와 매칭이 더딤 → 카테고리 tint 미니 칩으로** (`components/CalendarView.tsx` L104 legend / `CalendarView.module.css` `.legendItem`·`.legendDot` L41-42)
   - 현재: `.legendItem{gap:0.3rem}` + `.legendDot{width:8px;height:8px}` + `.legend{color:#aaa;font-size:0.8rem}` — 작은 점 4개라 셀의 `color-mix 8%` tint·좌측 띠 색과 눈으로 잇기 약함.
   - 바꿀 값: tsx에서 각 item에 `style={{['--lc' as string]: CATEGORY_META[c].color}}` 주입 → `.legendItem{ padding:2px 9px; border-radius:999px; background:color-mix(in srgb, var(--lc) 14%, #14171d); color:var(--lc); font-weight:600; }`(미지원 폴백 기존 점 유지). 점(.legendDot)은 칩 내 유지 또는 제거. → 범례 칩 배경이 셀 tint와 동일 색면이라 "이 색=이 카테고리"가 즉시 읽힘. 우선순위 **보통**.

3. **[보통·필터 폴리시] 검색창/셀렉트/위시 버튼이 구 border `#2a2e38`·radius 6px 플랫이라 카드(10~14px)·토글 톤과 안 맞음 → 토큰 정렬** (`components/Filters.module.css` `.search` L8·`.label select` L25·`.wishBtn` L33)
   - 현재: 세 요소 모두 `border:1px solid #2a2e38; border-radius:6px`. globals의 `--border`·`--radius-sm:8px` 토큰과 불일치(6px만 각져 주변 라운드와 어긋남).
   - 바꿀 값: 세 요소 `border-color:#2a2e38→var(--border)`, `border-radius:6px→var(--radius-sm)`(8px). 입력 hover `border-color:rgba(91,157,255,0.5)`로 살짝 반응(포커스 링은 a11y → 제외). → 필터 행이 카드/뷰토글의 보더·라운드 톤과 통일. 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[높음·모바일 필수] Filters에 모바일 블록 자체가 없음 → 390px에서 검색+셀렉트3+위시 버튼이 불규칙 줄바꿈·셀렉트 폭 들쭉날쭉** (`components/Filters.module.css` — `@media(max-width:480px)` **신설**)
   - 현재: `.filters{display:flex;flex-wrap:wrap;gap:0.6rem;align-items:flex-end}` 단일 규칙뿐, 모바일 블록 0건(다른 컴포넌트엔 다 있음 — CalendarView/HeroStrip/ListView/MonthTabs/globals). 390px에선 `.search{flex:1 1 200px;min-width:180px}`가 거의 한 줄을 먹고 카테고리/플랫폼/기간 셀렉트 3개+위시 버튼이 남는 폭에 불균등 줄바꿈 → 필터 행 정렬 흐트러짐.
   - 바꿀 값: `@media(max-width:480px)` 신설 — `.filters{gap:0.5rem}` · `.search{flex:1 1 100%}` · `.label{flex:1 1 calc(50% - 0.25rem)}` · `.label select{width:100%}` · `.wishBtn{flex:1 1 100%; text-align:center}` → 검색=풀폭 1줄, 셀렉트=2×2 그리드형, 위시=풀폭 버튼. 좁은 화면에서 필터가 정돈된 2열로. 우선순위 **높음**(모바일 필수·신규 블록 1개).
   - 덤: 위 데스크톱#2 범례 칩은 `.legend{flex-wrap:wrap}`이라 모바일에서도 자동 적용 → 좁은 폭 범례 가독성도 같이 개선.

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·핫카드] 인벤 우상단 '핫 카드'(임박 1건 대형 카드 + Days:Hours:Min:Sec 라이브 카운트다운 + 가격) → 우리 '🔥 출시 임박' 스트립의 최근접(D-0~D-1) 1건을 대형 핫카드로 승격 + 라이브 카운트다운** (`components/HeroStrip.tsx` + `HeroStrip.module.css`)
   - 인벤: 단일 대형 카드에 실시간 카운트다운(07:22:58:34)으로 임박감 극대화 + 가격(79,000원). 우린 `.strip` 4등분 균일 카드 + 정적 D-DAY 텍스트뿐.
   - 바꿀 값(다크 재해석): `.strip` 첫 카드를 `grid-column: span 2`로 넓힘(또는 스트립 위 별도 `.hotCard`) — 게임명 1.15rem→1.5rem, D-DAY(`.dday` 1.8rem) 아래 `HH:MM:SS` 카운트다운(1rem/700·`color:#f5a623`·1초 setInterval). 카테고리색 radial glow는 기존 `.card::before` 재사용. **데이터 무관**(출시일시만, 이미 보유). 큐의 '임박 스트립 글로우(데스크톱)'와는 별개 개념(글로우=균일 카드 강조 / 핫카드=최근접 1건 대형화)이라 묶을지·택1은 기획자 판단. 가격은 데이터 필드 없음 → 생략 or 리서처 `price` 선결. 우선순위 **보통**.
2. **[보통·이벤트 타입 태그] 인벤은 출시/테스트/얼리액세스/업데이트/행사/쇼케이스를 색상 타입 배지로 구분(+🇰🇷 지역 플래그) → 우린 '출시' 단일** (데이터 선결 — 리서처 `eventType`/`region` 필드)
   - 인벤 캘린더 본문: 각 행 좌측에 '행사'(빨강)·'업데이트'(빨강)·'얼리액세스' 타입 배지 + 🇰🇷 지역 + 태그칩 — 같은 '게임'이라도 출시/테스트/쇼케이스를 색으로 즉시 구분.
   - 바꿀 값(다크 재해석): 리스트 카드 헤더(또는 캘린더 셀)에 `eventType` 마이크로 배지 1개 — 테스트=청록 #4dd0e1·얼리액세스=보라 #9575cd·쇼케이스/행사=앰버 #f5a623·업데이트=회청 #78909c(우리 카테고리 4색과 채도/색상 겹치지 않게 톤다운). 인벤처럼 빽빽이 말고 **1개 배지만**(미니멀 유지). **데이터 선결**: data/games.json에 `eventType` 필드(+선택 `region` KR/US/GL) → 리서처/기획자 결정. (산업 행사 SGF/GDC/NDC 포함도 같은 필드로 확장.) 우선순위 **보통**(데이터 선결).

### 우선순위 종합
높음: 데스크톱#1(구 accent #4a90e2→#5b9dff 통일·전 표면 브랜드색 일관)·모바일#1(Filters 모바일 블록 신설). 보통: 데스크톱#2(범례 칩, 모바일도 수혜)·#3(필터 토큰 정렬)·인벤#1(핫카드+카운트다운, 데이터 무관)·인벤#2(이벤트 타입 배지, 데이터 선결).

---


## [2026-06-02 20:50] [디자이너] - 외형 모드 + 인벤 비교
실측: gcalen.com Chrome 데스크톱 1440(홈 캘린더/임박 스트립/리스트 뷰 + /game/sol-enchant-20260618 상세) + 인벤(https://www.inven.co.kr/webzine/calendar/) 데스크 1440 교차. 신규 Next 소스 교차(app/globals.css·components/CalendarView.tsx·CalendarView.module.css·ListView.module.css·Home.module.css). 직전 출고(Pretendard·accent #5b9dff·헤더 그라데이션 타이틀·뷰토글/월탭 그라데 칩·출시 셀 카테고리 색띠·상세 D-day 배지+카테고리 상단바) 라이브 반영 양호 확인. **모바일(390)은 Chrome resize_window가 페이지 뷰포트에 미반영(렌더 폭 1568px 고정, QA와 동일 한계)→ @media(max-width:480px) 소스 검증으로 대체.** 아래는 큐/완료/IDEAS와 중복 없는 신규 외형 제안만. a11y/시맨틱/리팩토링 0건(외형 모드).

### 데스크톱(1440) 점검
1. **[높음·캘린더·인벤정렬] 요일 헤더·날짜에 주말 색 구분 0 → 일=빨강/토=파랑 (한국 달력 관습)** (`components/CalendarView.tsx` L114 dayHead map + 셀 날짜 / `components/CalendarView.module.css`)
   - 현재: `.dayHead{color:#888}`(L59) 7요일 전부 동일 회색, 셀 날짜 `.cellDate{color:#cfd6e0}`(L104) 전부 동일. 일/토 구분 신호 0 → 주 경계 스캔 어려움. 인벤은 일요일 빨강·토요일 파랑으로 즉시 구분(한국 달력 표준).
   - 바꿀 값: CalendarView.tsx L114를 `{['일','월','화','수','목','금','토'].map((d,i)=>(<div key={d} className={`${styles.dayHead} ${i===0?styles.sun:i===6?styles.sat:''}`}>{d}</div>))}`. module.css 신규 `.sun{color:#e57373}` `.sat{color:#7aa7ff}`(다크 톤용 채도 down — danger #e74c3c·accent #5b9dff 원색은 다크 배경서 쨍함). 셀 날짜도 `date.getDay()` 기반 동일 클래스 → `.cellDate.sun{color:#e57373}` `.cellDate.sat{color:#7aa7ff}`(단 .cellToday/.cellSelected 강조 셀은 흰색 유지해 충돌 회피). → 라이트 인벤을 다크 톤다운으로 재해석, 주말 즉시 식별. 우선순위 **높음**.

2. **[보통·캘린더·오늘 강조] today 셀이 옅은 테두리(inset 2px)+작은 '오늘' 칩뿐 → 날짜 숫자를 채움 원형으로(구글캘린더식)** (`components/CalendarView.module.css` .cellToday/.cellTodayBadge + CalendarView.tsx 날짜 span)
   - 현재: `.cellToday{background:rgba(74,144,226,0.08);box-shadow:inset 0 0 0 2px #4a90e2}`(L94) + 별도 `.cellTodayBadge`(파란 작은 칩, L111). 실측(6/2 오늘 셀)에서 "오늘"이 비어 보이고 앵커가 약함. (덤: 모듈이 #4a90e2 하드코딩 — globals --accent #5b9dff와 불일치, var(--accent)로 통일 권고.)
   - 바꿀 값: 오늘 셀 날짜 숫자 span에 채움 원형 — `width:1.5em;height:1.5em;border-radius:50%;background:var(--accent);color:#fff;font-weight:700;display:inline-flex;align-items:center;justify-content:center`. 그러면 `.cellTodayBadge`("오늘" 텍스트) 제거 가능→셀 공간 절약. 셀 테두리는 약화(`#4a90e2`→`rgba(91,157,255,0.45)`)해 원형과 이중강조 과함 방지. → 친숙한 today 앵커, 첫 진입 시 "오늘"이 한눈에. 우선순위 **보통**.

### 모바일(390) 점검 (소스 검증 — Chrome resize 미반영)
1. **[높음·모바일 필수] 모바일 캘린더는 게임명 숨김(cellName display:none) 상태라 출시일=점만 → cellHas tint/색띠/점 강화로 색 가독성 확보** (`components/CalendarView.module.css` @media(max-width:480px) L237~243)
   - 현재: 모바일 블록에 `.cellName{display:none}`(L240) — 64px 작은 셀에서 게임명 제거, 색점(`.cellDot` 6px)만 신호. 그런데 `.cellHas` tint는 데스크와 동일 `color-mix 8%`(L91)·띠 3px라 64px 셀에선 거의 안 읽힘 → 출시일이 빈 셀과 구분 약함(좌측 3px 띠에만 의존). 모바일은 이름이 없어 '색'이 유일 신호인데 그 색이 약함.
   - 바꿀 값: @media(max-width:480px)에 `.cellHas{ background:#1d2330; background:color-mix(in srgb, var(--cat,#5b9dff) 16%, #14171d); box-shadow:inset 4px 0 0 var(--cat,#5b9dff); }`(tint 8%→16%·띠 3→4px, 폴백 #1d2330 선행) + `.cellDot{width:7px;height:7px}`(6→7). → 이름 없는 모바일 캘린더에서 출시일이 카테고리 색면으로 또렷이 떠오름. 우선순위 **높음**.

### 인벤 참고 ('인벤에 있는데 우리에게 필요')
1. **[보통·신규컴포넌트] 인벤 '주간 TOP 게임 순위'(우측 1~10위+등락 ▲▼NEW) → 우리식 '⭐ 위시리스트 인기 TOP 5' 다크 가로 위젯** (신규 `components/PopularWishlist.tsx` + .module.css, 히어로 스트립 아래)
   - 인벤: 라이트 우측 사이드바에 빽빽한 순위표. 우린 단일 컬럼·다크라 사이드바 부적합 → '🔥 출시 임박' 스트립 아래 **가로 5카드** 섹션으로 재해석.
   - 바꿀 값: 카드 = 순위 숫자(48px/800, `background:var(--accent-grad)`로 그라데 텍스트) + 게임명 + 카테고리 색점 + D-day. 컨테이너 `background:var(--bg-elev);border:1px solid var(--border);border-radius:var(--radius)`. **데이터 의존**: 로컬스토리지 위시는 개인값이라 전역 인기 산출 불가 → 리서처가 games.json에 `popularity` 필드 추가 or '글로벌 대작+D-day 임박' 큐레이션 TOP5로 대체(기획자 판단). 인벤의 정보 빽빽 라이트 표를 미니멀 다크 5카드로 절제. 우선순위 **보통**(데이터 선결).
2. **[보통·리스트 카드] 인벤은 실제 게임 썸네일로 배너 풍부 → 우린 이미지 없음, 카테고리 그라데이션+SVG 워터마크로 재해석** (`components/ListView.tsx` L99 배너 div + `components/ListView.module.css` .cardBanner L96~113)
   - 현재: `.cardBanner{height:56px}` + `cat-bg-{category}`(플랫 15% 단색) + `::before` 45deg 줄무늬(rgba255 0.025, 실측상 거의 안 보임) + `.cardBannerEmoji`(1.9rem·opacity .25 우측). 실측: 배너가 밋밋한 단색 띠 — 카드 상단 인상 약함.
   - 바꿀 값: ListView.tsx L99 배너 div에 `style={{['--cat' as string]: cat.color}}` 주입 → `.cardBanner{ background:linear-gradient(120deg, color-mix(in srgb,var(--cat) 26%, #14171d), color-mix(in srgb,var(--cat) 6%, #14171d)); }`(미지원 폴백 기존 cat-bg 클래스 유지)·높이 56→64px. 워터마크는 이모지→SVG 전환(큐) 후 `.cardBannerEmoji`를 대형 카테고리 SVG `width:60px;opacity:0.14;right:-4px`로. → 이미지 자산 없이도 카드 상단이 카테고리별로 또렷·깊이감. SVG 전환 묶음 권장. 우선순위 **보통**.

### 우선순위 종합
높음: 데스크톱#1(주말 색·인벤정렬)·모바일#1(cellHas 색 강화) — 둘 다 캘린더 가독성 핵심, 변경량 작음(tsx 1~2줄+CSS). 보통: 데스크톱#2(today 원형)·인벤#1(위시 TOP, 데이터 선결)·인벤#2(배너 그라데, SVG와 묶음).

---

## [2026-06-02 16:50] [디자이너] - 외형 모드 (Next.js 마이그레이션 외형 회귀 복구 + 헤더)
실측: gcalen.com Chrome 데스크톱(홈 캘린더/임박 스트립/리스트 뷰 + /game/ff7-rebirth-switch2-2026 상세) + 신규 Next.js 소스 교차(app/globals.css·layout.tsx·components/*.module.css·CalendarView.tsx·app/game/[id]/page.tsx). **핵심 발견: vanilla→Next.js 이관 과정에서 직전에 출고됐던 외형 자산 다수가 globals.css/module.css로 옮겨오며 유실됨**(PROJECT_STATUS 변경로그엔 styles.css/build.js 기준 "완료"로 남아 있으나 라이브 Next 빌드엔 미반영). 아래 제안은 옛 styles.css가 아니라 **현행 Next.js 파일 경로 기준**으로 재작성한 것. a11y/시맨틱/리팩토링 0건(외형 모드).

### 외형 개선 제안 (5개, hex/크기/파일경로 구체)

1. **[높음·회귀] 본문 폰트 Pretendard 유실 → 재도입** (`app/layout.tsx` <head> + `app/globals.css`)
   - 현재: 이관 후 `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',sans-serif}`(globals.css L5) — 직전 도입했던 Pretendard가 빠져 한글 인상이 다시 평범.
   - 바꿀 값: layout.tsx <head>에 `<link rel="preconnect" href="https://cdn.jsdelivr.net">` + `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">`. globals.css `:root`에 `--font-sans:'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',sans-serif;` 신설, `body{font-family:var(--font-sans)}`. 제목류(h1/h2/.monthTitle) `letter-spacing:-0.02em`. → 폰트 1개로 세련도 체감 큼.

2. **[높음·회귀] 브랜드 토큰 유실 → accent #4a90e2→#5b9dff + --accent-grad + --radius 신설** (`app/globals.css :root` + ViewToggle/MonthTabs .module.css)
   - 현재: 이관 후 `--accent:#4a90e2`(globals.css L17, 옛 칙칙한 파랑으로 되돌아감). `--accent-grad`/`--radius` 토큰 없음. ViewToggle `.active{background:#4a90e2}`·MonthTabs `.active{background:#4a90e2}` 단색 면.
   - 바꿀 값: `:root`에 `--accent:#5b9dff;` 복구, `--accent-grad:linear-gradient(92deg,#5b9dff,#c98ad6); --radius:12px; --radius-sm:8px;` 추가. 활성 상태를 그라데이션 칩으로: ViewToggle.module.css·MonthTabs.module.css `.active{ background:var(--accent-grad); color:#fff; border-color:transparent; box-shadow:0 2px 8px rgba(91,157,255,0.25); }`. → 선택 상태가 "단색 파랑 면"→"선명한 브랜드 칩", 헤더 그라데이션 타이틀(제안3)과 통일.

3. **[높음·헤더 임팩트] site-header가 단색 h1 1.6rem로 밋밋 → 그라데이션 타이틀 + 깊이** (`app/globals.css .site-header`/`.site-header h1` + `app/layout.tsx`)
   - 현재: `.site-header{background:linear-gradient(180deg,#1a1d24,#0f1115)}`, `.site-header h1{font-size:1.6rem}` 단색·평범. 첫 화면 임팩트 부족.
   - 바꿀 값: h1 `font-size:1.6rem→2.1rem; font-weight:800; letter-spacing:-0.02em; background:var(--accent-grad); -webkit-background-clip:text; background-clip:text; color:transparent;`(블루→퍼플 그라데이션 텍스트). 헤더 배경 `linear-gradient(180deg,#171a22 0%,#0f1115 100%)`로 한 톤 깊게 + 하단 헤어라인 `box-shadow:inset 0 -1px 0 rgba(255,255,255,0.05)` + 상단 미세 글로우 `radial-gradient(60% 120% at 50% 0%, rgba(91,157,255,0.10), transparent 70%)` 오버레이. 모바일(≤480) h1 1.8rem. → 로고성 강조 + 페이지 진입 인상 강화.

4. **[높음·회귀·캘린더] 출시 셀 카테고리 색 미반영(이관서 유실) — 셀이 전부 동일 다크** (`components/CalendarView.tsx` 셀 div + `components/CalendarView.module.css .cellHas`)
   - 현재: `.cellHas{background:#181d27}` 단색 — 빈 셀 `.cell{background:#14171d}`와 차이 미미해 출시 있는 날이 면으로 안 읽힘. 카테고리는 7px `.cellDot`만(CalendarView.tsx L159 cellDots)으로 점 표시. (옛 styles.css엔 카테고리 색 띠가 있었으나 Next 이관서 유실.)
   - 바꿀 값: 개발자가 셀 div(CalendarView.tsx L126 className 블록)에 `style={{ ['--cat' as string]: CATEGORY_META[cell.games[0].category].color }}` 주입 → CSS `.cellHas{ box-shadow:inset 3px 0 0 var(--cat,#5b9dff); background:color-mix(in srgb, var(--cat,#5b9dff) 8%, #14171d); }`(color-mix 미지원 폴백 기존 #181d27 유지). 단, `.cellToday`/`.cellSelected`가 inset box-shadow 강조를 쓰므로 **선언 순서상 .cellHas 위에 오게 두거나 강조 셀에서 --cat 띠 생략**해 충돌 방지. → 빈 달도 "이날 모바일/저날 글로벌"이 면색으로 즉시 구분.

5. **[높음·회귀·상세 첫인상] /game/[id] 상세 = 회색 박스 1개 + D-DAY 부재** (`app/game/[id]/page.tsx` + `app/globals.css .game-detail`)
   - 현재: `.game-detail`이 `background:var(--bg-elev)` 회색 박스 1개. 카테고리 pill·제목·날짜(파랑)·메타 리스트뿐. 검색 유입 첫 화면인데 **앱 핵심지표 D-day가 정적 페이지엔 없음**(모달에만 존재). 라디얼 백드롭도 이관서 유실.
   - 바꿀 값: (a) `.game-detail`에 카테고리색 상단 바 — page.tsx에서 인라인 `style={{ borderTop:'4px solid '+CATEGORY_META[game.category].color }}`, (b) `.game-detail h2{font-size:1.6rem→2rem; font-weight:800}`, (c) release-date 줄 옆에 D-day 배지 — page.tsx에서 출시일-오늘 diff 계산해 `<span className="dday-badge ...">D-N</span>` 삽입, globals.css 신규 `.dday-badge{display:inline-block;padding:3px 11px;border-radius:999px;font-size:1.15rem;font-weight:800;margin-left:.5rem}` + 임박(≤7일) `color:#f5a623;background:rgba(245,166,35,0.12)`, D-DAY(diff 0) `color:#ff7a59;background:rgba(255,122,89,0.14)`, 먼 미래 `color:var(--text-faint);background:var(--border)`, approx면 텍스트 `(예정)`. 빌드타임 생성·런타임 무영향.

### 우선순위
전부 높음. 묶음 제안: ①②③(globals.css/layout 토큰·폰트·헤더 = CSS 위주, 한 사이클 동시 처리 권장 — 서로 의존: ②의 --accent-grad가 ③ 타이틀에 쓰임) → 1차. ④(캘린더, tsx 1줄+CSS) → 2차. ⑤(상세, tsx D-day 계산+CSS) → 3차. 모두 "이관 외형 회귀 복구" 성격이라 임팩트 대비 변경량 작음.

---

## [2026-06-02 13:10] [디자이너] - 외형 모드 (운영자 요청: 이모지 → 미니멀 SVG)
운영자 직접 요청: "이모지 형태 제거하고 SVG로 미니멀하게". 클린 미니멀(Linear/Vercel 풍) 방향과 한 묶음. 이모지는 OS/브라우저마다 컬러·디자인이 달라(특히 🛠️🏢는 플랫폼별 편차 큼) 다크 미니멀 톤을 깨뜨림 → 인라인 SVG 스프라이트 1벌로 통일.

### 전수 인벤토리 (사용자 노출 이모지 11종)
- index.html: `🎮`(h1 로고 L57) · `📅`(캘린더 토글 L68) · `📋`(리스트 토글 L69) · `🔥`(출시 임박 제목 L75)
- script.js: `★`/`☆`(위시 토글, 카드·패널·모달 6곳) · `📅`(리스트 카드 출시일 L356) · `🛠️`(개발사 L359) · `🏢`(배급사 L359) · `📄`(전체 페이지 L471) · `▶`(트레일러 L471) · `🔗`(링크 복사 L471)
- build.js(SEO 상세/랜딩): `🎮`(L51) · `📅`(L88)
- (비노출) build.js `✅` 콘솔 로그(L195)는 빌드 로그라 제외.
- 화살표 `↗ → ← ‹ ›`는 이모지 아님(타이포 글리프) — 같은 미니멀 톤이면 arrow SVG로 통일 가능하나 후순위.

### 구체 실행안 — 인라인 SVG 스프라이트 (Lucide 라인 톤)
1. **스프라이트 정의**: index.html `<body>` 최상단에 숨김 스프라이트 1개.
   ```html
   <svg width="0" height="0" style="position:absolute" aria-hidden="true">
     <symbol id="ic-gamepad" viewBox="0 0 24 24"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.6 9.4 2 14.46 2 16a3 3 0 0 0 5 2l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.42.59L17 18a3 3 0 0 0 5-2c0-1.54-.6-6.6-.7-7.41A4 4 0 0 0 17.32 5z"/></symbol>
     <symbol id="ic-calendar" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></symbol>
     <symbol id="ic-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></symbol>
     <symbol id="ic-flame" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></symbol>
     <symbol id="ic-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></symbol>
     <symbol id="ic-building" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/></symbol>
     <symbol id="ic-wrench" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>
     <symbol id="ic-file" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/></symbol>
     <symbol id="ic-play" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21"/></symbol>
     <symbol id="ic-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></symbol>
     <symbol id="ic-arrow-ur" viewBox="0 0 24 24"><path d="M7 7h10v10M7 17 17 7"/></symbol>
   </symbol></svg>
   ```
2. **공통 CSS** (신규 토큰 없음, currentColor 상속이라 주변 글자색 그대로):
   ```css
   .ic { width:1em; height:1em; vertical-align:-0.14em; flex-shrink:0;
         fill:none; stroke:currentColor; stroke-width:1.75;
         stroke-linecap:round; stroke-linejoin:round; }
   .ic-fill { fill:currentColor; stroke:none; }   /* ★ 채움(위시 활성)용 */
   ```
   - 별(위시): 비활성 `<svg class="ic"><use href="#ic-star"/></svg>`(라인), 활성 `class="ic ic-fill"`(채움) + `color` 노랑(#f5b400 기존 유지). 토글은 textContent 교체 대신 class 토글로.
3. **치환 매핑** (이모지 → symbol):
   `🎮→#ic-gamepad` / `📅→#ic-calendar` / `📋→#ic-list` / `🔥→#ic-flame` / `★☆→#ic-star(+.ic-fill)` / `🛠️→#ic-wrench` / `🏢→#ic-building` / `📄→#ic-file` / `▶→#ic-play` / `🔗→#ic-link` / `↗ →→#ic-arrow-ur`
4. **색 처리(미니멀 핵심)**: 전부 currentColor 단색 → 메타 아이콘(🛠️🏢📅)은 `--text-dim`(#aaa) 톤, 버튼 아이콘은 버튼 글자색 상속. **유일한 컬러 포인트**는 h1 `🎮` 한 곳만 `.ic{color:var(--accent)}` 또는 그라데이션(h1 그라데이션과 조화)로 줘 로고성 강조. 🔥는 단색 유지(주황 칠하면 미니멀 깨짐) — 색 대신 형태로.
5. **build.js**: 상세/랜딩도 같은 스프라이트 필요 → pageShell `<body>`에 동일 `<symbol>` 인라인(또는 공용 헤더 함수). `🎮`(헤더)·`📅`(출시일) 2종만 쓰므로 그 2개만 인라인해도 됨.

### 규칙화 권고
- 신규 이모지 추가 금지를 AGENTS.md에 명문화(디자이너 권한상 직접 수정 불가 → 기획자/개발자 위임). 새 아이콘은 스프라이트에 symbol 추가로만.

### 우선순위
높음(운영자 직접 요청·클린 미니멀의 핵심 표면). 분할 가능: ① index.html 헤더/토글/임박 4종(🎮📅📋🔥) + 위시 ★☆ → 1차, ② 카드/모달 메타·액션(🛠️🏢📄▶🔗) → 2차, ③ build.js SEO 페이지 → 3차.

---

## [2026-06-02 13:01] [디자이너] - 외형 모드
실측: gcalen.com Chrome 데스크톱(홈 캘린더/임박 스트립/상세 /game/ff7-rebirth-switch2-2026) + styles.css·build.js 교차. 직전 출고(히어로 밴드·임박 스트립·상세 라디얼 백드롭·Pretendard·accent #5b9dff) 라이브 반영 양호. 아래는 큐(카드 호버·통계줄 칩·관련게임 그리드·로딩 스켈레톤)와 중복 없는 신규 외형 제안만.

### 외형 개선 제안 (5개, 구체적 값 포함)

1. **[높음·캘린더 임팩트] 캘린더 빈 셀이 페이지 배경(#0f1115)과 동일 색이라 격자가 "검은 공백"으로 보임 → 셀 면을 한 톤 띄워 타일감 부여**
   - 어디서/현재: `styles.css:378 .calendar-grid .day { background:var(--bg)=#0f1115; border:1px solid var(--border)=#2a2e38 }`. 셀 배경 == body 배경이라 출시 없는 셀(6월처럼 빈 날 많은 달은 30칸 중 ~20칸)이 배경에 녹아 그리드가 텅 빈 검정 구역처럼 보임. 라이브에서 7~13행이 거의 빈 검정.
   - 어떻게: 빈 셀 `background #0f1115 → #161922`(배경보다 +1톤 surface-lite), `border #2a2e38 → rgba(255,255,255,0.05)` hairline. 추가로 캘린더 컨테이너 `.calendar-view`(또는 `.calendar-grid` 래퍼)에 `background:#13151b; border:1px solid rgba(255,255,255,0.05); border-radius:14px; padding:14px`를 깔아 캘린더 전체를 하나의 패널 카드로 묶기. → 빈 달도 격자가 또렷이 면으로 읽힘.

2. **[높음·카테고리 시각 차별화] 출시 있는 셀(.day-has) 좌측 악센트가 전부 파란색(브랜드 accent) → 그날 카테고리 색으로 차별화**
   - 어디서/현재: `styles.css:383 .calendar-grid .day.day-has{ background:rgba(74,144,226,0.06); box-shadow:inset 2px 0 0 var(--accent) }`. 좌측 2px 바·옅은 면이 카테고리 무관 항상 파랑(#5b9dff)이라, 캘린더 4색 자산이 셀 강조에선 미사용 → 날짜별 카테고리를 점(7px)으로만 추측.
   - 어떻게: 개발자가 renderCalendar의 day-has 셀에 그날 대표(첫) 게임 카테고리 색을 `style="--cat:#81c784"`(모바일)/`#64b5f6`(PC·콘솔)/`#ba68c8`(글로벌)/`#ff8a65`(신규서버)로 주입 → CSS를 `box-shadow:inset 3px 0 0 var(--cat,#5b9dff)` + `background:color-mix(in srgb, var(--cat,#5b9dff) 8%, transparent)`(미지원 폴백 `rgba(91,157,255,0.06)`)로. 색점은 보조 유지. → 한 화면에서 "이날은 모바일/저날은 글로벌"이 면 색으로 즉시 구분.

3. **[높음·상세페이지 첫인상] /game/{id} 카드가 회색 박스 1개로 밋밋 + 핵심지표 D-day 부재 → 카테고리색 헤더 바 + 큰 D-day 배지**
   - 어디서/현재: build.js `gamePage` 카드 `background:var(--surface)`, 상단에 작은 카테고리 pill만(라디얼 백드롭은 깔렸으나 카드 자체는 평범). 검색유입 첫 화면인데 앱 핵심지표(D-DAY/D-N)가 없음.
   - 어떻게: (a) 카드에 카테고리색 상단 바 `border-top:5px solid {카테고리색}`(리스트 카드 card-banner 4px 패턴 확장), (b) 제목 `1.6rem → 2rem; font-weight:800`, (c) 출시일 줄 옆에 큰 D-day 배지 `display:inline-block; padding:4px 12px; border-radius:999px; font-size:1.3rem; font-weight:800` — 임박(≤7일) `color:#f5a623; background:rgba(245,166,35,0.12)`, D-DAY `color:#ff7a59; background:rgba(255,122,89,0.14)`, 먼 미래 `color:var(--text-dim); background:var(--border)`, approx면 `(예정)`. 빌드타임 생성이라 런타임 무영향.

4. **[보통·D-DAY 강조] 임박 스트립 카드가 전부 같은 회색 그라데이션 → 임박할수록 카테고리색 글로우로 시각 위계**
   - 어디서/현재: `.hero-card` 전부 `linear-gradient(150deg,#1c2030,#15171f)` + 좌측 4px 카테고리 바, 차이는 D-day 숫자 색(amber/주황)뿐 → D-1과 D-7 카드 임팩트가 동일.
   - 어떻게: D-3 이내 카드에 카테고리색 외곽 글로우 `box-shadow:0 0 0 1px {색}55, 0 6px 22px {색}22` + 배경에 카테고리색 미세 radial 겹침 `radial-gradient(120% 100% at 0% 0%, {색}1a, transparent 60%), linear-gradient(150deg,#1c2030,#15171f)`. D-DAY(diff 0)는 주황(#ff7a59) 글로우 1.3배 강하게 + `transform:scale(1.02)`(reduced-motion 시 생략). → 가까운 출시일수록 카드가 시각적으로 "튀어나옴".

5. **[보통·브랜드 통일] 미사용 토큰 `--accent-grad` 소비 — 뷰토글·활성 칩을 브랜드 그라데이션으로 채워 포인트화**
   - 어디서/현재: `:root`에 `--accent-grad:linear-gradient(92deg,#5b9dff,#c98ad6)` 신설됐으나 아직 미참조. `.view-toggle-btn.active`/`.chip-btn.active`(styles.css:436·476)는 `background:rgba(74,144,226,0.15)` 옛 리터럴 옅은 파랑 면 + `border-color:var(--accent)`.
   - 어떻게: active 상태를 `background:var(--accent-grad); color:#fff; border-color:transparent; box-shadow:0 2px 8px rgba(91,157,255,0.25)`로 교체. → 헤더 h1 블루→퍼플 그라데이션과 시각 통일되고, 선택 상태가 "옅은 파랑 면"에서 "선명한 브랜드 칩"으로 확실히 부각. 비활성은 기존 `var(--border)` 톤 유지.

---

## [2026-05-30 00:30] [디자이너] — 운영자 요청: 클린 미니멀(Linear/Vercel 풍) 리프레시 방향
운영자(쌀먹닷컴) 직접 요청 "더 트렌디하게" -> 방향 확정: **클린 미니멀**. 막연한 폴리시가 아니라 아래 구체 실행안으로 분해. 개발자는 한 사이클에 1~2개씩 픽업(전부 CSS 중심, 일부 폰트 로드/소규모 JS). 큰 색 변경 없이 '톤·여백·타이포·라운드'로 세련도를 올리는 게 핵심.

### 방향 원칙
색을 더 쓰지 말고 **덜 쓰기**. 강조는 색이 아니라 여백·굵기·톤 차이로. 카테고리 4색은 유지하되 캘린더에선 채도를 낮춰 보조로.

### 구체 실행안 (우선순위 순)
1. **타이포: 모던 한글 가변폰트 도입 + 위계 정리** — 우선순위: 보통
   - 현재 system-ui만 사용 -> 본문/제목 인상이 평범. Pretendard(한글 가변, 무료, Linear/토스류가 쓰는 톤) 또는 Inter+Noto Sans KR 조합을 `@font-face`/CDN로 로드.
   - 제목 weight 700·`letter-spacing:-0.01em`, 부제·메타는 weight 400·톤 다운. body line-height 1.5 유지. 폰트 1개 교체만으로 세련도 체감 큼.

2. **라운드·여백 토큰 통일** — 우선순위: 보통
   - `border-radius` 6px -> 10~12px로 카드/패널/버튼/모달 통일(`--radius:10px` 토큰화). 칩/작은 버튼은 8px.
   - 카드 패딩·그리드 gap 소폭 상향(여백을 늘려 '숨 쉬는' 레이아웃). Linear/Vercel의 핵심은 넉넉한 여백.

3. **플랫 보더 -> hairline + 미세 깊이** — 우선순위: 보통
   - 강한 보더(`#2a2e38`)에 의존하던 분리를, 더 옅은 hairline(`rgba(255,255,255,0.06)`) + 아주 옅은 그림자(`0 1px 2px rgba(0,0,0,0.3)`)로. surface(`#1a1d24`)에 미세 상단 하이라이트 그라데이션(1px inset)으로 깊이감. 톤 차이로 위계.

4. **컨트롤 일관화 (세그먼트 컨트롤 느낌)** — 우선순위: 보통
   - 캘린더/리스트 토글·퀵칩·필터 버튼 높이·라운드·hover 트랜지션 통일. 활성=채움(filled, accent), 비활성=배경 없는 outline로 상태 규칙 단일화. hover는 보더 밝아짐+1px lift 정도로 절제.
   - 펄스 애니(@keyframes pulse-dday) 제거(별도 제안과 동일) -> 과한 모션 정리.

5. **캘린더 색 절제** — 우선순위: 낮음
   - 셀 카테고리 dot 채도를 한 단계 낮춰 배경과 덜 튀게(이름 라벨이 주, 색은 보조). 강조(today/임박)만 선명하게 남겨 대비. 화면 전체가 차분해짐.

### 비고
- 1·2번이 체감 임팩트 가장 큼(폰트+여백/라운드) -> IDEAS 상단에 올림.
- 라이트 모드(별도 IDEAS, 후속)와 묶어 생각하면, 2·3번의 토큰화가 라이트 모드의 선행작업과 겹침 -> 토큰(`--radius` 등) 정리를 먼저 해두면 일석이조.
- a11y(색-only)·헤더 로고화 등 기존 제안과 충돌 없음(같은 방향).


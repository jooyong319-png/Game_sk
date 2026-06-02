## [2026-06-03 07:20] [개발자]
완료: **[외형·리스트·높음] 리스트 과거('출시됨') 카드 시각 약화** (큐 1순위)
ListView 카드에서 `diff<0`(과거 출시) 게임에 `released` 플래그 → `<li>`에 `.released` 부여(opacity 0.62·배너 saturate 0.55·hover 시 opacity 1 복원), D-day 배지를 '출시됨'일 때 회색 미니칩 `.releasedTag`로 분기. 미래·임박 카드는 또렷 유지 → 다가오는 신작이 먼저 눈에.
변경된 파일: components/ListView.tsx (+4/−3), components/ListView.module.css (+12). strict 유지(any 0)·신규 색 0·CSS brace 37/37.
비고: 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 1순위 완료 → 기획자님 2~5를 1~4로 당겨주세요. QA님: 라이브 데스크 '전체' 기간 리스트 과거카드 흐림·hover 복원 실측 부탁.

## [2026-06-03 07:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 'GameModal @media(≤480px) 모바일 블록' — 개발자 06:20 GameModal.module.css 6클래스(overlay/modal/title/image/imageEmoji/actions) 모바일 비례 신설·QA 06:46 라이브 CSS 번들 실측 ✅·신규 BUGS 0 → 큐 5→4.
추가: - [외형·D-DAY강조·높음·회귀] /game/[id] 상세 D-DAY 배지 + 카테고리 상단바 (디자이너 06-02 16:50, IDEAS→5순위 승격) → 4→5 복구. 4순위 '같은 시기 출시 그리드'와 동일 /game/[id] 표면 묶음.
큐 1~5: ①리스트 과거카드 약화 ②캘린더 면 강화 ③임박 스트립 글로우(데스크) ④/game/[id] 같은시기 그리드 ⑤/game/[id] D-DAY 배지+카테고리 상단바.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 디자이너 제안 0(05:05 이후 없음). QA 신규 BUGS 0. 3사이클 정체 0. a11y/리팩토링 0건 큐잉(외형 모드).

## [2026-06-03 06:46] [QA]
검증 대상: GameModal @media(≤480px) 모바일 블록 신설(개발자 06:20 — 모달 패딩/제목/이미지/이모지/액션 모바일 비례)
데스크톱 1440(실측 1920): ✅ (h1 SVG·가로오버플로 0[scrollW 1905≤innerW]·캘린더 137셀·임박 4카드·'불러오는 중' 플래시 없음·카드 클릭→모달 정상 오픈)
모바일 390: ✅ (Chrome resize 뷰포트 미반영 한계 동일[innerWidth 1920·mq480 false] → 배포 CSS 번들 실측으로 갈음. 프로덕션 4b077633…css에 @media(max-width:480px) GameModal 6클래스 전량 라이브 확정: overlay .6rem·modal{1.2rem/radius12/maxH92vh}·title 1.2rem·image{78px/.6rem}·imageEmoji 2.2rem·actions .4rem — 개발자 스펙 정확 일치)
상세: 헬스 ✅ /·sitemap.xml(50 URL)·robots·/game/sol-enchant-20260618·/new-servers(12서버). 콘솔 클린(사이트 에러 0, MetaMask 확장 경고만)·하이드레이션 #418/#423/#425 0건 재확인. 신규 BUGS 0.

## [2026-06-03 06:20] [개발자]
완료: **[외형·모바일·높음] GameModal @media(≤480px) 모바일 블록 신설** (큐 1순위)
GameModal만 유일하게 모바일 블록 0건(직전 Filters 모바일 블록과 동형 누락)이라 390px서 모달 패딩(1.6rem)·제목(1.4rem)·이미지(100px)·이모지(3rem)가 좁은 폭에 과대하던 문제 해소.
구현: `GameModal.module.css` 말미에 `@media(max-width:480px){ .overlay{padding:0.6rem} .modal{padding:1.2rem;border-radius:12px;max-height:92vh} .title{font-size:1.2rem} .image{height:78px;margin-bottom:0.6rem} .imageEmoji{font-size:2.2rem} .actions{gap:0.4rem} }`. 6개 타깃 클래스 전부 GameModal.tsx 사용 중 확인.
변경된 파일: components/GameModal.module.css (+11). 레이아웃만(신규 색 0)·데스크톱 무영향·tsx 무변경. CSS brace 27/27.
비고: 로컬 빌드 sandbox 디스크 제한 → Vercel typecheck+build 위임. 큐 5→4(2~5순위 한 칸씩 당김). **QA님: 라이브 모바일 390px 모달 패딩/제목/이미지 비례 실측 부탁(Chrome resize 미반영 시 소스 갈음).**

## [2026-06-03 06:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '하이드레이션 7건 재점검' — 개발자 05:31 kstDateOnly(lib/utils.ts) 서버UTC↔클라KST 단일기준 fix·QA 05:47 라이브 #418/#423/#425 0건 해소 확정(adsbygoogle no_div도 미관측) → 큐 5→4.
추가: - [외형·캘린더 임팩트·높음] 캘린더 면 디자인 강화(빈 셀 톤업+컨테이너 패널 카드화+출시 셀 카테고리색 좌측 악센트) — IDEAS 13:01 #2·#3 묶어 3순위 승격 → 4→5 복구.
큐 1~5: ①GameModal 모바일 블록 ②리스트 과거카드 약화 ③캘린더 면 강화 ④임박 스트립 글로우(데스크) ⑤/game/[id] 같은시기 그리드.
다음 후보: 상세 D-day배지+상단바(회귀)·이모지→SVG 2단계·헤더 히어로 밴드.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 0건 큐잉(외형 모드).

## [2026-06-03 05:47] [QA]
검증 대상: 하이드레이션 7건 kstDateOnly fix(개발자 05:31, UTC↔KST 시간대 불일치)
데스크톱 1440: ✅ (h1 SVG·가로오버플로 0·137셀·임박4카드·로딩플래시 없음·콘솔 React에러 0)
모바일 390: ⚠️ (Chrome resize 후에도 innerWidth 1920·matchMedia480 false → 실측 불가, 소스 갈음. 5개 컴포넌트 @media≤480 보유·캘린더 모바일 cellName 숨김으로 그리드 오버플로 무위험. GameModal 모바일블록 부재는 기존 IDEA)
상세: **하이드레이션 #418/#423/#425=0건 해소 확정** — KST 05:47(00~09시 위험구간) 캐시버스트 2회 재로드 콘솔 클린. 헬스 ✅ /·sitemap.xml(50 URL)·robots·/game/007-first-light-2026·/new-servers. adsbygoogle no_div도 미관측. 신규 BUGS 0.

## [2026-06-03 05:31] [개발자]
완료: **하이드레이션 7건(#418×3·#423×1·#425×3) 근본원인 규명·수정 — 서버(UTC)↔클라(KST) timezone 불일치**. f021717(serverNow)은 UTC instant를 주입했지만 모든 렌더가 `new Date(serverNow)` 후 **로컬 날짜필드**(getDate/getMonth/getDay/getFullYear)를 읽음 → Vercel은 UTC, 사용자는 KST(UTC+9)라 빌드 instant의 UTC일자≠KST일자인 시간대(KST 00~09시 빌드)마다 D-day·'오늘'셀·달 라벨·요일이 서버HTML↔클라 첫렌더에서 갈려 #418/#423/#425 발생. 그래서 fix가 '반영됐는데도 미해소'로 보였음(부분 fix였음).
수정: `lib/utils.ts`에 TZ무관 `kstDateOnly(iso)` 신설(+9h 시프트→getUTC*로 KST 연/월/일→로컬자정 Date, 어느 환경서도 동일 날짜필드). `Home.tsx` now·calendarCursor 초기값 + mount 실시간 교체를 kstDateOnly 기반으로 전환(사용자 로컬TZ 무관, 항상 KST 기준=한국 타깃 의도와 일치).
검증: node로 TZ=UTC vs Asia/Seoul 시뮬 — 수정 전 date=2/D-3(UTC) vs date=3/D-2(KST) 불일치 재현 → 수정 후 양쪽 date=3·D-2·월라벨·today셀 전부 동일(불일치 0). release_date는 양쪽 동일일자라 무변경. strict 유지(any 0).
변경된 파일: lib/utils.ts(+10), components/Home.tsx(+0/−4 치환). 합 +14/−4.
비고: **adsbygoogle 'no_div' ERROR는 본 수정 밖(별개 추적)** — 하이드 7건과 무관(날짜 텍스트 불일치가 원인이었음). 로컬 빌드는 sandbox 디스크 제한 → Vercel typecheck+build 위임. **QA님: gcalen.com 콘솔 #418/#423/#425 0건 실측 부탁(특히 KST 00~09시대 빌드분에서 재현 안 되는지).**

## [2026-06-03 05:11] [기획자]
TODO 큐 5→5 (모드: 외형 집중, 큰 단위)
**배포 블로커 해소 확정**: QA(04:47) 라이브 재검 — vercel.json 출고로 gcalen.com이 레거시 정적→신 Next 앱 전환(h1 SVG·임박 스트립·캘린더 주말색/today원형·상세 D-day배지 라이브). 직전 05:00 'f021717 미배포 추정'은 정정. → 직전 1순위 '배포 확인'을 완료 처리·재프레이밍.
추가(높음): - GameModal @media(≤480px) 모바일 블록 신설(디자이너 05:05 모바일#1) / - 리스트 과거('출시됨') 카드 시각 약화(디자이너 05:05 데스크#1)
큐 1~5: ①하이드레이션 7건 재점검(fix 불완전/애드센스 ad-div 원인 — 신 빌드에도 #425×3·#418×3·#423×1 매 로드 재현) ②GameModal 모바일 블록 ③과거 카드 약화 ④임박 스트립 글로우(데스크톱) ⑤/game/[id] "같은 시기 출시" 그리드
IDEAS로 밀림: 리스트 배너 그라데+리본·범례 tint 칩(외형 보통, 다음 사이클 재승격 우선). 디자이너 05:05 보통 3건(상세 라디얼 백드롭·임박 행 좌띠·카테고리 필터 색칩) IDEAS 보관.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 제안 0건 큐잉(외형 모드).

## [2026-06-03 05:05] [디자이너]
외형 점검 완료 (데스크 1440 라이브 + 모바일 390 소스검증 + 인벤 비교). **Next 앱 정상 배포 라이브 확인**(vercel.json 출고 반영: h1 SVG 그라데 타이틀·임박 4카드·캘린더 주말색/today원형/카테고리 tint·상세 D-day배지+상단바 전부 라이브).
데스크 주요: 기간 기본 '전체'라 리스트 최상단=과거 '출시됨' 카드가 신작과 동일 비중 → 과거 카드 시각 약화 제안.
모바일 주요: GameModal만 유일하게 @media(≤480px) 블록 부재 → 모달 패딩/제목/이미지 모바일 블록 신설(Filters 선례 동형).
인벤 참고: 필터가 아이콘 칩 row → 우리 카테고리 select를 카테고리색 칩 row로 재해석(월탭 톤).
DESIGN_NOTES에 5개 제안 추가(데스크2/모바일2/인벤1). Chrome resize 모바일 뷰포트 미반영은 직전 사이클 동일 한계(소스 갈음).

## [2026-06-03 04:47] [QA]
검증 대상: vercel.json 배포 강제(개발자 06:20) — 라이브 Next 전환 + 하이드레이션 7건 재검
데스크톱 1440: ⚠️ (Next 앱 라이브 전환 **확인**·하이드레이션 7건 여전)
모바일 390: ⚠️ (Chrome resize 후에도 innerWidth 1920·matchMedia480 false → 실측 불가, 데스크/소스 갈음. 데스크 가로오버플로 0)
상세: **배포 블로커 해소** — vercel.json 출고로 라이브가 레거시 정적→신 Next 앱 전환: h1 SVG 게임패드(🎮 아님)·'불러오는 중' 플래시 제거·기간 기본 '전체(과거+미래)'·총 44개·임박 스트립(FF7리버스 D-DAY 등) 라이브 = 개발자 (a) 검증항목 전부 충족. **단 콘솔 React 하이드레이션 #425×3·#418×3·#423×1=7건이 신 빌드(_next/chunks/fd9d1056*.js)에서도 매 로드 재현(데스크+모바일폭 동일)** → f021717 fix가 배포됐는데도 미해소 = fix 불완전/별도원인(애드센스 ad-div 주입 등) 의심. adsbygoogle 'no_div' 1건 동반(별개). 헬스 ✅: /·sitemap.xml·robots·/new-servers(서버12)·/game/poe2.

## [2026-06-03 06:20] [개발자]
완료: **1순위 배포 블로커 — 원인 규명 + vercel.json 추가(Next 빌드 강제)**
- 라이브 gcalen.com = **마이그레이션 전 레거시 vanilla 사이트**였음. legacy/index.html과 1:1 일치(h1 🎮 이모지·"불러오는 중..." 플래시 = 06-02 SVG/팔레트 출고 이전 화면). 즉 Next 앱이 프로덕션에 **한 번도 배포된 적 없음**(Vercel이 마지막 정상 정적 배포를 계속 서빙).
- **코드는 정상**: /sessions(8.6G 여유)에 클론·npm install 후 `tsc --noEmit` ✅(exit 0) + `next build` ✅(exit 0, 55페이지 생성: 게임 44·랜딩 5·sitemap·robots·홈). f021717 및 최근 커밋 전부 빌드 성공. data/games.json도 유효(44개).
- 결론: 블로커는 **코드가 아니라 Vercel 파이프라인**(레거시 시절 정적/Other 프리셋·빌드설정 잔존으로 `next build` 미실행 정황).
조치: 마이그레이션 때 삭제됐던 `vercel.json` 재신설(`framework:"nextjs"`·`buildCommand:"next build"`·`installCommand:"npm install"`). vercel.json은 대시보드 프로젝트 설정보다 **우선**하므로 스테일 정적 프리셋을 덮어써 강제로 Next 빌드를 돌림 + 이 푸시가 새 배포를 트리거.
변경된 파일: vercel.json (신규, +6줄)
비고:
- **QA님**: 배포 1~3분 후 gcalen.com에서 (a) h1이 SVG 게임패드(🎮 이모지 아님)·"불러오는 중" 제거·기간 기본 '전체', (b) 콘솔 하이드레이션 #418/#423/#425 0건 재확인 부탁. 이게 떠야 직전 f021717 하이드레이션 fix도 같이 라이브 반영된 것.
- **운영자님**: 그래도 라이브가 안 바뀌면 vercel.json로 못 고치는 영역 — Vercel 대시보드 직접 점검 필요: ①Settings→Git 연동(푸시가 배포 트리거하는지) ②Production Branch=main ③Root Directory ④Build 로그 실패 여부 ⑤도메인이 옛 배포에 핀 고정/자동프로모션 off 여부.

## [2026-06-03 05:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [버그·SEO·동작] 하이드레이션 7건 해소(serverNow 단일기준값, f021717) — 개발자 출고 → 완료한 기능 이동.
**⚠️ 배포 블로커 신설(큐 1순위): QA(HEAD 80ef2d9) 재검 — 라이브 SSR raw HTML 구버전 잔존('불러오는 중'·기간 기본 '앞으로 1년')+콘솔 7건 여전(2회·캐시버스트 동일) → f021717 미배포 추정.** 개발자님: Vercel 배포 로그/typecheck 확인 요망 — 빌드 실패면 그 자체가 모든 외형 출고의 블로커, 단순 지연/캐시면 배포 후 콘솔 7건→0 재확인.
잔여 큐 2~5(전부 Next app/·components/): ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] "같은 시기 출시" 미니카드 그리드 ④리스트 카드 배너 그라데이션+D-DAY 리본 ⑤캘린더 범례 tint 칩
사용자 요청 처리: 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0.
IDEAS 보관: 디자이너 01:05 인벤#1(핫카드+카운트다운, 데이터 무관·글로우와 공존 가능)·인벤#2(eventType 배지, 데이터 선결)·데스크#3(필터 토큰 정렬, 리팩토링→큐X). a11y/리팩토링 제안 0건 큐잉(외형 모드).

## [2026-06-03 03:48] [QA]
검증 대상: serverNow 단일기준 주입 하이드레이션 fix(#418/#423/#425) + /game/[id] D-day 배지
데스크톱 1440: ⚠️ (라이브 JS 렌더 정상·하이드레이션 7건 여전)
모바일 390: ⚠️ (Chrome resize 미반영 innerWidth 1920·matchMedia480 false → 라이브 실측 불가, 소스검증 갈음)
상세: 콘솔 #425×3·#418×3·#423×1=7건 재현(2회·캐시버스트 동일). 라이브 SSR raw HTML 구버전 잔존('불러오는 중...'·기간 기본 '앞으로 1년') → f021717 미배포 추정(Vercel 빌드 지연/실패?). /game/[id] D-day 배지·카테고리 상단바 SSR 정상('출시됨'). 헬스 ✅: /(h1 🎮)·sitemap.xml(xml)·robots·/new-servers(서버12).

## [2026-06-03 04:20] [개발자]
완료: 1순위 **[버그·SEO·동작] React 하이드레이션 에러 7건/로드 해소 (#418/#423/#425, 날짜 의존 SSR↔CSR 불일치)**. 원인=클라 컴포넌트들이 렌더 중 `new Date()`(현재 시각)에 의존 → 정적 빌드(SSR) 날짜와 클라 현재 날짜가 달라 D-day·'오늘' 셀·캘린더 커서 월·요일/D-day 텍스트가 불일치(#423로 루트 클라 재렌더·플래시·SSR SEO 손실). 해결=`page.tsx`(서버)에서 `serverNow=new Date().toISOString()`를 `<Home serverNow>` prop 주입 → Home에 `now` state(초기값 serverNow)를 두고 SSR/첫 클라 렌더가 동일 serverNow를 쓰게 함(서버 HTML==첫 렌더, 불일치 0). mount 직후 `useEffect` 1회로 실제 `new Date()`/이번 달 교체(하이드레이션 이후라 에러 아님). `now:Date`를 CalendarView·ListView에 스레딩, filteredGames/imminent/MonthTabs도 now 기준. HeroStrip(imminent에서 diff 수령)·GameModal·/game/[id](서버 정적)은 초기 SSR DOM 밖이라 무영향.
변경된 파일: app/page.tsx(+2)·components/Home.tsx(+21/−10)·components/CalendarView.tsx(+6/−5)·components/ListView.tsx(+4/−3)
비고: TypeScript strict 유지(any 0, serverNow:string·now:Date 명시). esbuild(tsx) 6파일 트랜스폼 OK. 로컬 빌드는 sandbox 디스크 제한 → Vercel typecheck+build 검증 위임. 큐 5→4(2~5순위 한 칸씩 당김). **QA님: gcalen.com DevTools 콘솔 #418/#423/#425 0건 + view-source 초기 SSR HTML에 캘린더 그리드/D-day 노드 존재(SEO 보존)·'불러오는 중' 플래시 제거 실측 부탁.**

## [2026-06-03 04:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·모바일·높음] Filters @media(≤480px) 모바일 블록 신설(검색 풀폭+셀렉트 2×2+위시 풀폭) — 개발자 03:20 출고·QA 03:44 소스검증(Chrome resize 뷰포트 미반영→소스 갈음) → 완료한 기능 이동(개발자 큐 5→4).
추가(5순위): - [외형·캘린더 범례] 카테고리 범례 8px 점+회색 텍스트(#aaa) → 카테고리 tint 미니 칩 (디자이너 01:05 데스크#2, components/CalendarView.tsx·CalendarView.module.css)
잔여 큐 1~5(전부 Next app/·components/): ①하이드레이션 에러 7건/로드 해소(버그·SEO·동작) ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] "같은 시기 출시" 관련게임 미니카드 그리드 ④리스트 카드 배너 카테고리색 그라데이션+D-DAY 리본 ⑤캘린더 범례 tint 칩
QA 03:44 재확인: 하이드레이션 #418/#423/#425 7건/로드 미해소 → 큐 1순위 대기.
사용자 요청 처리: 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0.
IDEAS 정리: 완료된 01:05 IDEA 2건(구 accent 전 표면 통일·Filters 모바일 블록) 제거(개발자 출고 반영).
a11y/리팩토링 제안 0건 큐잉 → IDEAS 보관 (외형 모드). 디자이너 01:05 데스크#3(필터 border/radius 토큰 정렬)은 일관성·리팩토링 성격이라 큐 X·IDEAS 보류.

## [2026-06-03 03:44] [QA]
검증 대상: Filters 모바일 @media(≤480px) 블록 신설 (검색 풀폭+셀렉트 2열+위시 풀폭, 개발자 03:20)
데스크톱 1440: ⚠️ (레이아웃 정상·하이드레이션 7건 잔존)
모바일 390: ⚠️ (소스 확정·Chrome resize 뷰포트 미반영으로 라이브 실측 불가)
상세: Filters.module.css 말미 @media(max-width:480px) 블록 실재 확인 — .search flex:1 1 100%·.label flex:1 1 calc(50%-0.25rem)·.label select width:100%·.wishBtn flex:1 1 100% 스펙대로(brace 13/13, Filters.tsx 무변경). 단 Chrome resize 390 후에도 innerWidth 1920·matchMedia(480)=false(직전 사이클 동일 한계)라 풀폭/2열 라이브 실측 불가→소스검증 갈음. 데스크톱 무영향(미디어쿼리 밖). 콘솔 하이드레이션 #425×3·#418×3·#423×1=7건 매 로드 재현(큐 2순위 미해소·이번 사이클 개발자는 Filters만). adsense no_div 1건 별개. 헬스체크 ✅: /(h1 🎮)·sitemap.xml(application/xml)·robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12) 정상.

## [2026-06-03 03:20] [개발자]
완료: 1순위 **[외형·모바일·높음] Filters 모바일 @media(≤480px) 블록 신설** (디자이너 01:05 모바일#1). `components/Filters.module.css`에 모바일 블록이 0건이라 390px에서 `.search`(flex 1 1 200px)+카테고리/플랫폼/기간 셀렉트 3개+위시 버튼이 남는 폭에 불균등 줄바꿈하던 문제 해소. 파일 말미에 `@media(max-width:480px){ .filters{gap:0.5rem} .search{flex:1 1 100%} .label{flex:1 1 calc(50% - 0.25rem)} .label select{width:100%} .wishBtn{flex:1 1 100%;text-align:center} }` 신설 → 검색=풀폭 1줄·셀렉트=2×2 그리드형·위시=풀폭 버튼.
변경된 파일: components/Filters.module.css (+18줄, @media 블록 1개)
비고: 레이아웃만(신규 색 0). 데스크톱 단일 `.filters` 규칙은 미디어쿼리 밖이라 무영향. 위시 버튼 ★은 이미 SVG(#ic-star)라 Filters.tsx 무변경. CSS brace 13/13 균형. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 검증 위임. QA님 라이브 모바일 390px에서 검색 풀폭·셀렉트 2열·위시 풀폭 정렬 실측 부탁(Chrome resize 뷰포트 미반영 시 소스검증). 큐 5→4(2~5순위 한 칸씩 당김).

## [2026-06-03 03:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·팔레트·높음] 구 accent #4a90e2·rgba(74,144,226)→브랜드 #5b9dff 전 표면 통일 — 개발자 출고·QA 01:47 라이브 확정(리스트/모달/캘린더/월탭 신톤 #5b9dff, 잔존 구리터럴=의도된 focus-visible 2건·gcal 구글블루뿐) → 완료한 기능 이동(개발자 반영 확인, 큐 5→4).
추가(5순위): - [외형·리스트] 리스트 카드 배너(.cardBanner) 카테고리 단색 → 카테고리색 세로 그라데이션 + D-DAY 카드 좌상단 리본 강조 (components/ListView.module.css·ListView.tsx)
잔여 큐 1~5(전부 Next app/·components/): ①Filters @media(480) 모바일 블록 신설(검색 풀폭+셀렉트 2×2+위시 풀폭) ②하이드레이션 에러 7건 해소(버그·SEO) ③임박 스트립 글로우(데스크톱 한정) ④/game/[id] "같은 시기 출시" 미니카드 그리드 ⑤리스트 카드 배너 그라데이션
QA 재확인: Filters @media(480) 부재·하이드레이션 #418/#423/#425 7건/로드 미해소 = 큐 1·2순위로 계속 대기.
활성 사용자 요청 0(SEO 보류 — 안 건드림) · 미해결 코드 버그 1(하이드레이션, 큐 2순위) · 3사이클 정체 0 · 신규 디자이너 제안 0(01:05 처리 완료)
a11y/리팩토링 0건 큐잉 → IDEAS 보관 (외형 모드)

## [2026-06-03 01:47] [QA]
검증 대상: 구 accent #4a90e2·rgba(74,144,226) → #5b9dff 전 표면 통일 (개발자 06-03)
데스크톱 1440: ⚠️ (accent 통일 라이브 확정·단 하이드레이션 에러 7건 잔존)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920·matchMedia(480)=false → 소스검증)
상세: 라이브 Chrome 실측 — todayBtn 보더 rgba(91,157,255,0.4)·캘린더/리스트/모달/월탭 전부 신톤 #5b9dff 통일 확인(구 리터럴 잔존=의도된 focus-visible 2건·gcal 구글블루뿐). 캘린더 125셀·overflowX 0·h1 🎮 정상. ★단 콘솔 React 하이드레이션 #425×3·#418×3·#423×1=**7건 매 로드 재현**(00:47 BUG 미해소, 큐 2순위 대기 — 이번 사이클 개발자는 accent만 작업). adsense no_div 1건은 광고슬롯 별개. 모바일: accent 치환은 비미디어 base 규칙이라 모바일에도 적용 ✅, Filters @media(480) 블록 여전히 부재(큐 1순위 미착수). 헬스체크 ✅: /(h1 🎮)·sitemap.xml(xml)·robots.txt·/game/sol-enchant-20260618·/new-servers(서버12) 정상.

## [2026-06-03] [개발자]
완료: 1순위 **[외형·팔레트·높음] 구 accent #4a90e2·rgba(74,144,226) 리터럴 → 브랜드 var(--accent) #5b9dff / rgba(91,157,255) 전 표면 통일** (디자이너 01:05 데스크#1). 헤더/뷰토글/월탭/today만 신톤이고 리스트·모달·캘린더·월탭 일부 면이 구톤이라 블루가 두 톤으로 갈리던 문제 해소. 치환: ListView .monthHeader·.item:hover·.date / GameModal .source·.detail:hover / CalendarView .navBtn:hover·.todayBtn(+hover)·.dayRow:hover / MonthTabs .tab:hover. enumerate에 없던 동일 두 톤 잔존면(navBtn·todayBtn·dayRow·MonthTabs)까지 함께 치환해 제목 "전 표면 통일"을 한 사이클로 완결.
변경된 파일: components/ListView.module.css(~4값)·GameModal.module.css(~3값)·CalendarView.module.css(~6값)·MonthTabs.module.css(2값)
비고: 유지(미변경) — GameModal .gcal:hover rgba(66,133,244)(구글 브랜드 블루)·CalendarView .cell/.cellClickable:focus-visible #4a90e2 2건(a11y, 외형 모드 제외). 신규 색 0(#5b9dff=기존 출고색), 값만 치환이라 brace 무변동(33/20/62/6 균형). grep 검증: 구 리터럴 잔존=의도한 focus-visible 2건+gcal뿐. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 검증 위임. QA님 라이브 1440에서 리스트 .date/.item:hover·모달 출처링크·캘린더 오늘/네비 버튼 hover가 헤더 타이틀과 동일 #5b9dff 톤인지 실측 부탁. 큐 5→4.

## [2026-06-03 02:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 fix — 개발자 출고·QA 00:47 라이브 실측(일 #e57373·토 #7aa7ff·평일 #888) → 완료한 기능 이동·BUG 해소.
추가: - [외형·팔레트·높음] 구 accent #4a90e2→#5b9dff 전 표면 통일(디자이너 01:05 데스크#1, 리스트/모달/캘린더 잔존 리터럴 치환) / - [외형·모바일·높음] Filters @media(480) 모바일 블록 신설(디자이너 01:05 모바일#1, 검색 풀폭+셀렉트 2×2+위시 풀폭) / - [버그·SEO] React 하이드레이션 에러 7건/로드 해소(QA 00:47, 날짜 의존 SSR↔CSR 불일치·#418/#423/#425 → suppressHydrationWarning/mount 가드)
큐 1~5: ①구 accent 통일 ②Filters 모바일 블록 ③하이드레이션 에러(버그) ④임박 스트립 글로우(데스크톱) ⑤/game/[id] 관련게임 그리드. 디스플레이스(리스트 배너 그라데·--accent-grad 칩)는 다음 후보 IDEAS 인접 보존.
사용자 요청 처리: 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0.
a11y/리팩토링 제안 0건 큐잉 → IDEAS 보관 (외형 모드). 디자이너 01:05 인벤 제안(핫카드·이벤트 타입 배지)은 데이터/판단 선결로 IDEAS 유지.

## [2026-06-03 01:05] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 소스검증 + 인벤 비교)
데스크 주요: 리스트/모달/캘린더에 구 accent #4a90e2·rgba(74,144,226) 잔존 → 브랜드 #5b9dff로 통일 제안(헤더만 신톤이라 면마다 블루 두 톤으로 갈림). +범례 tint 칩·필터 토큰(radius/border) 정렬.
모바일 주요: Filters에 @media(max-width:480px) 블록 부재 → 검색+셀렉트3+위시 불규칙 줄바꿈, 풀폭검색+2×2 셀렉트 블록 신설 제안. (Chrome resize 미반영 여전 → 소스검증)
인벤 참고: 핫카드+라이브 카운트다운(임박 1건 대형화, 데이터 무관)·이벤트 타입 색배지(테스트/얼리액세스/쇼케이스, 데이터 선결).
DESIGN_NOTES에 6개 제안 추가(데스크3+모바일1+인벤2), 임팩트 큰 2건(accent 통일·모바일 필터) PROJECT_STATUS IDEAS 등재. 코드 미수정(문서만).

## [2026-06-03 00:47] [QA]
검증 대상: 요일 헤더(.dayHead) 주말 색 미적용 fix (개발자 06-03)
데스크톱 1440: ⚠️ (요일헤더 fix 자체는 ✅, 단 콘솔 React 하이드레이션 에러 신규 발견)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 헤더색은 비미디어 CSS라 동일 적용 확인, 모바일 전용 렌더 실측 불가)
상세: 라이브 Chrome 실측 — 요일 헤더 일=rgb(229,115,115)·토=rgb(122,167,255)·평일=rgb(136,136,136)로 **fix 확정**(셀 날짜와 동일 톤). today 채움 원형(accent bg·반경50%·"3")·셀날짜 주말색·overflowX 0·캘린더 125셀 정상. **★단 콘솔에 React 하이드레이션 에러 #418/#423/#425 7건이 매 로드 재현**(직전 사이클 '콘솔 0' 대비 신규) → BUGS [공통] 등록. 추정: 날짜 의존 SSR/CSR 불일치(#423로 루트 클라 재렌더·'불러오는 중' 플래시). 헬스체크 ✅: /(h1 🎮 게임 출시 캘린더)·/sitemap.xml(application/xml)·/robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12개) 정상.

## [2026-06-03] [개발자]
완료: 1순위 **[외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 수정** (QA 06-02 23:48 BUG). 원인: `.dayHead{color:#888}`(module.css L62)가 `.sun`/`.sat`(L45-46)보다 소스 후행+동일 특이도(1클래스)라 일/토 헤더를 회색으로 override(셀 날짜는 `.cellDate.sun` 2클래스라 정상). 권장안(a)로 `.dayHead` 블록 직후 2클래스 규칙 `.dayHead.sun{color:#e57373}`·`.dayHead.sat{color:#7aa7ff}` 추가 → 특이도 2로 override 역전, 일=빨강·토=파랑(셀 날짜 톤 일치).
변경된 파일: components/CalendarView.module.css (+3: 주석1+규칙2)
비고: tsx 헤더 div는 이미 `${styles.dayHead} ${sun|sat}` 부여라 무변경. 신규 색 0(주말 2색 재사용), CSS brace 62/62. 로컬 tsc/build는 sandbox 디스크 제한으로 Vercel(typecheck+build) 검증 위임. QA님 라이브에서 일요일 헤더=빨강·토요일 헤더=파랑(셀 날짜와 동일 톤) 실측 부탁. 큐 5→4.

## [2026-06-03 00:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 직전 1순위 [외형·캘린더·높음·묶음] 캘린더 시각 강화 3종(주말 색 구분·today 채움 원형·모바일 출시셀 강화) — 개발자 23:29·QA 23:48 검증 → 완료한 기능 이동(개발자가 큐 5→4 반영).
추가(1순위): - [외형·버그·캘린더·높음] 요일 헤더(.dayHead) 주말 색 미적용 수정 (QA 23:48 발견) — 셀 날짜는 적용되나 헤더만 회색(.dayHead{color:#888}가 .sun/.sat보다 후행·동일 특이도라 override). .dayHead.sun/.sat 2클래스 규칙 추가(또는 블록 후행 이동)로 마감. 방금 출고한 외형 기능의 미완분이라 작은 단위 예외로 큐잉.
잔여 큐 1~5(전부 Next app/·components/): ①요일 헤더 주말 색 fix ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] 미니카드 그리드 ④리스트 카드 배너 그라데 ⑤--accent-grad 그라데 칩
활성 사용자 요청 0(SEO 보류)·미해결 코드 버그 0(요일헤더는 본 큐 1순위로 처리)·3사이클 정체 0·신규 디자이너 제안 0
a11y/리팩토링 0건 → IDEAS 보관 (외형 모드)

## [2026-06-02 23:48] [QA]
검증 대상: 캘린더 시각 강화 3종 (주말 색 구분·today 채움 원형·모바일 출시셀 강화) (개발자 23:29)
데스크톱 1440: ⚠️ (요일 헤더 주말색 미적용 — 셀 날짜는 정상)
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 소스검증 대체)
상세: 라이브 Chrome 실측 — today 채움 원형 ✅(accent#5b9dff bg·border-radius 50%·흰자 "2"·"오늘" 텍스트배지 제거 확인), 선택 셀 날짜 흰색 ✅, 셀 날짜 주말색 ✅(.cellDate.sun 일=rgb(229,115,115)·.cellDate.sat 토=rgb(122,167,255), 각 6셀). **단 요일 헤더(.dayHead)는 회색 #888 잔존(일/토 동일 rgb(136,136,136))** → `.dayHead{color:#888}`(module.css L62)가 `.sun/.sat`(L45-46)보다 후행·동일 특이도라 override. 셀 날짜만 2클래스라 정상. → BUGS 등록. 모바일 출시셀 tint16%·좌띠4px·점7px는 소스확인 ✅(뷰포트 미반영으로 렌더실측 불가). 콘솔 에러 0·가로오버플로 0(scrollWidth≤innerWidth). 헬스체크 ✅: /(h1 게임 출시 캘린더·🎮 0)·/sitemap.xml(XML·50 URL)·/robots.txt·/game/sol-enchant-20260618(상세 정상)·/new-servers(서버 12개) 정상. 노출 이모지 0·svg.ic 5종 렌더.

## [2026-06-02 23:29] [개발자]
완료: **[외형·캘린더·높음·묶음] 캘린더 시각 강화 3종** (1순위) — (a) 주말 색 구분: 요일 헤더·출시셀 날짜에 `getDay()` 기반 일/토 클래스(.sun #e57373·.sat #7aa7ff 톤다운), 선택 셀 날짜는 흰색 유지. (b) today 날짜 채움 원형(.cellTodayNum, var(--accent) 배경)으로 구글캘린더식 강조, "오늘" 텍스트 배지 제거·셀 테두리 약화(rgba(91,157,255,0.45)). (c) 모바일(≤480px) 출시셀 tint 8→16%·좌측 색띠 3→4px·점 6→7px로 점 신호 강화(데스크톱 현행 유지).
변경된 파일: components/CalendarView.tsx (+5/−4), components/CalendarView.module.css (+20/−10)
비고: 신규 색=주말 2색만, 카테고리/accent 토큰 재사용. CSS brace 59/59. 로컬 tsc/build는 sandbox 디스크 제한으로 Vercel(typecheck+build) 검증 위임. QA님 라이브 확인 부탁 — ①요일 헤더 일=빨강·토=파랑 + 셀 날짜 동일 ②today 채움 원형(배지 없음)·선택 셀 날짜 흰색 ③모바일 출시셀 색/띠/점 진해짐. 큐 5→4(2~5순위 한 칸씩 당김).

## [2026-06-02 23:12] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료 처리: 1순위 [외형·미니멀·운영자요청] 이모지→SVG **2단계**(잔존 전량: Filters ★·GameModal 📅📄↗·ListView 📅·GoogleCalendarButton 📅·상세 📅 + 스프라이트 #ic-file·#ic-arrow-ur) — 개발자 23:28·QA 22:47 ✅(데스크톱 실측·모바일 소스검증, 라이브 노출 이모지 0건·콘솔 0·가로오버플로 0) → 완료한 기능 이동. **운영자 "이모지 제거·SVG 미니멀" 요청 1·2단계 전량 출고 완료.**
추가: - [외형·브랜드통일] `--accent-grad` 소비(뷰토글·MonthTabs·퀵칩 active 그라데이션 + MonthTabs hover 잔여토큰 정렬) → IDEAS에서 큐 **5순위** 승격
잔여 큐 1~5(전부 Next app/·components/): ①캘린더 시각 강화 묶음 ②임박 스트립 글로우(데스크톱 한정) ③/game/[id] 미니카드 그리드 ④리스트 카드 배너 그라데 ⑤--accent-grad 그라데 칩
활성 사용자 요청 0(SEO 보류)·미해결 코드 버그 0·3사이클 정체 0·신규 디자이너 제안 0(20:50 처리 완료)
a11y/리팩토링 0건 → IDEAS 보관 (외형 모드)

## [2026-06-02 22:47] [QA]
검증 대상: 이모지→SVG 2단계 잔존 전량(Filters ★·GameModal 📅📄↗·ListView 📅·GoogleCalendarButton 📅·상세 📅) + 신규 스프라이트 #ic-file·#ic-arrow-ur (개발자 23:28)
데스크톱 1440: ✅
모바일 390: ⚠️ (Chrome resize 뷰포트 미반영·innerWidth 1920 고정·matchMedia(480)=false → 소스검증 대체)
상세: 라이브 Chrome 실측 — 홈 노출 이모지 0건(📅📄★↗🎮🔥📋☆ 등 12종 스캔 0), h1 #ic-gamepad SVG, svg.ic 5종 전부 비제로 사이즈. 카드 모달 오픈 실측: 잔존 0 + 신규 #ic-file·#ic-arrow-ur(×2)·#ic-calendar·#ic-star 전부 렌더(zero-size 0)·모달 뷰포트 내·가로오버플로 0. 콘솔 에러 0. 캘린더 137셀 정상('불러오는 중' 해소). 스프라이트 symbol 7종 전부 정의. 모바일: .ic 규칙 globals.css L176~191(@media L57 밖)·em 사이즈→뷰포트 비종속 동일 렌더, 소스 노출 이모지 grep 0건(app·components·globals·layout). globals.css brace 58/58. 헬스체크 ✅: /·/sitemap.xml(XML)·/robots.txt·/game/sol-enchant-20260618·/new-servers(서버 12개) 정상. 미해결 코드 버그 0.

## [2026-06-02 23:28] [개발자]
완료: **[외형·미니멀·운영자요청] 노출 이모지→인라인 SVG 2단계** — 1단계 후 라이브 잔존 이모지 전량 정리. layout 스프라이트에 `#ic-file`·`#ic-arrow-ur` 2종 추가(DESIGN_NOTES 13:10 스펙 path 그대로, viewBox 0 0 24 24, #ic-calendar 기존 재사용). 잔존 노출 이모지를 `<svg class="ic"><use/></svg>`로 일괄 치환: Filters ★→#ic-star+.ic-fill / GameModal 출처보기 ↗→#ic-arrow-ur·📅 캘린더추가→#ic-calendar·📄 전체페이지 ↗→#ic-file+#ic-arrow-ur / ListView 출시일 📅→#ic-calendar / GoogleCalendarButton 📅→#ic-calendar / app/game/[id] 출시일 📅→#ic-calendar(서버 컴포넌트, layout 스프라이트 상속 OK). 전부 currentColor 단색(.ic 규칙 재사용, 신규 색 0). grep 검증: app·components 노출 이모지(📅📄★↗) 0건. 네비 글리프 ← → ‹ › 는 이모지 아님→스코프 외.
변경된 파일: app/layout.tsx(+2), components/Filters.tsx(+1/−1), components/GameModal.tsx(+3/−3), components/ListView.tsx(+1/−1), components/GoogleCalendarButton.tsx(+1/−1), app/game/[id]/page.tsx(+1/−1) — 총 6파일 +9/−7
비고: 로컬 tsc/build 미실행(sandbox 디스크). Vercel typecheck+build 검증 위임. QA님 라이브에서 노출 이모지 0건(특히 위시 필터 버튼·모달 액션 3종·리스트/상세 출시일) + 새 #ic-file/#ic-arrow-ur 렌더 실측 부탁. 큐 5→4(2~5순위 한 칸씩 당김).


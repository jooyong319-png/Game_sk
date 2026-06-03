## [2026-06-04 00:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 'MonthTabs 모바일 가로 스크롤 어포던스(엣지 페이드 mask+scroll-snap)' 개발자 23:28(1666b87)·QA 23:45 라이브 ✅ → 완료한 기능 이동(번호큐 이미 미반영)
유지: 번호큐 1~4(ViewToggle 모바일 블록·리스트 장르 칩·통계줄 4색 분해·헤더 듀얼 radial) 순서 그대로(1순위 ViewToggle 보호 — 직전 여러 사이클 밀린 잔여라 신규는 5순위 말미만)
추가: - ⑤[외형·하이라이트·D-DAY강조] "🔥 출시 임박" 최근접 1건 대형 핫카드 승격 + 라이브 HH:MM:SS 카운트다운(HeroStrip.tsx+module.css, 디자이너 06-03 01:05 인벤#1). 카운트다운은 useEffect mount 후에만 렌더(SSR 미출력)해 날짜의존 하이드레이션(7건 이력) 재발 방지.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0(ViewToggle 1순위 승격 첫 사이클). 디자이너 신규 제안 0(최신 21:06 기처리). a11y/리팩토링 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 23:45] [QA]
검증 대상: MonthTabs 모바일 가로 스크롤 어포던스 — 엣지 페이드 mask + scroll-snap (개발자 23:28 1666b87)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 실측)
모바일 390: ✅ (resize 미반영 → 배포 CSS 직접 검증으로 갈음)
상세: 라이브 Chrome 배포 번들 CSS 실측 — `@media(max-width:480px)` `.MonthTabs_tabs` `mask-image:linear-gradient(90deg,transparent,#000 16px,#000 calc(100%-16px),transparent)`(양끝 16px 페이드)+`scroll-snap-type:x`(=proximity 기본), `.MonthTabs_tab` `scroll-snap-align:center` 전부 출고 확인. 월탭 12개(1~12월) 정상. 데스크톱 1920 실측 mask/snap=none(미디어쿼리 밖, 무영향 확인). 가로 오버플로 0(docScrollW 1905<1920). 콘솔 React #418/#423/#425·에러 0(MetaMask 확장 MaxListeners 경고만). 헬스 ✅(홈 h1 🎮·robots·new-servers 12·상세 raven2-zero2 정상). 신규 BUGS 0.
## [2026-06-03 23:28] [개발자]
완료: 큐 1순위 '[외형·모바일·높음] MonthTabs 가로 스크롤 어포던스 — 엣지 페이드 mask + scroll-snap' 구현. 12개 월탭이 모바일 가로 스크롤이나 스크롤 신호 0이라 잘린 9~12월 미발견이던 어포던스 부재 해소. 기존 `@media(≤480px)` 블록에 `.tabs` mask-image 양끝 16px 페이드('더 있음' 신호)+`scroll-snap-type:x proximity`, `.tab`에 `scroll-snap-align:center` 추가.
변경된 파일: components/MonthTabs.module.css(+5, `.tabs` 블록 +4·`.tab` snap +1)
비고: CSS-only(tsx 무변경, `.tabs`/`.tab` className은 MonthTabs.tsx L14·L19 사용 중 확인). 데스크톱 무영향(미디어쿼리 밖)·mask 미지원 폴백 현행 스크롤. 신규 색 0·brace 7/7. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 5→4. QA님 라이브 모바일 ≤480px 월탭 양끝 페이드·중앙 스냅·9~12월 발견성·데스크톱 무영향·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.
## [2026-06-03 23:55] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위) + 중복 1건 제거
완료: 1순위 '[외형·헤더] 인트로 태그라인 헤더 통합' 개발자 23:20·QA 23:40 라이브 ✅ → 완료한 기능 이동
중복 제거: 직전 4순위 'HeroStrip 임박 카드 글로우' = repo 교차검증 결과 **이미 출고 완료**(glowDday/glowCat 분기·--cat 주입·color-mix 외곽 글로우·D-DAY #ff7a59 scale·@media≤480 리셋·reduced-motion 전부 존재, 디자이너 라이브 '4글로우카드' 확인) → 22:00 IDEAS→큐 재승격이 중복이었음. 큐 제거·IDEAS 종결.
유지: 큐 1~3(MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩) 순서 그대로(1순위 MonthTabs 보호 — 신규는 4·5순위 말미만)
추가: - ④[외형·카테고리 시각차별화] 통계줄 카테고리 4색 분해(Home.tsx 통계 노드+Home.module.css, 디자이너 13:05 데스크#2)
      - ⑤[외형·헤더 임팩트] .site-header::before 듀얼 브랜드 radial(블루+퍼플, globals.css, 디자이너 13:05 데스크#3)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 23:40] [QA]
검증 대상: 인트로 태그라인 헤더 통합 + .subtitle 위계 강화 (개발자 23:20 4d31340)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 Chrome 실측 — `.site-tagline` 헤더 내 h1 직속 다음형제 1개(중복 0·body `.subtitle` 0), 색 #cfd6e0(rgb 207,214,224)·1.1rem(17.6px)·500·letter-spacing −0.01em. 가로 오버플로 0(docScrollW 1905<1920). 390 합성 리플로서 태그라인 358px·1행·헤더 오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세 raven2·new-servers 12). 콘솔 React #418/#423/#425·에러 0(MetaMask 확장 MaxListeners 경고만). 정적 HTML "/" 캐시 옛 위계 잔존(태그라인 광고 뒤)이나 new-servers 신규 위계 반영·Chrome 렌더 정상 → Vercel 캐시 전파중. 신규 BUGS 0.
## [2026-06-03 23:20] [개발자]
완료: 큐 1순위 '[외형·헤더·높음] 인트로 카피 태그라인 헤더 통합 + .subtitle 위계 강화' 구현. 태그라인을 Home 본문(광고~임박 스트립 사이 회색 #888 고아 한 줄)에서 떼어 `.site-header` h1 바로 아래로 이동 → 타이틀+태그라인 한 덩어리, 히어로 밴드 radial glow 배경 공유. 톤업(#cfd6e0·1.1rem·500·letter-spacing -0.01em), 모바일 ≤480px 1rem 비례 축소.
변경된 파일: app/layout.tsx(+1 `<p.site-tagline>` 삽입)·app/globals.css(+10 `.site-header .site-tagline`+@media480)·components/Home.tsx(−2 subtitle p 제거)·components/Home.module.css(−6 미사용 .subtitle 규칙 제거).
비고: 디자이너 임팩트안(헤더 통합) 채택. 신규 색 0(#cfd6e0 기존 톤 계열). globals brace 71/71·Home.module 3/3·잔존 subtitle 참조 0건. 로컬 빌드 sandbox 제한 → Vercel typecheck+build 위임. 큐 4→3. QA님 라이브 데스크/모바일 태그라인 헤더 통합 위계·가로 오버플로 0 실측 부탁.
## [2026-06-03 22:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·상세] /game/[id] 상세 `.detail-meta` 스펙시트화' 개발자 21:20·QA 21:47 라이브 ✅(li 4행 hairline·라벨 대문자 고정폭 muted·값 밝게·콜론 제거·가로 오버플로 0·콘솔 #418/#423/#425 0건)로 종결 → 완료한 기능 이동(개발자 5→4 반영 확인).
유지: 기존 큐 1~4(인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩) **순서 그대로**. ※1순위 '인트로 subtitle 위계'가 직전 여러 사이클 신규 고우선 삽입(detail-meta·셀명 타이포)에 반복 밀려 미착수 → 이번 사이클은 신규 항목을 1순위 앞에 안 끼우고 **5순위 말미에만 추가**해 개발자 :20 1순위 착수 보장.
추가: - [외형·D-DAY강조·보통] HeroStrip '🔥 출시 임박' 카드 카테고리색 글로우 시각 위계(D-3 이내 box-shadow+D-DAY scale·디자이너 06-02 13:01안, IDEAS→큐 5순위 재승격, 'D-DAY 강조' 모드 정합) → 큐 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 디자이너 21:06 잔여 보통 3건 IDEAS 유지. 코드 미수정(문서만).
## [2026-06-03 21:47] [QA]
검증 대상: /game/[id] 상세 .detail-meta 스펙시트화 (개발자 21:20 bf351f5)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize/mq480 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 실측 — .detail-meta li 4행 display:flex·행 hairline 1px rgba(255,255,255,0.06)·마지막행 border 0px·값 색 #e6e6e6·strong 고정폭 57.6px(4.5em)·uppercase·muted #888·리터럴 콜론 0건·컨테이너 gap 0. 358px 합성 리플로서 4행(개발/배급/플랫폼/장르) 전부 scrollW=clientW 오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세·new-servers 12). 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 MaxListeners 경고만). 가로 오버플로 0(docScrollW 1905<1920). 신규 BUGS 0.
## [2026-06-03 21:20] [개발자]
완료: **[외형·상세·높음] `/game/[id]` 상세 `.detail-meta` 평문 4행 → 스펙시트화** (큐 1순위, 디자이너 21:06 데스크#1)
SEO 랜딩 첫 화면 최대 콘텐츠 블록인 상세 메타(개발사/배급사/플랫폼/장르)가 라벨·값 같은 톤·행 구분 0의 회색 평문 4줄이라 한 덩어리로 읽히던 문제 해소. `.detail-meta li`=flex+행 hairline(`border-bottom:1px rgba(255,255,255,0.06)`)+값 밝게(#e6e6e6), `strong`=라벨 고정폭(`flex:0 0 4.5em`)·대문자·muted(#888), 컨테이너 gap 0.5rem→0(행 padding이 간격 담당). 디자이너안은 CSS only였으나 `page.tsx` 4행의 리터럴 `: ` 1건 제거 동반(개발자 판단 — flex 고정폭 라벨 컬럼에서 콜론이 떠 보여 스펙시트 정렬 해침, gap이 라벨-값 간격 담당).
변경된 파일: app/globals.css(+1/−2 줄), app/game/[id]/page.tsx(4행 `: ` 제거)
비고: 신규 색 0(기존 #888·#e6e6e6 재사용)·CSS brace 69/69·esbuild tsx OK. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 메타 4행 hairline 구분·라벨 대문자 고정폭 muted·값 밝게·콜론 제거·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.
## [2026-06-03 21:11] [기획자]
TODO 큐 4→5 (모드: 외형 집중)
추가: - [외형·상세·높음] `/game/[id]` 상세 `.detail-meta` 평문 4행→스펙시트화 (디자이너 21:06 데스크#1, CSS only, IDEAS→큐 1순위)
유지: 인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩 → 2~5순위로 한 칸씩 밀림
IDEAS 보관: 디자이너 21:06 잔여 보통 3건(HeroStrip 타이틀 warm 좌띠·Home.module.css 모바일 패딩·리스트 날짜 요일 주말색)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 21:10] [리서처]
리서치 완료 (4개 카테고리)
- 모바일 0→0, PC/콘솔 0→0, 글로벌 0→0, 신규서버 8→0 (후보→통과)
- 신규 0개 / 갱신 0개 / 정리(180일+) 0개
- 총 등록 44개 (직전 3사이클 연속 0건 — 캘린더 포화 지속)
- 워치리스트 이번 사이클: 메이플스토리M·로스트아크·던전앤파이터·로한2·아이온2·마비노기모바일 (09:20 커버분과 비중복으로 신규 6종 점검)
[검증 탈락]
- 카카오 '도깨비의세계'(3분기 출시·7월 사전등록): 일정 분기 단위(Q3=7~9월)로 월 단위 미확정 → 추가 X(의심 시 보류 원칙)
- 메이플M/로스트아크/마비노기모바일 신규서버: 올해 공식 신규서버 오픈 공지 미확인(기존 등록건 외) → 추가 X
- 던전앤파이터 '퍼스트 서버': 테스트 서버 개념(정식 신규서버 아님) → 대상 외
- 로한2: 서버 통합·글로벌 확장만, 국내 신규서버 구체 날짜 X → 추가 X
- 아이온2: 신규서버(포에타/이스할겐)=2025-11 과거건, 글로벌=2026 하반기(aion2-global 기등록) → 추가 X
- 글로벌 AAA(Wild Blue Skies 8/13·Grave Seasons 8/14 등): AA/인디·국내 주목도 낮음 → 품질 기준 미충족, 추가 X
## [2026-06-03 21:06] [디자이너]
외형 점검 완료 (데스크 1440 라이브 + 모바일 390 소스 + 인벤 비교)
데스크 주요: 상세 `.detail-meta`(개발사/배급사/플랫폼/장르) 평문 4줄 → 스펙시트화(라벨 고정폭·대문자 muted/값 밝게/행 hairline·CSS only·높음) + HeroStrip 섹션 타이틀 '🔥 출시 임박' warm(#f5a623) 좌띠+1.3rem
모바일 주요: `Home.module.css`가 유일하게 모바일 블록 미보유 → `@media(≤480){ .home{padding:1rem→0.7rem} }`로 390px 본문폭 ~10px 회수
인벤 참고: 리스트 카드 날짜 `.date` 요일에 주말색(일#e57373/토#7aa7ff) 적용 — 캘린더엔 이미 주말색이나 리스트 날짜는 일괄 블루라 자체 불일치(요일 분리 tsx 동반)
DESIGN_NOTES에 4개 제안 추가(데스크2·모바일1·인벤1), 데스크#1(detail-meta 스펙시트) PROJECT_STATUS IDEAS 등재. ※Chrome resize 모바일 뷰포트 미반영(innerWidth 1920·mq480 false·docW 1905, 직전 사이클 동일) → 소스 검증 갈음.
## [2026-06-03 20:47] [QA]
검증 대상: 캘린더 셀 게임명 word-break:break-all→keep-all + overflow-wrap:anywhere (개발자 20:27 c52efe0)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 실뷰포트/mq480 미반영 → 360px 합성 리플로 갈음)
상세: 라이브 실측 — .cellName computed word-break:keep-all·overflow-wrap:anywhere·line-clamp 2 적용 확인. 문제됐던 "파이널 판타지 7 리버스 (Switch 2)" 셀이 어절 단위 2줄 클램프(scrollW 149=clientW, 셀 내부 오버플로 0)로 라틴/괄호 글자단위 절단 해소. 가로 오버플로 0(docScrollW 1905<1920). 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 경고만 → 하이드 해소 유지). 360 합성: 캘린더 grid(296=296)·main 오버플로 0, /game/sol-enchant 상세 D-15·related 그리드 오버플로 0·콘솔 에러 0. 셀명은 ≤480서 display:none이라 금일 변경 모바일 무영향. 헬스 ✅(홈 h1·sitemap XML·robots·상세·new-servers 12). 신규 BUGS 0.
※resize_window innerWidth/matchMedia 미반영(1920 고정·mq480 false) 환경 한계 → 1920 실측+360 합성 리플로 대체. 금일 변경=데스크톱 전용 셀명 타이포라 대표성 충분.
## [2026-06-03 20:27] [개발자]
완료: **[외형·타이포·높음] 캘린더 셀 게임명 `word-break:break-all`→`keep-all` + `overflow-wrap:anywhere`** (큐 1순위)
라이브 데스크 1440서 셀 게임명이 글자 단위로 절단("파이널 판타지 7 리버스 (Switch↵2)"·라틴/괄호 어색 절단)되던 결함 해소. `.cellName`의 `word-break:break-all`→`keep-all`(한글 어절 보존·공백에서만 줄바꿈)로 교체 + `overflow-wrap:anywhere`(공백 없는 초장문 영문 안전망) 추가. `-webkit-line-clamp:2`·말줄임 2줄 클램프 그대로 유지.
변경된 파일: components/CalendarView.module.css (+1줄 추가/1줄 교체)
비고: 신규 색 0·CSS brace 63/63 균형·tsx 무변경. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 캘린더 셀 게임명이 어절 단위로 자연스럽게 2줄 클램프되는지·라틴 단어 중간 절단 해소·가로 오버플로 0 실측 부탁.
## [2026-06-03 13:40] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 직전 1순위 '리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 좌상단 리본' 개발자 13:20·QA 13:30 라이브 ✅ → 완료한 기능 이동(개발자 5→4 반영 확인)
추가: - [외형·타이포·높음] 캘린더 셀 게임명 `word-break:break-all`→`keep-all`+`overflow-wrap:anywhere` (디자이너 13:05 데스크#1, 라이브 가시 타이포 결함 → 신규 1순위)
유지: 인트로 subtitle 위계·MonthTabs 가로 스크롤·ViewToggle 모바일 블록·리스트 장르 칩 → 2~5순위로 한 칸씩 밀림
IDEAS 보관: 디자이너 13:05 잔여 보통 4건(통계줄 카테고리 4색 분해·헤더 듀얼 브랜드 radial·리스트 배너 모바일 40px·image_url 배경이미지)
사용자 요청 활성 0(SEO 보류 — 안 건드림). 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 13:30] [QA]
검증 대상: 리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 좌상단 리본 (개발자 13:20 a5e1a57)
데스크톱 1440: ✅ (resize 실뷰포트 미반영·innerWidth 1920 고정 실측)
모바일 390: ✅ (resize 실뷰포트/mq(≤480) 미반영 → 358px 합성 리플로 갈음)
상세: 라이브 캐시버스트 — 리스트뷰 .cardBanner 세로 그라데(computed linear-gradient(180deg, cat → cat 34%alpha))·D-DAY 리본 1개만(글로벌 보라 #ba68c8, diff===0 한정)·과거('출시됨')카드 무충돌. 콘솔 React #418/#423/#425·에러 0건(MetaMask 확장 경고 2건만) → 하이드레이션 7건 라이브 미재현(05:47 해소 확정 유지). 가로 오버플로 0(scrollW1905<1920). 358 합성: 리스트 카드 단일컬럼·리본 카드 내부(right70<342)·오버플로 0; /game/[id] 상세 백드롭·'같은 시기' 6장 단일컬럼·오버플로 0. 헬스 ✅(홈 h1·sitemap XML·robots·상세 D-15·new-servers 12). 신규 BUGS 0.
※resize_window 실뷰포트/미디어쿼리 미반영(innerWidth 1920·matchMedia480 false)→1920 실측+358 합성 대체. 금일 변경=그라데/리본(미디어쿼리 무관)이라 합성 대표성 충분.
## [2026-06-03 13:20] [개발자]
완료: **[외형·리스트·보통] 리스트 카드 배너 카테고리 세로 그라데이션 + D-DAY 카드 좌상단 리본** (큐 1순위)
카드 상단 `.cardBanner`가 카테고리 단색 tint라 밋밋하고 D-DAY가 amber border로만 구분되던 문제 해소. (a) `.cardBanner`를 카테고리색 세로 그라데이션(`linear-gradient(180deg, var(--cat), color-mix(in srgb,var(--cat) 34%,transparent))`, 단색 `var(--cat)` 폴백 선행)으로 — 배너에 인라인 `--cat` 주입. (b) D-DAY(diff 0) 카드 좌상단에 카테고리색 리본 배지(`.ddayRibbon`, radius 0 0 8px 0). 배너 이모지는 채도 높아진 배너 대비 흰색화.
변경된 파일: components/ListView.tsx (+3/−2), components/ListView.module.css (+20/−1)
비고: CATEGORY_META 4색 단일 출처 재사용(신규 임의 색 0)·`.released`(과거카드 약화)·`.imminent`와 무충돌(리본은 D-DAY만·`.item` overflow:hidden 내부). TypeScript strict 유지(any 0, CSSProperties 캐스트). esbuild tsx 트랜스폼 OK·CSS brace 38/38. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 리스트 카드 배너 세로 그라데이션·D-DAY 리본·과거('출시됨') 카드 약화 무충돌·가로 오버플로 0·콘솔 #418/#423/#425 0건 실측 부탁.
## [2026-06-03 13:05] [디자이너]
외형 점검 완료 (데스크 1440 + 모바일 390 소스 + 인벤 비교)
데스크 주요: 캘린더 셀 게임명이 `word-break:break-all`로 단어 중간 절단(라이브 "(Switch↵2)" 확인) → keep-all+overflow-wrap:anywhere 제안(높음). 통계줄 "총 44개" 단색 → 카테고리 4색 분해, 헤더 글로우 블루 단일 → 듀얼 브랜드 radial.
모바일 주요: 리스트 `.cardBanner` 모바일 오버라이드 0 → 1열 스택서 56px 빈 색배너 누적, @media(≤480) height 40px 제안. (Chrome resize 모바일 뷰포트 미반영=직전 사이클 동일 한계, 소스 갈음.)
인벤 참고: 인벤 지배 시각요소=게임 아트워크 이미지(히어로/핫카드/007 카드) → 우리 `.cardBanner` image_url 미사용(대부분 null·색배너 대체) → image_url 있을 때 다크 오버레이 배경이미지 렌더+폴백 제안.
DESIGN_NOTES에 5개 제안 추가(데스크3/모바일1/인벤1). 높음 1건(셀명 keep-all) → PROJECT_STATUS IDEAS 승격.
## [2026-06-03 12:30] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·상세] `/game/[id]` 카테고리색 라디얼 백드롭' — 개발자 12:20 완료(a7cc251, .detail-backdrop 인라인 radial-gradient)·QA 11:48 라이브 ✅(카테고리색 글로우·상단 4px 바 동톤·가로 오버플로 0·콘솔 #418/#423/#425 0건) → 완료한 기능 이동(개발자 큐 5→4 반영 확인).
유지: 리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화·MonthTabs 가로 스크롤·ViewToggle 모바일 블록 = 1~4순위.
추가: - [외형·리스트·보통] 리스트 카드 장르 칩(genres[] 무채색 pill 3개, 디자이너 09:05 인벤#1, 데이터 44/44 보유·리서처 선결 불필요, IDEAS→5순위) → 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 11:48] [QA]
검증 대상: /game/[id] 상세 카테고리색 라디얼 백드롭(.detail-backdrop 인라인 radial-gradient, 개발자 12:20 a7cc251)
데스크톱 1440: ✅ (이 환경 resize 미반영·innerWidth 1920 고정에서 실측)
모바일 390: ✅ (resize 미반영·innerWidth 1920 고정 → 358px 합성 리플로로 검증)
상세: 라이브 캐시버스트 실측 — sol-enchant 상세 .detail-backdrop 존재, radial-gradient(80% 45% at 50% 0%, #81c78422→transparent 60%) 카테고리색(국내모바일 초록 #81c784) 글로우 정상·.game-detail borderTop 4px #81c784 동톤 일치·D-day 배지 D-15(먼미래 faint #2a2e38)·같은시기 그리드 6장. 가로 오버플로 0(scrollW1905<1920). 358px 합성: backdrop/카드/related 오버플로 0·related-grid 단일컬럼·글로우 유지. 콘솔 React#418/#423/#425·에러 0건(MetaMask 확장 경고만). 헬스 홈(h1 게임패드SVG+"게임 출시 캘린더"·125셀·총44개)·sitemap XML·robots·new-servers(12)·상세 정상. 신규 BUGS 0.
※Chrome resize_window가 innerWidth 미반영(1920 고정)→실뷰포트 1440/390 미확인, 1920 실측+358 합성 리플로 대체. 금일 변경=인라인 글로우(미디어쿼리 무관)라 합성 대표성 충분.
## [2026-06-03 12:20] [개발자]
완료: **[외형·상세·보통] `/game/[id]` 상세 카테고리색 라디얼 백드롭 (빈 검정 공백 해소)** (큐 1순위)
상세 카드가 평면 #0f1115 검정 공백에 떠 면 깊이 0이던 문제 해소(상단 4px 바·D-day 배지는 기출고). `catColor=CATEGORY_META[game.category].color` 변수 추출 후 반환 fragment 전 콘텐츠(detail-top 광고·`.game-detail`·`.detail-related`·detail-bottom 광고)를 `<div className="detail-backdrop" style={{ background: `radial-gradient(80% 45% at 50% 0%, ${catColor}22, transparent 60%)` }}>`로 래핑 → 카테고리색(초록/파랑/보라/주황) α≈+22 글로우가 상단 중앙→카드 상부 뒤로 퍼지다 60%서 페이드. 상단 4px 바와 동톤 일관, 검정 공백에 색 깊이 부여.
변경된 파일: app/game/[id]/page.tsx (+9/−1)
비고: CATEGORY_META 4색 단일 출처 재사용(신규 색 0)·CSS 신규 규칙 0(인라인 배경만)·빌드타임 생성·런타임 무영향. TypeScript strict 유지(catColor:string, any 0). esbuild tsx 트랜스폼 OK. 래퍼가 main 콘텐츠 폭 안이라 full-bleed 미사용 → 가로 오버플로 위험 없음. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 상단 카테고리색 라디얼 글로우·카테고리별 색 일관·상단 4px 바 톤 일치·가로 오버플로 0·콘솔 0 실측 부탁.
## [2026-06-03 11:30] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·신규컴포넌트] `/game/[id]` "같은 시기 출시" 미니카드 그리드' — 개발자 11:20 완료·QA 10:50 라이브 ✅(±2주 윈도우·가까운순 3~6개·관련0건 숨김·미니카드 내부이동·카테고리 좌측바·콘솔 #418/#423/#425 0건) → 완료한 기능 이동(개발자 큐 5→4 반영 확인).
유지: /game/[id] 라디얼 백드롭·리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화·MonthTabs 가로 스크롤 어포던스 = 1~4순위.
추가: - [외형·모바일·보통] ViewToggle 모바일 @media(≤480px) 블록 신설 (디자이너 09:05 모바일#2, 마지막 미보유 컴포넌트·Filters/GameModal 선례 동형, IDEAS→5순위) → 4→5.
IDEAS 보관: 디자이너 09:05 잔여 2건 — 장르 칩(리스트 카드, genres 44/44 보유)·광고 placeholder 약화(.ad-slot dashed→solid·min-height 250→160).
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 10:50] [QA]
검증 대상: /game/[id] 하단 '같은 시기 출시' 관련 미니카드 그리드(±2주·가까운순 3~6개·관련0건 숨김, 개발자 10:31 7470134)
데스크톱 1920: ✅ (이 환경 창폭 1440 미적용·1920 고정에서 검증)
모바일 390: ✅ (창폭 390 미반영·innerWidth 1920 고정 → 컨테이너 358px 합성 리플로 테스트로 단일컬럼·그리드 오버플로 0 확인)
상세: 라이브 캐시버스트 실측 — raven2-zero2(관련11) 그리드 6장 가까운순 정렬 정상(poe2 출시됨·ff7 D-DAY·미르진/메이크드라마 D-1·블소 출시됨·고딕 D-2), 카테고리 좌측 4px 바 색상 정상(글로벌 보라·신서버 주황·모바일 초록), 미니카드 클릭→/game/poe2 내부이동 OK(이동후 페이지도 그리드 6장). 관련0건 dk-mobile 섹션 미렌더 확인. 콘솔 React #418/#423/#425·에러 0건. 헬스 홈(h1 🎮·총44개)·sitemap(50 URL)·robots·상세·new-servers(서버12) 전부 정상. 가로 오버플로 0(scrollW1905<1920). 신규 BUGS 0.
※주의: 캐시버스트 미적용 WebFetch는 배포후 16분 시점에도 구 CDN 캐시(그리드 누락) 반환 → 라이브 검증은 ?t= 필수.
## [2026-06-03 11:20] [개발자]
완료: **[외형·신규컴포넌트·보통] `/game/[id]` 하단 "같은 시기 출시" 관련 게임 미니카드 그리드** (큐 1순위)
빌드타임에 출시일 ±2주(14일) 윈도우 내 다른 게임을 자기 제외·가까운 순 3~6개 추려 `</article>` 직후 `<section.detail-related>`(h3 "같은 시기 출시" + `<a href>` 미니카드 그리드)로 렌더, 관련 0건이면 섹션 미렌더. 미니카드=카테고리색 좌측 4px 바·게임명(700)·formatShortDate 출시일·D-day. CSS `.related-grid`(auto-fill minmax(220px,1fr) gap12)·`.related-card`(hover accent border+translateY-2px) 신설, 메인 톤·CATEGORY_META 4색 재사용(신규 색 0).
변경된 파일: app/game/[id]/page.tsx (+44/−1), app/globals.css (+11)
비고: TypeScript strict 유지(any 0). esbuild로 tsx 트랜스폼 OK, games.json 44개 시뮬레이션 — 관련>0 42개·관련=0 2개(섹션 숨김 확인)·거리순 정렬 정상, CSS brace 68/68 균형. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 /game/[id] 상세 하단 '같은 시기 출시' 그리드 노출·카테고리 좌측 바·관련 0건 게임(상세 2개) 섹션 숨김·미니카드 클릭 내부이동 실측 부탁.
## [2026-06-03 11:00] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·캘린더] 캘린더 컨테이너 패널 카드화' — 개발자 10:20 완료(.view #13151b·radius14·border·pad14, 모바일 ≤480 pad9·radius12, CSS-only brace 63/63)·QA 10:40 라이브 ✅(데스크 패널 카드 묶음·가로 오버플로 0·강조 셀 무회귀·콘솔 React#418/#423/#425 0건) → 완료한 기능 이동, 큐에서 종결.
유지: /game/[id] 같은시기 그리드·/game/[id] 라디얼 백드롭·리스트 배너 그라데+D-DAY 리본·인트로 카피 .subtitle 위계강화 = 1~4순위.
추가: - [외형·모바일·높음] MonthTabs 가로 스크롤 어포던스(엣지 페이드 mask + scroll-snap, 디자이너 09:05 모바일#1, IDEAS→5순위) → 4→5.
사용자 요청 활성 0(SEO 보류 — 안 건드림). QA 신규 BUGS 0(하이드레이션 7건 05:47 해소 확정 유지). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 10:40] [QA]
검증 대상: 캘린더 컨테이너 패널 카드화(.view: #13151b·radius14·border·pad14) + 모바일 ≤480 비례 축소(pad9·radius12)
데스크톱 1440: ✅ (실측 뷰포트 1920 — 창폭이 1440 미만으로 안 줄어 1920에서 검증)
모바일 390: ⚠️ (이 환경 Chrome 창폭이 390으로 안 줄어 라이브 390 렌더 미확인 / 단 라이브 CSS 번들에 @media≤480 .view{padding:9px;border-radius:12px} 적재 확인)
상세: 데스크 .view 패널 카드 적용 실측(bg rgb(19,21,27)·br14·border 1px rgba(255,255,255,.06)·pad14), grid 패널 내부 래핑, 가로 오버플로 0(scrollW1905<vw1920). 강조 셀 무회귀(today2·cellHas12·임박스트립4). 콘솔 React #418/#423/#425·adsbygoogle 0건(확장프로그램 경고만). 헬스: 홈/sitemap/robots/game상세/new-servers 전부 200. 신규 BUGS 0.
## [2026-06-03 10:20] [개발자]
완료: **[외형·캘린더·보통] 캘린더 컨테이너 패널 카드화 + 빈 셀 hairline 보강** (큐 1순위)
`CalendarView.module.css` `.view`(CalendarView.tsx L97 section 루트)에 `background:#13151b; border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:14px` 패널 카드 부여(기존 `margin:1rem 0` 유지) → 격자가 페이지에 떠 있던 것을 면 카드로 감쌈. 모바일 ≤480px에 `.view{padding:9px; border-radius:12px}` 비례 축소. 빈 셀 hairline은 기존 그리드 gap 배경(`.grid` gap:1px·#2a2e38)이 셀 구분선으로 현행 유지. today/임박/선택·cellHas 카테고리 좌띠는 셀 단위라 무영향(무회귀).
변경된 파일: components/CalendarView.module.css (+8/−1, CSS-only)
비고: 신규 색 0(패널 톤 #13151b 재사용)·CSS brace 63/63 균형·tsx 무변경. 로컬 빌드 sandbox 제한 → Vercel(typecheck+build) 위임. QA님 라이브 데스크·모바일 캘린더 패널 카드 묶음·가로 오버플로 0·강조 셀 무회귀 실측 부탁.
## [2026-06-03 09:20] [리서처]
리서치 완료 (4개 카테고리)
- 모바일 6→0, PC/콘솔 3→0, 글로벌 5→0, 신규서버 8→0 (후보→통과)
- 신규 0개 / 갱신 0개 / 정리(180일+) 0개
- 총 등록 44개 (직전 2사이클 연속 0건 — 캘린더 포화 상태 유지)
[검증 탈락]
- 오딘 신규서버 '에기르'(6/26): ★연도 함정★ 공지 "6월 26일(水)"=2024년(3주년). 오딘 출시 2021-06-29 → 3주년은 2024년, 2026년은 5주년. 2026-06-26은 금요일이라 불일치. 과거 동일 실수 경고대로 추가 X.
- 아키에이지워 '멜리사라'(5/3): 2023년 공지. '이녹'/'그델론·에윈'/'바르아': 올해 명확 날짜 미확인 → 추가 X.
- 프라시아전기 '카렐'(4/28): 2023년 공지 → 추가 X.
- 달빛조각사 글로벌통합 'G-서버'(2026-04-03): 단일 출처 위주·이미 2개월 경과 과거건 → 보류.
- 로드나인 '디나페리'(3/27)·레이븐2 'ZERO/ZERO2'(5/27·6/1)·리니지M '켄트·오렌'·아이온2 글로벌(2026 하반기): 이미 등록됨(중복) → 추가 X.
- 나이트크로우 '에스텔라/신시아·콘라드': 2025년 공지·올해 6월 날짜 미확인 → 추가 X.
- 글로벌 후보(7th Guest 리메이크·열혈서유기·모노폴리 스타워즈 등): 한국/주목도·연도 재검증 미충족 → 추가 X.
## [2026-06-03 09:16] [기획자]
TODO 큐 4→5 (모드: 외형 집중, 큰 단위)
완료: 1순위 '[외형·D-DAY강조] 임박 스트립 카드 임박도별 글로우(데스크톱)' — 개발자 완료·QA 라이브 ✅·신규 BUGS 0 → 완료한 기능 이동, 큐에서 종결.
유지: 캘린더 컨테이너 패널 카드화·/game/[id] 같은시기 그리드·/game/[id] 라디얼 백드롭·리스트 배너 그라데+리본 = 1~4순위.
추가: - [외형·헤더·높음] 인트로 카피 .subtitle 위계 강화 + 헤더 통합 (디자이너 09:05 데스크#1, IDEAS→5순위) → 4→5.
정리: 디자이너 09:05 다른 높음 'MonthTabs 모바일 스크롤 어포던스'는 IDEAS 보관(차기). '헤더 풀블리드 히어로 밴드'는 06-02 10:29 이미 출고 확인 → 큐소진후보에서 제거(중복 정리).
사용자 요청 활성 0(SEO 보류 — 안 건드림). 3사이클 정체 0. a11y/리팩토링 제안 0건 → IDEAS 보관(외형 모드). 코드 미수정(문서만).
## [2026-06-03 09:05] [디자이너]
외형 점검 완료 (데스크 1440 Chrome 라이브 + 모바일 390 소스검증 + 인벤 비교)
데스크 주요: 인트로 카피 `.subtitle`(#888·0.95rem)가 광고슬롯~임박 스트립 사이 붕 떠 위계 약함 → 톤업/헤더 통합(높음). 부수: `.ad-slot` 점선 placeholder가 특히 /game/[id] 상세서 콘텐츠보다 튐 → solid 헤어라인+min-height 축소(보통).
모바일 주요: MonthTabs 12탭 가로 스크롤인데 스크롤 신호 0 → @media≤480 엣지 페이드 mask+scroll-snap(높음). ViewToggle만 모바일 블록 부재(Filters/GameModal 선례 동형) → @media≤480 풀폭 2분할(보통).
인벤 참고: 행마다 장르/키워드 태그칩 → 우린 `genres[]` 44/44 보유하나 리스트 카드 미노출 → 무채색 다크 장르 칩(데이터 선결 불필요, 보통).
DESIGN_NOTES에 5개 제안 추가(데스크2·모바일2·인벤1). 높음 2건(인트로 카피·MonthTabs 스크롤) PROJECT_STATUS IDEAS 등재. 큐/IDEAS/완료와 중복 0. a11y/리팩토링 0건(외형 모드). 코드 미수정(문서만).

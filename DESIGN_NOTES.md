# 🎨 디자인 노트 (UX/UI)

AI 디자이너 Claude가 배포된 사이트(https://gcalen.com/)를 직접 보고 작성하는 UX/UI 개선 제안 모음.
디자이너는 코드를 직접 수정하지 않는다. 여기 제안 → 기획자가 TODO로 → 개발자가 구현.

## 작성 형식
```

---

_(오래된 37 개 항목은 archive/DESIGN_NOTES_2026-05.md로 이동됨)_

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

---

## [2026-05-30 00:05] [디자이너] — 라이브 재점검 (반영 확인 + 신규 a11y/밀도)
실측: https://gcalen.com/ Chrome 데스크톱. 캘린더 뷰·날짜 클릭 패널·셀 dot/보더 zoom 확대 확인. 창 리사이즈가 렌더 뷰포트에 반영 안 돼 모바일은 styles.css @media(max-width:480px) 기준 병행 평가.

### 직전 사이클 이후 반영 확인 (개발자 작업 검증 — 양호)
- OK **날짜 클릭 패널 = 한 줄 컴팩트 행** 정상: `색점·게임명·플랫폼·D-day·☆`, 내부 스크롤 사라지고 페이지 흐름으로 인라인 확장됨(스크롤 트랩 해소). 운영자 요청 2건(컴팩트 행/내부 스크롤 제거) 충족.
- OK **통계줄 '총 29' = 카테고리 드롭다운 '전체 (29)' 일치**. 18:05 #2로 보고했던 29 vs 25 불일치 해소됨 -> 해당 제안 종결(재등록 안 함).
- OK 진입 시 '오늘 이후 가장 가까운 출시 달' 자동 진입 정상(5월에 임박 출시 있어 5월 유지).
- TODO 여전히 미반영(중복 등록 안 함): 헤더 로고화/컴팩트(운영자), `.day.selected` amber 보더 <-> `.day-soon` amber 보더 색 충돌(18:05 #1), 셀 hover 배경/키보드 포커스(18:05 #4 — `.day{cursor:pointer}`만 들어가고 hover bg·focus-visible는 아직).

### 발견한 문제 / 개선점 (신규, 미등록 항목만)

1. **카테고리를 '색'으로만 구분 — 색각이상 접근성 미흡** — 우선순위: 보통
   - 어디서: 캘린더 셀 `.day-dot`(7px 원)과 상단 범례 `.legend-dot`. 4색이 green #81c784 / blue #64b5f6 / purple #ba68c8 / orange #ff8a65.
   - 왜: 카테고리를 오직 색상(hue)으로만 전달. 적·녹색약(deuteran/protan) 사용자는 green<->orange, 셀에 dot만 있고 라벨 없을 때(2건 이상 셀) green<->purple 구분이 어려움. 색 외 단서가 전혀 없음(WCAG 1.4.1 '색만으로 정보 전달 금지' 위반 소지).
   - 개선:
     - 셀 `.day-dot`에 카테고리명을 `title`/`aria-label`로 부여(현재 셀 전체 title만 있음) -> 마우스/스크린리더 보조 단서.
     - 더 확실히: dot에 **모양 차이** 추가(모바일=원, PC/콘솔=사각 `border-radius:1px`, 글로벌=마름모 `rotate(45deg)`, 신규서버=링 `border만`). 색+모양 이중 인코딩이면 색각이상에도 구분 가능.
     - 범례도 동일 모양 적용(텍스트 라벨은 이미 있음 -> 모양만 맞추면 셀<->범례 매칭 명확).

2. **날짜 패널: 출시 1건인 날짜마다 날짜 헤더 1줄이 따로 붙어 세로 반복 과다** — 우선순위: 보통
   - 어디서: "OO 이후 출시 N건" 패널. 1건만 있는 날짜도 `YYYY.MM.DD (요일)` 헤더 + 행 1개 구조라, 25건 패널이 사실상 헤더/행/헤더/행 반복(06.03->1건, 06.04->1건, 06.05->1건…)으로 절반이 날짜 헤더.
   - 왜: 스캔 시 날짜 헤더가 시각 노이즈가 되고 세로가 불필요하게 길어짐. 컴팩트 행으로 만든 이점이 헤더 반복으로 일부 상쇄.
   - 개선: **1건 날짜는 날짜를 행 안으로 흡수** -> `06.04(목) · ●게임명 · Android · D-7 · ☆` 한 줄로. 독립 날짜 헤더는 **2건 이상인 날짜만** 유지. (renderDayRows에서 dateCounts 기반 분기 — 리스트 뷰 single-game 처리와 같은 패턴 재사용.)

3. **'오늘로' 버튼: 이미 현재 달을 보고 있을 때도 활성처럼 보임** — 우선순위: 낮음
   - 어디서: 캘린더 상단 `‹ 2026년 5월 › [오늘로]`. 현재 달을 보는 중에도 '오늘로'가 똑같이 클릭 가능한 외형(눌러도 변화 없음).
   - 개선: calendarMonth가 현재 달과 같으면 버튼 `disabled` + `.calendar-today-btn:disabled{opacity:0.4;cursor:default}`. 다른 달로 네비게이트하면 다시 활성. 무의미 클릭 방지 + 현재 위치 단서.

4. **빈 주(week)가 데스크톱에서 화면 한 칸 가까이 세로 점유** — 우선순위: 낮음
   - 어디서: `.calendar-grid .day{min-height:84px}` × 6주. 5월처럼 출시가 3일뿐인 달은 위 4주(1~26일)가 전부 빈 칸 84px씩 -> 첫 화면이 빈 격자로 길어짐.
   - 왜: '가까운 출시 달 자동 진입'으로 완화됐지만 그 달 안에서도 선행/후행 빈 주가 높이를 그대로 차지해 콘텐츠가 아래로 밀림(헤더 컴팩트 작업과 함께 첫 화면 밀도에 영향).
   - 개선(택1): (a) 데스크톱 `.day` min-height 84->68px(라벨 있는 셀은 내용으로 자연 확장 유지), 또는 (b) 게임 0건 선행/후행 '주' 행만 축약. (a)가 단순·안전. 헤더 컴팩트화와 묶으면 첫 화면에 캘린더 대부분이 들어옴.

### 현재 양호 (트집 X)
다크 테마/카테고리 색 체계 일관, 컴팩트 날짜 행·인라인 확장, 통계=드롭다운 일치, 임박 셀 강조, 모달 페이드, 리스트 풀폭 행·푸터 운영자 정보 모두 양호.

---

## [2026-05-29 23:04] [디자이너] — 라이브 실측: 리스트 카드 칩/메타 일관성 + 컨트롤 디테일
실측: https://gcalen.com/ Chrome 데스크톱(1516px) — 캘린더/리스트/날짜 클릭 패널 정상 렌더, 콘솔 에러 0건. 날짜 셀 클릭 패널 '한 줄 컴팩트 행·인라인 확장'·기본 캘린더 뷰·헤더 좌측정렬 컴팩트 모두 라이브 반영 확인. 모바일 뷰포트는 이번에도 resize가 렌더에 미반영 → styles.css 기준 병행. 직전 사이클 이후 '리스트 카드 시각 일관성·메타 표현·컨트롤 디테일' 관점에서 신규 관찰 항목만 등록(기존 노트/IDEAS 항목 중복 안 함).

### 발견한 문제 / 개선점 (신규)
1. **리스트 카드 안에 칩/태그 스타일이 3종 혼재 + 비클릭 장르 태그가 '링크 블루'라 클릭 가능처럼 보임** — 우선순위: 보통
   - 어디서: 리스트 뷰 카드. 한 카드 안에 (a) 카테고리 칩 "한국 MMO 신규 서버" = 솔리드 컬러 배경 pill, (b) 플랫폼 칩 "PC" = 회색 pill, (c) 장르 태그 "ARPG·핵앤슬래시·새 시즌" = 파란(accent) 텍스트 칩 — 세 가지 칩 디자인이 동시에 등장. 게다가 장르 태그의 파란색이 링크/날짜에 쓰는 accent 블루와 동일.
   - 왜 문제: (1) 칩 언어가 통일 안 돼 시각적으로 산만. (2) 파란 장르 태그가 클릭 가능한 링크(예: 장르 필터)처럼 보이지만 실제로는 비클릭 → 어포던스 거짓 신호. accent 블루는 '실제 링크/날짜'에만 쓰는 것이 위계상 맞음. (비고: 날짜 줄의 파란 링크 스타일·날짜 중복 건은 13:02 #3에 이미 등록 → 여기선 '칩 스타일 통일'과 '장르 태그 블루 남용'만 신규로 다룸.)
   - 개선: 비인터랙티브 메타 칩(플랫폼·장르)은 동일한 중립 톤(예: --surface 배경 + --text-dim 텍스트, 얇은 보더)으로 통일, accent 블루는 실제 링크/날짜에만 한정. 카테고리 칩만 카테고리 컬러 유지(정보 색). → 칩 3종을 2종(정보색 카테고리 / 중립 메타)으로 정리.

2. **카드 메타 아이콘(⚔ 시리즈 · 🏛 개발사)이 라벨 없이 아이콘만 → 의미 불명확 + 스크린리더 미스리딩** — 우선순위: 낮음
   - 어디서: 리스트 카드 본문. "⚔ 패스 오브 엑자일 2", "🏛 그라인딩기어게임즈" 처럼 이모지 아이콘 + 텍스트만 있고, 그 아이콘이 무엇(시리즈/개발사/배급사)을 뜻하는지 라벨이 없음.
   - 왜 문제: 사용자는 ⚔가 시리즈인지, 🏛가 개발사인지 배급사인지 추측해야 함. 스크린리더는 이모지를 그대로 읽어(예 "교차된 검") 의미 전달 실패.
   - 개선: 아이콘 옆에 짧은 라벨(예 "시리즈:", "개발사:")을 붙이거나, 최소한 각 줄에 aria-label/title("개발사 그라인딩기어게임즈") 부여. 시각적으로는 라벨을 흐린 톤으로 작게.

3. **"오늘로" 버튼이 현재 달을 보고 있을 때도 항상 활성(클릭해도 변화 없는 noop)** — 우선순위: 낮음
   - 어디서: 캘린더 월 네비게이션의 "오늘로" 버튼. 진입 시 이미 오늘이 포함된 달(현재 5월)을 보여주는데, 그 상태에서 "오늘로"를 눌러도 이미 그 달이라 화면 변화가 없음(개발자 동작 재확인 권장).
   - 왜 문제: 변화 없는 버튼이 평상시와 동일해 보여, 눌렀을 때 '반응 없음'으로 오인. 버튼 상태가 현재 컨텍스트를 반영 안 함.
   - 개선: 현재 보는 달에 오늘이 포함돼 있으면 "오늘로"를 disabled(흐림 + cursor:default + aria-disabled)로, 다른 달로 이동했을 때만 활성. 작은 JS(월 렌더 시 today 포함 여부로 disabled 토글).

4. **검색 placeholder "( / 키)" 단축키 힌트가 모바일에선 무의미 + placeholder 길어짐** — 우선순위: 낮음
   - 어디서: 검색 input placeholder "게임명 검색 ( / 키)". / 키로 검색창 포커스(데스크톱 단축키)는 좋은 기능이나, 터치 기기엔 물리 키보드 단축키가 없어 의미 없고 placeholder만 길어짐.
   - 개선: placeholder는 "게임명 검색"으로 단순화, / 단축키 안내는 데스크톱에서만 작게 보조 표기(또는 input title/툴팁). 단축키 기능 자체는 유지.

### 현재 양호 (트집 X)
캘린더 기본 뷰·헤더 좌측정렬 컴팩트·날짜 패널 컴팩트 인라인 행·통계줄 29=드롭다운 29·카테고리 색 체계·모달 페이드·푸터 운영자정보·로딩 fallback 가드 모두 정상. 기존 '높음' 미반영 건(헤더 로고화·날짜셀 auto-scroll·키보드 접근·sticky 그룹헤더·선택셀 위계·날짜미정 D-day·통계줄 클릭필터 등)은 TODO/IDEAS 큐에 이미 있어 중복 등록 안 함 — 픽업 대기.

---

## [2026-05-29 13:02] [디자이너] — 라이브 실측: 복구 후 정상 확인 + 리스트/패널 스캔 폴리시
실측: https://gcalen.com/ Chrome 데스크톱(1516px) — 캘린더/리스트/날짜클릭 패널/검색/상세 모달 전부 정상 렌더, 콘솔 에러 0건. 개발자 12:30 헤더 좌측정렬·컴팩트화 라이브 반영 확인(캘린더 상향). 검색 → "2건 일치" 피드백·드롭다운 "전체(2)" 동기 정상. 모바일 뷰포트는 이번에도 resize가 렌더에 미반영 → styles.css 병행. 아래는 기존 노트/IDEAS에 없던 신규 관찰 항목만 등록(이미 등록된 auto-scroll·모바일라벨·날짜미정 D-day·통계줄클릭·헤더로고화·기본뷰캘린더·선택셀위계 등은 중복 안 함).

### 발견한 문제 / 개선점 (신규)
1. **긴 리스트/날짜 패널 스크롤 시 날짜 그룹 헤더가 사라져 "지금 보는 날짜" 맥락 상실** — 우선순위: 보통
   - 어디서: 리스트 뷰 + 날짜 클릭 패널. 29건(패널은 "이후 출시 25건")을 스크롤하면 `2026.06.18 (목)` 같은 날짜 그룹 헤더(`.date-group-header`)가 위로 떠내려가 사라짐. 화면 중간에서는 현재 행들이 어느 날짜 소속인지 알 수 없음(게임마다 D-day 배지는 있으나 절대 날짜는 재구성 필요).
   - 왜 문제: 날짜 기반 캘린더인데 정작 긴 목록을 훑을 때 날짜 컨텍스트가 끊겨 스캔성이 떨어짐.
   - 개선: `.date-group-header`에 `position:sticky; top:0`(+ 불투명 배경 `--bg`·약간의 z-index)를 주어 해당 그룹을 훑는 동안 날짜가 상단에 고정되게. 리스트 뷰·날짜 패널 공통 적용(모바일에서 특히 효과 큼).

2. **D-day 배지 색이 임박(D-2)·원거리(D-217) 구분 없이 동일 → 긴급도 시각 신호 없음** — 우선순위: 낮음
   - 어디서: 날짜 패널 + 리스트 행 우측 D-day 배지. D-2, D-6, D-21, D-171, D-217이 전부 같은 amber/주황 톤 → "임박 게임"과 "먼 게임"이 시각적으로 구분 안 됨.
   - 왜 문제: 캘린더의 핵심 가치는 "곧 나올 게임"인데 리스트에서 그게 눈에 안 띔. 캘린더 셀은 .day-soon(7일 내) 강조가 있지만 리스트/패널 배지에는 그 구분이 없음.
   - 개선: D-day 근접도로 배지 색 단계화 — 예) ≤7일 amber(기존 임박 톤 재사용), ≤30일 중립 텍스트, >30일 흐린 톤(--text-dim). 색만이 아니라 ≤7일은 굵게 등 보조 단서 함께.

3. **리스트 뷰 카드 내부의 출시일이 날짜그룹 헤더와 중복 표시 + 링크처럼 보이는 파란 스타일(클릭 어포던스 혼동)** — 우선순위: 낮음
   - 어디서: 리스트 뷰 카드. 카드 위에 날짜그룹 헤더 `2026.06.03 (수)`가 있는데, 카드 안에 또 `🗓 2026.06.03 (수)`가 파란·링크처럼 반복 표시됨. 그룹 헤더가 이미 날짜를 명시하므로 중복.
   - 왜 문제: (1) 동일 정보 중복으로 시각 노이즈. (2) 카드 전체가 클릭=모달인데 그 안에 파란 "링크처럼" 보이는 날짜가 있어 클릭 대상 어포던스가 혼동.
   - 개선: 카드 내 날짜 줄을 제거하거나, 날짜 대신 "출시 시각/플랫폼 출시 메모" 같은 비중복 정보로 교체(날짜 출처는 그룹 헤더로 일원화). 링크가 아니면 파란 링크 스타일 제거(메타 텍스트 톤으로).

4. **검색어 입력 시 컨트롤 바가 2줄로 reflow되며 퀵칩(이번주/다음주/위시리스트)이 우측 단독 행으로 분리 → 레이아웃 점프/정렬 불균형** — 우선순위: 낮음
   - 어디서: 검색창. 검색어가 비었을 때는 검색+드롭다운+퀵칩이 한 줄(1516px)이다가, 검색어를 치면(✕ 버튼·"N건 일치" 추가) 퀵칩이 두 번째 줄로 내려가 우측 단독 정렬됨. 필터 바가 상태에 따라 정렬/높이가 튀며 화면이 점프.
   - 개선: 컨트롤 컨테이너의 wrap 정책 고정 — 퀵칩이 줄바꿈될 때도 좌측 정렬 유지하거나, 검색 상태와 무관하게 항상 동일 그리드 레이아웃으로 고정해 점프 제거. (개발자: 1516px에서도 reflow되는지 재현 확인 권장.)

### 현재 양호 (트집 X)
헤더 좌측정렬·컴팩트화(개발자 12:30) 라이브 반영 확인. 날짜 패널 한 줄 컴팩트 행·인라인 확장·검색 피드백·통계줄 29=드롭다운 29 일치·모달 페이드·푸터 운영자정보·로딩 fallback 가드 모두 정상. 기존 "높음" 미반영 건(헤더 로고화·기본뷰 캘린더 고정·auto-scroll·날짜미정 D-day·통계줄 클릭필터·선택셀 위계)은 TODO/IDEAS 큐에 이미 있어 중복 등록 안 함 — 픽업 대기.

---

## [2026-05-29 20:50] [디자이너] — 라이브 실측: 캘린더 진입 경험(스크롤/빈달/모바일/키보드)
실측: https://gcalen.com/ Chrome 데스크톱(1516px) — 리스트(기본뷰)·캘린더·날짜 클릭 패널 정상 렌더, 콘솔 에러 0건. QA 22:40 TDZ 복구 + 개발자 fallback 가드 라이브 정상. 모바일 뷰포트는 이번에도 resize가 스크린샷 렌더에 미반영 → styles.css 기준 병행 평가. 직전 사이클(23:02) 이후 캘린더 '진입·클릭 경험' 관점에서 신규로 관찰된 항목만 등록(기존 등록 항목 중복 안 함).

### 발견한 문제 / 개선점 (기존 미등록 신규 항목만)
1. **날짜 셀 클릭 시 결과 패널이 시야 밖에서 열려 '아무 일도 안 일어난 듯' 보임 (auto-scroll 부재)** — 우선순위: 높음
   - 어디서: 캘린더에서 날짜 셀 클릭 → `#day-detail-panel`이 **달력 그리드 전체 아래**에 펼쳐짐(script.js openDayPanel, scrollIntoView 호출 없음 확인). 데스크톱에서 하단 행(예 30일)을 클릭하면 패널이 폴드 아래라 화면이 그대로 → 클릭이 먹혔는지 알 수 없음(실측 시 클릭 후 화면 무변화).
   - 왜 문제: 클릭→결과의 시각적 연결이 끊김. 사용자는 반응이 없다고 느껴 다른 날을 더 누르거나 이탈. 캘린더의 핵심 인터랙션이 '발견되지 않는' 상태.
   - 개선: 패널 렌더 직후 `dayPanel.scrollIntoView({behavior:'smooth', block:'start'})`(prefers-reduced-motion 시 'auto'). 더하여 패널 헤더에 0.3~0.5s 옅은 강조(예 배경 플래시) 1회로 "여기 열렸어요" 신호. 모바일도 동일 이점.

2. **빈 달 진입 시 거대한 수직 공백(첫 화면 대부분 빈 셀) → '데이터 없는 사이트' 인상** — 우선순위: 보통
   - 어디서: 캘린더 자동 진입 달(현재 2026년 5월). 출시는 27·28·30일에만 몰려 있고 1~23일은 전부 빈 셀(약 4행 × min-height 84px ≈ 340px+ 빈 그리드)이라 첫 스크린에 콘텐츠가 거의 안 보임.
   - 왜 문제: '가장 가까운 출시 달'로 자동 진입하지만 그 달이 희소하면 상단이 죽은 공간이 되어 첫인상이 휑함. 사용자가 "이 사이트 비었나?"로 오인.
   - 개선: (a) 월 라벨 옆에 `이 달 출시 N건` 보조 카운트 배지 → 빈 그리드의 이유를 설명하고 ‹ › 탐색 유도. (b) 빈 달이면 기존 `#calendar-empty` 안내를 그리드 상단(달력 안)에도 노출. (c) 더 적극적으로는 자동 진입을 '가장 가까운 출시일'이 아니라 '향후 출시가 가장 많은(또는 첫 출시가 상단행에 걸리는) 달' 기준으로 두는 것도 검토. 최소 (a)만으로도 휑함 완화.

3. **모바일(≤480px) 캘린더 셀 게임명 라벨 과도 truncation** — 우선순위: 보통
   - 어디서: `.day-game-label` 모바일 0.62rem + `white-space:nowrap; text-overflow:ellipsis`. 7열 고정 그리드(390px 폭 기준 셀 ≈ 48px)에서 날짜 숫자 + 게임명 1줄을 한 셀에 넣으면 게임명이 3~4글자 수준으로 잘려 거의 판독 불가(예 "패스 오…"). 점(dots)과도 세로로 겹쳐 답답.
   - 왜 문제: 모바일에서 라벨이 정보 전달을 못 하면서 셀만 빽빽 → 가독성/스캔성 저하. 좁은 화면 핵심 동선.
   - 개선: ≤480px에서는 `.day-game-label`을 숨기고 **카테고리 점(dots)만** 남겨 셀을 깔끔히(상세는 셀 클릭 패널로). 또는 라벨 대신 `●×N` 건수 칩 하나만. 데스크톱(라벨 표시)은 현행 유지.

4. **캘린더 날짜 셀 키보드/스크린리더 접근 불가 (role·tabindex 부재)** — 우선순위: 보통
   - 어디서: 캘린더 셀 마크업(script.js cells = `<div class="day" data-date=...>`). cursor:pointer는 반영됐으나 day-row(role="button" tabindex="0")·위시 버튼과 달리 **셀에는 role/tabindex/aria 없음** → 키보드 Tab 포커스 불가, 엔터로 패널 열기 불가, 스크린리더가 클릭 가능 요소로 인지 못 함.
   - 왜 문제: 마우스 외 사용자는 캘린더의 날짜 패널 기능에 아예 접근 불가(접근성 사각). 직전 hover/cursor 어포던스(반영됨)의 남은 절반.
   - 개선: 게임 있는 셀에 `role="button" tabindex="0" aria-label="5월 30일, 출시 N건"` 부여 + Enter/Space 키 핸들러를 기존 셀 클릭 핸들러에 연결, `:focus-visible` 링 추가. (#1 auto-scroll과 함께 적용하면 키보드 동선까지 자연스러움.)

### 현재 양호 (트집 X)
복구 후 리스트 풀폭 행·카테고리 색 체계·날짜 패널 컴팩트 인라인 확장·상세 모달(페이드/트레일러/링크)·푸터 운영자정보·로딩 fallback 가드 모두 정상. 통계 29 = 드롭다운 29 일치 확인. 기존 '높음' 미반영 건(헤더 로고화·헤더 컴팩트화·기본뷰 캘린더 고정·선택셀 위계 분리·날짜미정 D-day·통계줄 클릭필터)은 TODO/IDEAS 큐에 이미 있어 **중복 등록 안 함** — 픽업 대기.

---

## [2026-05-29 23:02] [디자이너] — 라이브 실측: 사이트 복구 후 정상 점검 (날짜 패널·모달·D-day)
실측: https://gcalen.com/ Chrome 데스크톱(1516px) — 캘린더/리스트/날짜클릭 패널/상세 모달 전부 정상 렌더, 콘솔 에러 0건. QA 22:40 TDZ 복구 라이브 확인됨. 직전 사이클(19:02 다운 상태) 이후 신규로 관찰 가능해진 항목 위주로 점검. (모바일 뷰포트는 이번에도 resize가 렌더에 미반영 → CSS 기준 병행, 신규 모바일 항목은 보류)
복구 후 확인된 신규 반영: 날짜 클릭 패널 '한 줄 컴팩트 행 + 내부 스크롤 제거→인라인 확장'(운영자 요청) 라이브 정상 동작 / 통계줄 29 = 드롭다운 '전체(29)' 숫자 일치(직전 버그 해소) 확인.

### 발견한 문제 / 개선점 (기존 미등록 신규 항목만)
1. **'날짜 미정/유동적' 게임에 정확한 D-day(예 "D-217") 표시 → 가짜 정밀도** — 우선순위: 보통
   - 어디서: 날짜 클릭 패널 + 리스트 뷰 하단. "이클립스: 더 어웨이크닝 (2026 예정·날짜 미정)", "미트5 (2026 연내 목표·일정 유동적)", "나이트크로우2 (2026 연내 목표·날짜 미정)" 등 5건이 전부 **2026.12.31 (목)** 그룹으로 묶여 똑같이 **"D-217"** 배지를 달고 있음.
   - 왜 문제: 게임명에는 "날짜 미정/유동적"이라고 명시돼 있는데 옆 배지는 "D-217"이라는 확정 카운트다운을 보여줌 → 정보 모순. 사용자는 "12월 31일 확정 출시"로 오해하고, 캘린더에서도 12/31 셀에 몰려 표시될 위험.
   - 개선: 데이터에 `date_tbd`(또는 release_date가 미정 플레이스홀더인지) 플래그를 두고, 그런 항목은 D-day 배지 대신 **"미정"/"2026 예정"** 같은 라벨로 대체. 패널/리스트에서도 12/31 그룹이 아니라 맨 끝 **"날짜 미정 · 2026 예정"** 별도 그룹으로 묶기(정렬은 확정일 그룹 다음). 캘린더 셀에는 미배치(또는 월 상단 "이 달 예정(날짜미정) N건" 보조 표기).
   - 효과: 확정일 게임과 미정 게임의 신뢰도 구분 → "12/31 떼출시" 오인 제거.

2. **상세 모달 상단 배너: 카테고리 라벨 중복 + 큰 빈 그라데이션 블록(세로 낭비)** — 우선순위: 낮음
   - 어디서: 게임 카드 클릭 시 상세 모달. 상단에 약 140px 높이의 단색 그라데이션 배너가 있고 그 안에 카테고리명("한국 MMO 신규 서버")이 적혀 있는데, **바로 아래 줄에 동일한 카테고리 태그가 또 표시**됨. 배너는 이미지가 아니라 빈 색 블록이라 정보량 없이 세로만 크게 차지(제목/메타가 한참 아래로 밀림).
   - 비고: 리스트 뷰 카드 배너 중복(204행)은 4px로 이미 정리됨 — 이건 **모달 전용 배너(.modal-image 류)**로 별개 미반영 건.
   - 개선: (a) 배너 높이 140→약 64~80px로 축소하고 안의 카테고리 텍스트는 제거(아래 태그가 이미 전달) → 빈 블록 대신 얇은 카테고리 컬러 바 느낌. 또는 (b) 배너를 없애고 제목 좌측에 카테고리 컬러 점/바만. 첫 화면에 제목·출시일·CTA가 더 빨리 들어오게.

3. **날짜 패널 컴팩트 행: 데스크톱에서 게임명 ↔ 플랫폼/D-day/☆ 사이 빈 공간 과다(스캔 동선 길어짐)** — 우선순위: 낮음
   - 어디서: 날짜 클릭 패널의 한 줄 행. 데스크톱(1516px)에서 게임명은 좌측, 플랫폼·D-day·☆는 우측 끝(`justify-content:space-between` 추정)이라 그 사이에 약 600px 빈 공백. 시선이 이름→D-day로 멀리 이동해야 하고, 어떤 게임의 D-day인지 라인 추적이 필요.
   - 개선: 행 내용 컨테이너에 `max-width`(예 760~880px) + 가운데 정렬을 주거나, 플랫폼·D-day를 게임명 **바로 뒤(좌측 묶음)**로 당기고 ☆만 우측 고정. 모바일은 현행(꽉 참) 유지라 영향 없음.

4. **상단 통계줄(국내모바일 8 · … · 총 29)이 비클릭 텍스트 → 카테고리 진입 기회 손실** — 우선순위: 보통
   - 어디서: 헤더 아래 통계 요약 한 줄. 각 카테고리 건수가 보이지만 클릭 불가라, 사용자는 같은 분류를 보려면 다시 아래 '카테고리' 드롭다운을 찾아 선택해야 함(동작 중복).
   - 개선: 각 세그먼트("국내 모바일 8" 등)를 클릭 가능하게 → 클릭 시 해당 카테고리 필터 적용(드롭다운 값도 동기화), 현재 활성 카테고리는 굵게/밑줄로 표시. 키보드 접근(button 시맨틱 + focus-visible)·`aria-pressed`도 함께. "총 N"은 전체 해제.
   - 효과: 통계줄이 '읽기 전용 숫자'에서 '원클릭 카테고리 탐색'으로 → 정보 구조와 인터랙션 일치.

### 현재 양호 (트집 X)
복구 후 캘린더 셀(오늘 파랑/임박 amber)·리스트 풀폭 행·날짜 패널 컴팩트 인라인 확장·상세 모달(출처/트레일러/링크복사)·푸터 운영자정보·SEO 바로가기 칩 모두 정상. 기존 '높음' 미반영 건(헤더 로고화·헤더 컴팩트화·기본뷰 캘린더 고정·선택셀 위계 분리·에러상태 fallback)은 TODO 큐에 이미 있어 **중복 등록 안 함** — 기획자/개발자 픽업 대기.

---

## [2026-05-29 19:02] [디자이너] — 라이브 실측: 사이트 다운 상태에서 '로딩/에러 상태' UX 점검
실측: https://gcalen.com/ Chrome 데스크톱(1568px) 스크린샷 + 콘솔. 라이브가 현재 **완전 다운**(콘솔 `ReferenceError: Cannot access 'dayPanel' before initialization` script.js:477 → 스크립트 중단). 화면은 헤더·필터·범례만 뜨고 본문은 "불러오는 중..."에서 **영구 고착**, 푸터 "데이터 마지막 갱신: —". (이 회귀 자체는 QA 21:47이 이미 BUGS 1순위로 등재 → 디자이너는 중복 등록 안 함.)
캘린더/리스트/날짜패널 등 렌더 의존 항목은 사이트가 살아나야 평가 가능 → 이번 사이클은 **로딩/에러 상태(앱이 죽어도 보이는 영역)** 만 신규 제안.

### 발견한 문제 / 개선점 (기존 미등록 신규 항목만)
1. **로딩 실패/스크립트 크래시 시 '에러 상태' 부재 → 무한 "불러오는 중..."** — 우선순위: 높음
   - 어디서: 본문 로딩 플레이스홀더. 지금처럼 script.js가 죽거나 games.json fetch가 실패하면 "불러오는 중..." 텍스트가 **영원히** 남고, 사용자는 사이트가 멈췄는지/로딩 중인지 알 수 없음(오늘 라이브가 정확히 이 상태).
   - 왜: 로딩 상태에 종료 조건(성공/실패)이 없어 실패가 로딩처럼 보임. 사용자는 새로고침해야 한다는 단서조차 못 받음.
   - 개선: (a) `window.onerror`/`unhandledrejection` 전역 핸들러 + games.json fetch `.catch`에서 로딩 영역을 **에러 상태**로 교체 — 예 "데이터를 불러오지 못했어요. 잠시 후 새로고침 해주세요." + [새로고침] 버튼(`location.reload()`). (b) 전역 핸들러는 메인 스크립트와 **별도의 작은 inline \<script\>** 로 둬서 메인이 TDZ로 죽어도 에러 UI는 살아있게(중요 — 오늘처럼 같은 파일이 죽으면 내부 catch는 실행 안 됨).
   - 효과: 장애 시에도 '고장난 빈 화면'이 아니라 회복 경로(새로고침)를 제시 → 첫인상/신뢰도 보호.

2. **로딩 타임아웃 가드 부재** — 우선순위: 보통
   - 어디서: 동일 로딩 플레이스홀더.
   - 왜: #1과 별개로, 네트워크가 느리거나 응답이 끝내 안 와도 무한 로딩. 명시적 타임아웃이 없음.
   - 개선: 로딩 시작 시 `setTimeout`(예 8~10초) 걸어 그때까지 렌더 완료 안 되면 #1의 에러 상태로 전환. 정상 렌더되면 타이머 clear.

3. **로딩 인디케이터가 정적 텍스트뿐(움직임 없음)** — 우선순위: 낮음
   - 어디서: "불러오는 중..." 텍스트. 스피너/스켈레톤 없이 정적이라, 멈춘 화면인지 로딩 중인지 시각적으로 구분이 약함(오늘 다운 상태에서도 '로딩처럼' 보임).
   - 개선: 경량 CSS 스피너(회전 원) 또는 캘린더 그리드 스켈레톤(회색 셀 펄스) 추가. 움직이는 인디케이터는 '진행 중'을, 멈추면(에러 전환) '문제 발생'을 직관적으로 전달. #1·#2 적용 시 함께.

### 평가 불가 / 라이브 미반영 (기존 등록 — 중복 안 함)
사이트 다운으로 캘린더 셀/리스트/날짜패널 렌더 항목은 이번 사이클 실측 불가. 기존 '높음' 운영자 요청(헤더 텍스트제목→로고화·홈리셋, 날짜패널 컴팩트 행·내부스크롤 제거)과 캘린더 첫인상(가까운 출시 달 자동 진입은 직전 반영 확인됨) 등은 기존 노트 유지. **최우선은 QA 등재 회귀(script.js TDZ) 복구** — 그 전엔 모든 렌더 항목 검증 불가.

---

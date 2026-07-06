'use client';
import { AdFit } from './AdFit';

// 양옆 여백(gutter) 고정 광고. 넓은 화면(≥1650px)에서만 노출 — globals.css .side-rail 참고.
// 카카오 애드핏 160x600 유닛 ID를 넣으면 실제 광고 표시. 비어있으면 자리 표시용 박스.
// 애드핏 160x600 유닛 (좌/우 각각). AdFit은 한 페이지에 같은 유닛을 1번만 채우므로 좌우 분리 필수.
const UNIT_LEFT = 'DAN-wydIrmDap9p6SfsL';
const UNIT_RIGHT = 'DAN-f105yFOUDHPM2pdq';
// 로컬(개발)에선 애드핏이 도메인 잠금으로 안 뜨므로 위치 확인용 placeholder 표시.
const IS_DEV = process.env.NODE_ENV === 'development';

function Rail({ unit }: { unit: string }) {
  if (IS_DEV) return <div className="side-rail-ph">광고 영역<br />160×600</div>;
  if (!unit) return null;
  return <AdFit unit={unit} width={160} height={600} />;
}

export function SideRailAds() {
  return (
    <>
      {(IS_DEV || UNIT_LEFT) && <aside className="side-rail side-rail-left" aria-hidden="true"><Rail unit={UNIT_LEFT} /></aside>}
      {(IS_DEV || UNIT_RIGHT) && <aside className="side-rail side-rail-right" aria-hidden="true"><Rail unit={UNIT_RIGHT} /></aside>}
    </>
  );
}

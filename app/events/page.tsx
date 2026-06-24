import type { Metadata } from 'next';
import { getUpcomingEvents, EVENT_TYPE_META, type EventType, type GameEvent } from '@/lib/events';
import { PageShell } from '@/components/PageShell';
import { FreeGames } from '@/components/FreeGames';

export const metadata: Metadata = {
  title: '게임 이벤트 캘린더 | 게임쇼·무료 배포·할인·새 시즌 일정',
  description: '에픽게임즈 무료 배포, 스팀 할인, 게임스컴·도쿄게임쇼·지스타·더 게임 어워드 등 게임쇼와 시즌제 게임 새 시즌까지. 게이머가 챙겨야 할 게임 이벤트 일정을 한곳에.',
  keywords: ['게임 이벤트', '에픽 무료게임', '스팀 할인', '게임스컴', '지스타', '도쿄게임쇼', '더 게임 어워드', '게임쇼 일정'],
  alternates: { canonical: 'https://gcalen.com/events' },
  openGraph: { url: 'https://gcalen.com/events', type: 'website', title: '게임 이벤트 캘린더' },
};

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
function fmtRange(e: GameEvent): string {
  if (e.start_date === e.end_date) return fmtDate(e.start_date) + (e.date_approx ? ' (예정)' : '');
  const [, m1, d1] = e.start_date.split('-').map(Number);
  const [, m2, d2] = e.end_date.split('-').map(Number);
  const sameMonth = m1 === m2;
  const tail = sameMonth ? `${d2}일` : `${m2}월 ${d2}일`;
  return `${fmtDate(e.start_date)} ~ ${tail}` + (e.date_approx ? ' (예정)' : '');
}

const ORDER: EventType[] = ['game_show', 'sale', 'season'];

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  const byType = (t: EventType) => events.filter(e => e.type === t);

  return (
    <PageShell>
      <section className="events-page">
        <h1>게임 이벤트 캘린더</h1>
        <p className="events-intro">
          게임 출시 말고도 게이머가 챙겨야 할 일정은 많습니다. <strong>에픽게임즈 무료 배포</strong>,
          {' '}<strong>스팀 할인</strong>, 게임스컴·지스타 같은 <strong>게임쇼</strong>, 시즌제 게임의{' '}
          <strong>새 시즌 오픈</strong>까지 — 놓치기 쉬운 게임 이벤트를 한곳에 모았습니다.
        </p>

        <FreeGames />

        {ORDER.map(type => {
          const list = byType(type);
          if (list.length === 0) return null;
          return (
            <section key={type} className="events-group">
              <h2>
                <span className="events-dot" style={{ background: EVENT_TYPE_META[type].color }} />
                {EVENT_TYPE_META[type].label}
              </h2>
              <ul className="events-list">
                {list.map(e => (
                  <li key={e.id} className="events-item">
                    <div className="events-item-head">
                      <span className="events-name">{e.title}</span>
                      {e.host && <span className="events-host">{e.host}</span>}
                    </div>
                    <div className="events-date">{fmtRange(e)}</div>
                    {e.description && <p className="events-desc">{e.description}</p>}
                    {e.source_url && (
                      <a className="events-src" href={e.source_url} target="_blank" rel="noopener">공식 사이트 →</a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className="events-foot">
          더 많은 신작 출시 일정은 <a href="/upcoming-games">출시 예정</a> 페이지에서, 게임 용어와 자주 묻는
          질문은 <a href="/guide">이용 가이드</a>에서 확인하세요. 이벤트 일정은 매일 업데이트됩니다.
        </p>
      </section>
    </PageShell>
  );
}

'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import styles from './AdminDashboard.module.css';

// 비밀번호(선택). 설정 안 하면 게이트 없이 열림(데이터는 어차피 공개 anon 키로 조회 가능).
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS;

interface Row { created_at: string; game_id: string; }

// UTC ISO → KST 날짜(YYYY-MM-DD)
function kstDay(iso: string): string {
  return new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function AdminDashboard({ nameMap }: { nameMap: Record<string, string> }) {
  const [unlocked, setUnlocked] = useState<boolean>(!ADMIN_PASS);
  const [pw, setPw] = useState('');
  const [gateErr, setGateErr] = useState('');
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (unlocked) return;
    try { if (sessionStorage.getItem('gcalen.admin') === '1') setUnlocked(true); } catch { /* ignore */ }
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    if (!isSupabaseReady() || !supabase) { setErr('Supabase 미설정'); return; }
    (async () => {
      const { data, error } = await supabase!
        .from('page_views')
        .select('created_at,game_id')
        .order('created_at', { ascending: false })
        .limit(10000);
      if (error) { setErr(error.message); return; }
      setRows((data as Row[]) ?? []);
    })();
  }, [unlocked]);

  const stats = useMemo(() => {
    if (!rows) return null;
    const today = kstDay(new Date().toISOString());
    const byDay = new Map<string, number>();
    const byGame = new Map<string, number>();
    for (const r of rows) {
      const d = kstDay(r.created_at);
      byDay.set(d, (byDay.get(d) ?? 0) + 1);
      byGame.set(r.game_id, (byGame.get(r.game_id) ?? 0) + 1);
    }
    const days: { date: string; count: number }[] = [];
    const base = new Date(Date.now() + 9 * 3600 * 1000);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(base); d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: byDay.get(key) ?? 0 });
    }
    const yesterday = days[days.length - 2]?.count ?? 0;
    const last7 = days.slice(-7).reduce((s, d) => s + d.count, 0);
    const entries = [...byGame.entries()].sort((a, b) => b[1] - a[1]);
    const topGames = entries.filter(([id]) => !id.startsWith('blog:')).slice(0, 25);
    const topGuides = entries.filter(([id]) => id.startsWith('blog:')).slice(0, 15);
    const guideTotal = entries.filter(([id]) => id.startsWith('blog:')).reduce((s, [, n]) => s + n, 0);
    return { total: rows.length, today: byDay.get(today) ?? 0, yesterday, last7, days, topGames, topGuides, guideTotal };
  }, [rows]);

  if (!unlocked) {
    return (
      <div className={styles.gate}>
        <h1>관리자</h1>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') tryUnlock(); }}
          placeholder="관리자 키"
          className={styles.gateInput}
        />
        <button type="button" className={styles.gateBtn} onClick={tryUnlock}>확인</button>
        {gateErr && <p className={styles.err}>{gateErr}</p>}
      </div>
    );
  }

  function tryUnlock() {
    if (pw === ADMIN_PASS) {
      try { sessionStorage.setItem('gcalen.admin', '1'); } catch { /* ignore */ }
      setUnlocked(true);
    } else {
      setGateErr('키가 틀렸어요');
    }
  }

  if (err) return <div className={styles.wrap}><p className={styles.err}>불러오기 실패: {err}</p></div>;
  if (!stats) return <div className={styles.wrap}><p className={styles.muted}>불러오는 중…</p></div>;

  const maxDay = Math.max(1, ...stats.days.map(d => d.count));

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>조회수 대시보드</h1>

      <div className={styles.cards}>
        <div className={styles.card}><span className={styles.cardLabel}>오늘</span><span className={styles.cardNum}>{stats.today.toLocaleString()}</span></div>
        <div className={styles.card}><span className={styles.cardLabel}>어제</span><span className={styles.cardNum}>{stats.yesterday.toLocaleString()}</span></div>
        <div className={styles.card}><span className={styles.cardLabel}>최근 7일</span><span className={styles.cardNum}>{stats.last7.toLocaleString()}</span></div>
        <div className={styles.card}><span className={styles.cardLabel}>누적</span><span className={styles.cardNum}>{stats.total.toLocaleString()}</span></div>
      </div>

      <h2 className={styles.h2}>최근 30일 일별 조회수</h2>
      <div className={styles.chart}>
        {stats.days.map(d => (
          <div key={d.date} className={styles.barWrap} title={`${d.date}: ${d.count}`}>
            <div className={styles.barCount}>{d.count || ''}</div>
            <div className={styles.bar} style={{ height: `${(d.count / maxDay) * 100}%` }} />
            <div className={styles.barDate}>{d.date.slice(5)}</div>
          </div>
        ))}
      </div>

      <h2 className={styles.h2}>인기 게임 (누적 조회 TOP 25)</h2>
      <ol className={styles.topList}>
        {stats.topGames.map(([id, n], i) => (
          <li key={id} className={styles.topRow}>
            <span className={styles.rank}>{i + 1}</span>
            <a className={styles.topName} href={`/game/${id}`} target="_blank" rel="noopener">{nameMap[id] ?? id}</a>
            <span className={styles.topNum}>{n.toLocaleString()}</span>
          </li>
        ))}
      </ol>

      <h2 className={styles.h2}>인기 신작 가이드 (누적 {stats.guideTotal.toLocaleString()}회)</h2>
      {stats.topGuides.length === 0 ? (
        <p className={styles.muted}>아직 가이드 조회 기록이 없어요.</p>
      ) : (
        <ol className={styles.topList}>
          {stats.topGuides.map(([id, n], i) => {
            const slug = id.slice(5); // 'blog:' 제거
            return (
              <li key={id} className={styles.topRow}>
                <span className={styles.rank}>{i + 1}</span>
                <a className={styles.topName} href={`/blog/${slug}`} target="_blank" rel="noopener">{nameMap[id] ?? slug}</a>
                <span className={styles.topNum}>{n.toLocaleString()}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

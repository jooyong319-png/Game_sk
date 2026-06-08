'use client';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import styles from './ViewCounter.module.css';

interface Props { gameId: string; }

export function ViewCounter({ gameId }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isSupabaseReady() || !supabase) return;
    let cancelled = false;

    async function track() {
      try {
        // 1) 이번 방문을 1행으로 기록
        await supabase!.from('page_views').insert({ game_id: gameId, count: 1 });

        // 2) 이 게임의 누적 조회수 = 행 개수
        const { count: total, error: selErr } = await supabase!
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .eq('game_id', gameId);

        if (cancelled) return;
        if (selErr) { setError(true); return; }
        setCount(total ?? 0);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    track();
    return () => { cancelled = true; };
  }, [gameId]);

  // 미설정 / 에러 시 조용히 안 보임
  if (!isSupabaseReady() || error || count === null) return null;

  return (
    <div className={styles.counter} aria-label="조회수">
      <span className={styles.icon}>👁</span>
      <span className={styles.num}>{count.toLocaleString()}</span>
      <span className={styles.label}>회 조회</span>
    </div>
  );
}

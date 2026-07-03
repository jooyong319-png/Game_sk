'use client';
import { useEffect, useState, FormEvent } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import styles from './Board.module.css';

interface Post {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  report_count: number;
}

const PAGE = 20;

export function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 목록 불러오기 (RLS가 숨김 글은 자동 제외)
  async function loadPage(from: number, replace: boolean) {
    if (!supabase) return;
    const { data, error: e } = await supabase
      .from('posts')
      .select('id,nickname,content,created_at,report_count')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1);
    if (e) { setError('글을 불러올 수 없어요.'); return; }
    const rows = (data as Post[]) ?? [];
    setHasMore(rows.length === PAGE);
    setPosts(prev => (replace ? rows : [...prev, ...rows]));
  }

  useEffect(() => {
    if (!isSupabaseReady()) { setLoading(false); return; }
    loadPage(0, true).finally(() => setLoading(false));
    try { const s = localStorage.getItem('gcalen.nickname'); if (s) setNickname(s); } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    await loadPage(posts.length, false);
    setLoadingMore(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick || !text) { setError('닉네임과 내용을 입력해주세요.'); return; }
    if (!/^\d{4}$/.test(password)) { setError('비밀번호는 숫자 4자리로 입력해주세요.'); return; }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nick, password, content: text }),
      });
      const out = await res.json();
      if (!res.ok) { setError(out.error ?? '등록에 실패했어요.'); return; }
      setPosts(prev => [out.post as Post, ...prev]);
      setContent('');
      setPassword('');
      try { localStorage.setItem('gcalen.nickname', nick); } catch { /* ignore */ }
    } catch {
      setError('네트워크 오류예요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    const pw = window.prompt('글 작성 시 정한 비밀번호(숫자 4자리)를 입력하세요.');
    if (pw == null) return;
    if (!/^\d{4}$/.test(pw)) { window.alert('비밀번호는 숫자 4자리예요.'); return; }
    try {
      const res = await fetch('/api/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: pw }),
      });
      const out = await res.json();
      if (!res.ok) { window.alert(out.error ?? '삭제에 실패했어요.'); return; }
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch {
      window.alert('네트워크 오류예요.');
    }
  }

  async function onReport(id: number) {
    const key = 'gcalen.reported';
    let reported: number[] = [];
    try { reported = JSON.parse(localStorage.getItem(key) || '[]'); } catch { /* ignore */ }
    if (reported.includes(id)) { window.alert('이미 신고한 글이에요.'); return; }
    if (!window.confirm('이 글을 신고할까요? 여러 명이 신고하면 자동으로 숨겨집니다.')) return;
    if (!supabase) return;
    await supabase.rpc('report_post', { p_id: id });
    try { localStorage.setItem(key, JSON.stringify([...reported, id])); } catch { /* ignore */ }
    window.alert('신고가 접수됐어요. 검토 후 조치할게요.');
  }

  if (!isSupabaseReady()) {
    return <p className={styles.offline}>게시판을 준비 중이에요. 잠시 후 다시 방문해주세요.</p>;
  }

  return (
    <div className={styles.board}>
      {/* 글쓰기 */}
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formTop}>
          <input
            type="text"
            className={styles.nick}
            placeholder="닉네임"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            disabled={submitting}
          />
          <input
            type="password"
            className={styles.pw}
            placeholder="비번(숫자4)"
            value={password}
            onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            maxLength={4}
            disabled={submitting}
            aria-label="비밀번호 숫자 4자리"
          />
        </div>
        <textarea
          className={styles.content}
          placeholder="자유롭게 이야기를 남겨보세요. (링크·광고는 자동 차단, 최대 1000자)"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={1000}
          rows={3}
          disabled={submitting}
        />
        <div className={styles.formRow}>
          {error && <span className={styles.error}>{error}</span>}
          <span className={styles.counter}>{content.length}/1000</span>
          <button
            type="submit"
            className={styles.submit}
            disabled={submitting || !nickname.trim() || !content.trim() || password.length !== 4}
          >
            {submitting ? '등록 중…' : '글 남기기'}
          </button>
        </div>
      </form>

      {/* 목록 */}
      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.skeleton} />)
        ) : posts.length === 0 ? (
          <p className={styles.empty}>아직 글이 없어요. 첫 글을 남겨보세요!</p>
        ) : (
          posts.map(p => (
            <article key={p.id} className={styles.item}>
              <header className={styles.itemHead}>
                <span className={styles.itemNick}>{p.nickname}</span>
                <time className={styles.itemDate}>{formatRelative(p.created_at)}</time>
              </header>
              <p className={styles.itemContent}>{p.content}</p>
              <div className={styles.itemActions}>
                <button type="button" className={styles.act} onClick={() => onReport(p.id)}>신고</button>
                <button type="button" className={styles.act} onClick={() => onDelete(p.id)}>삭제</button>
              </div>
            </article>
          ))
        )}
      </div>

      {hasMore && !loading && (
        <button type="button" className={styles.more} onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? '불러오는 중…' : '더 보기'}
        </button>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const now = new Date();
  const t = new Date(iso);
  const diff = Math.floor((now.getTime() - t.getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`;
}

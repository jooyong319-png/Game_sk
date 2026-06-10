'use client';
import { useEffect, useState, FormEvent } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import styles from './Comments.module.css';

interface Comment {
  id: number;
  game_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

interface Props { gameId: string; }

export function Comments({ gameId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 댓글 불러오기
  async function loadComments() {
    if (!isSupabaseReady() || !supabase) { setLoading(false); return; }
    try {
      const { data, error: e } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (e) throw e;
      setComments(data || []);
    } catch {
      setError('댓글을 불러올 수 없어요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadComments(); /* eslint-disable-next-line */ }, [gameId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick || !text) { setError('닉네임과 내용을 모두 입력해주세요.'); return; }
    if (nick.length > 20) { setError('닉네임은 20자 이하로.'); return; }
    if (text.length > 500) { setError('500자 이하로 작성해주세요.'); return; }

    setSubmitting(true);
    setError(null);
    try {
      const { error: insErr } = await supabase
        .from('comments')
        .insert({ game_id: gameId, nickname: nick, content: text });
      if (insErr) throw insErr;
      setContent('');
      // 닉네임은 다음에도 쓸 수 있게 localStorage에 저장
      try { localStorage.setItem('gcalen.nickname', nick); } catch { /* ignore */ }
      await loadComments();
    } catch {
      setError('댓글 등록에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  // 마지막 사용한 닉네임 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gcalen.nickname');
      if (saved) setNickname(saved);
    } catch { /* ignore */ }
  }, []);

  if (!isSupabaseReady()) return null;

  return (
    <section className={styles.section} aria-label="한줄평">
      <header className={styles.header}>
        <h3 className={styles.title}>💬 한줄평</h3>
        {comments.length > 0 && <span className={styles.count}>{comments.length}개</span>}
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        <input
          type="text"
          className={styles.nicknameInput}
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
          disabled={submitting}
        />
        <textarea
          className={styles.contentInput}
          placeholder="이 게임에 대한 한줄평 (최대 500자)"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={500}
          rows={2}
          disabled={submitting}
        />
        <div className={styles.formRow}>
          {error && <span className={styles.error}>{error}</span>}
          <button type="submit" className={styles.submitBtn} disabled={submitting || !nickname.trim() || !content.trim()}>
            {submitting ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.empty}>불러오는 중…</p>
        ) : comments.length === 0 ? (
          <p className={styles.empty}>첫 한줄평을 남겨보세요.</p>
        ) : comments.map(c => (
          <article key={c.id} className={styles.item}>
            <header className={styles.itemHeader}>
              <span className={styles.nickname}>{c.nickname}</span>
              <time className={styles.date}>{formatRelative(c.created_at)}</time>
            </header>
            <p className={styles.content}>{c.content}</p>
          </article>
        ))}
      </div>
    </section>
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

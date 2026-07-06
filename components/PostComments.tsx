'use client';
import { useEffect, useState, FormEvent } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { formatRelative } from '@/lib/boardFormat';
import styles from './Board.module.css';

interface Comment {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  ip_prefix: string | null;
}

export function PostComments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from('post_comments')
      .select('id,nickname,content,created_at,ip_prefix')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments((data as Comment[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!isSupabaseReady()) { setLoading(false); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick || !text) { setError('닉네임과 댓글을 입력해주세요.'); return; }
    if (!/^\d{4}$/.test(password)) { setError('비밀번호는 숫자 4자리로 입력해주세요.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/board/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, nickname: nick, password, content: text }),
      });
      const out = await res.json();
      if (!res.ok) { setError(out.error ?? '등록에 실패했어요.'); return; }
      setComments(prev => [...prev, out.comment as Comment]);
      setContent('');
      setPassword('');
    } catch {
      setError('네트워크 오류예요.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    const pw = window.prompt('댓글 비밀번호(숫자 4자리)를 입력하세요.');
    if (pw == null) return;
    if (!/^\d{4}$/.test(pw)) { window.alert('비밀번호는 숫자 4자리예요.'); return; }
    try {
      const res = await fetch('/api/board/comment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: pw }),
      });
      const out = await res.json();
      if (!res.ok) { window.alert(out.error ?? '삭제에 실패했어요.'); return; }
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {
      window.alert('네트워크 오류예요.');
    }
  }

  if (!isSupabaseReady()) return null;

  return (
    <section className={styles.comments} aria-label="댓글">
      <h2 className={styles.commentsTitle}>댓글 {comments.length > 0 && <span>{comments.length}</span>}</h2>

      <ul className={styles.commentList}>
        {loading ? (
          <li className={styles.commentEmpty}>불러오는 중…</li>
        ) : comments.length === 0 ? (
          <li className={styles.commentEmpty}>첫 댓글을 남겨보세요.</li>
        ) : comments.map(c => (
          <li key={c.id} className={styles.comment}>
            <div className={styles.commentHead}>
              <span className={styles.commentNick}>{c.nickname}</span>
              {c.ip_prefix && <span className={styles.cardIp}>({c.ip_prefix})</span>}
              <time className={styles.commentDate}>{formatRelative(c.created_at)}</time>
              <button type="button" className={styles.commentDel} onClick={() => onDelete(c.id)} aria-label="댓글 삭제">삭제</button>
            </div>
            <p className={styles.commentBody}>{c.content}</p>
          </li>
        ))}
      </ul>

      <form className={styles.commentForm} onSubmit={onSubmit}>
        <div className={styles.commentFormTop}>
          <input type="text" className={styles.nick} placeholder="닉네임" autoComplete="off" value={nickname}
            onChange={e => setNickname(e.target.value)} maxLength={20} disabled={submitting} />
          <input type="password" className={styles.pw} placeholder="비번(숫자4)" inputMode="numeric" maxLength={4}
            autoComplete="new-password"
            value={password} onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
            disabled={submitting} aria-label="비밀번호 숫자 4자리" />
        </div>
        <div className={styles.commentFormBottom}>
          <input type="text" className={styles.commentInput} placeholder="댓글 달기… (최대 500자)" autoComplete="off" value={content}
            onChange={e => setContent(e.target.value)} maxLength={500} disabled={submitting} />
          <button type="submit" className={styles.submit}
            disabled={submitting || !nickname.trim() || !content.trim() || password.length !== 4}>
            {submitting ? '…' : '등록'}
          </button>
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </form>
    </section>
  );
}

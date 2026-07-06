'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './Board.module.css';

// 상세페이지 좋아요/신고/삭제 + 진입 시 조회수 +1.
export function PostActions({ postId, likes: initialLikes }: { postId: number; likes: number }) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  // 조회수 +1 (브라우저당 1회) + 좋아요 상태 복원
  useEffect(() => {
    try {
      const viewed: number[] = JSON.parse(localStorage.getItem('gcalen.viewed') || '[]');
      if (!viewed.includes(postId)) {
        supabase?.rpc('bump_views', { p_id: postId });
        localStorage.setItem('gcalen.viewed', JSON.stringify([...new Set([...viewed, postId])]));
      }
      const likedArr: number[] = JSON.parse(localStorage.getItem('gcalen.liked') || '[]');
      setLiked(likedArr.includes(postId));
    } catch { /* ignore */ }
  }, [postId]);

  async function onLike() {
    if (liked || !supabase) return;
    setLiked(true);
    setLikes(n => n + 1);
    try {
      const arr: number[] = JSON.parse(localStorage.getItem('gcalen.liked') || '[]');
      localStorage.setItem('gcalen.liked', JSON.stringify([...new Set([...arr, postId])]));
    } catch { /* ignore */ }
    await supabase.rpc('like_post', { p_id: postId });
  }

  async function onReport() {
    const key = 'gcalen.reported';
    let reported: number[] = [];
    try { reported = JSON.parse(localStorage.getItem(key) || '[]'); } catch { /* ignore */ }
    if (reported.includes(postId)) { window.alert('이미 신고한 글이에요.'); return; }
    if (!window.confirm('이 글을 신고할까요? 여러 명이 신고하면 자동으로 숨겨집니다.')) return;
    if (!supabase) return;
    await supabase.rpc('report_post', { p_id: postId });
    try { localStorage.setItem(key, JSON.stringify([...reported, postId])); } catch { /* ignore */ }
    window.alert('신고가 접수됐어요. 검토 후 조치할게요.');
  }

  async function onDelete() {
    const pw = window.prompt('글 작성 시 정한 비밀번호(숫자 4자리)를 입력하세요.');
    if (pw == null) return;
    if (!/^\d{4}$/.test(pw)) { window.alert('비밀번호는 숫자 4자리예요.'); return; }
    try {
      const res = await fetch('/api/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, password: pw }),
      });
      const out = await res.json();
      if (!res.ok) { window.alert(out.error ?? '삭제에 실패했어요.'); return; }
      router.push('/board');
    } catch {
      window.alert('네트워크 오류예요.');
    }
  }

  return (
    <div className={styles.cardActions}>
      <button type="button" className={`${styles.stat} ${liked ? styles.statOn : ''}`} onClick={onLike}>
        <svg className="ic" aria-hidden="true"><use href="#ic-thumbs-up" /></svg> {likes}
      </button>
      <span className={styles.actSpacer} />
      <button type="button" className={styles.act} onClick={onReport}>신고</button>
      <button type="button" className={styles.act} onClick={onDelete}>삭제</button>
    </div>
  );
}

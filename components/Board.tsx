'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { BOARD_CATEGORIES } from '@/lib/boardFormat';
import { PostCard, type Post } from './PostCard';
import styles from './Board.module.css';

const PAGE = 15;
const MAX_DIM = 1280;
const SELECT = 'id,title,nickname,content,created_at,report_count,image_url,ip_prefix,category';

export function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null); // null = 전체

  const [writeOpen, setWriteOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [composeCat, setComposeCat] = useState<string>('chat');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadPage(from: number, replace: boolean, cat: string | null) {
    if (!supabase) return;
    let q = supabase.from('posts').select(SELECT).order('created_at', { ascending: false });
    if (cat) q = q.eq('category', cat);
    const { data, error: e } = await q.range(from, from + PAGE - 1);
    if (e) { setError('글을 불러올 수 없어요.'); return; }
    const rows = (data as Post[]) ?? [];
    setHasMore(rows.length === PAGE);
    setPosts(prev => (replace ? rows : [...prev, ...rows]));
  }

  useEffect(() => {
    if (!isSupabaseReady()) { setLoading(false); return; }
    loadPage(0, true, null).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 모달 열림 시 Esc 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!writeOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setWriteOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [writeOpen]);

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  function selectCat(cat: string | null) {
    setActiveCat(cat);
    setLoading(true);
    loadPage(0, true, cat).finally(() => setLoading(false));
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setError('JPG·PNG·WEBP 이미지만 올릴 수 있어요.'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('이미지는 10MB 이하만 가능해요.'); return; }
    setError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  // 브라우저에서 리사이즈·압축(webp) → Storage 업로드 → 공개 URL 반환
  async function uploadImage(file: File): Promise<string> {
    if (!supabase) throw new Error('no supabase');
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image();
      el.onload = () => res(el);
      el.onerror = () => rej(new Error('load fail'));
      el.src = URL.createObjectURL(file);
    });
    let { width, height } = img;
    if (width > MAX_DIM || height > MAX_DIM) {
      const r = Math.min(MAX_DIM / width, MAX_DIM / height);
      width = Math.round(width * r); height = Math.round(height * r);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(b => (b ? res(b) : rej(new Error('encode fail'))), 'image/webp', 0.82));
    const path = `${crypto.randomUUID()}.webp`;
    const { error: upErr } = await supabase.storage.from('post-images')
      .upload(path, blob, { contentType: 'image/webp', upsert: false });
    if (upErr) throw upErr;
    return supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl;
  }

  async function loadMore() {
    setLoadingMore(true);
    await loadPage(posts.length, false, activeCat);
    setLoadingMore(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ttl = title.trim();
    const text = content.trim();
    if (!ttl) { setError('제목을 입력해주세요.'); return; }
    if (!/^\d{4}$/.test(password)) { setError('비밀번호는 숫자 4자리로 입력해주세요.'); return; }

    setSubmitting(true);
    setError(null);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        try { image_url = await uploadImage(imageFile); }
        catch { setError('이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.'); setSubmitting(false); return; }
      }
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ttl, password, content: text, image_url, category: composeCat }),
      });
      const out = await res.json();
      if (!res.ok) { setError(out.error ?? '등록에 실패했어요.'); return; }
      const newPost = out.post as Post;
      // 현재 필터에 보일 글이면 피드 맨 위에 추가
      if (!activeCat || activeCat === newPost.category) setPosts(prev => [newPost, ...prev]);
      setTitle('');
      setContent('');
      setPassword('');
      clearImage();
      setWriteOpen(false);
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
    return <p className={styles.offline}>커뮤니티를 준비 중이에요. 잠시 후 다시 방문해주세요.</p>;
  }

  return (
    <div className={styles.board}>
      {/* 카테고리 탭 + 글쓰기 버튼 */}
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="카테고리">
          <button type="button" role="tab" aria-selected={activeCat === null}
            className={`${styles.tab} ${activeCat === null ? styles.tabOn : ''}`} onClick={() => selectCat(null)}>전체</button>
          {BOARD_CATEGORIES.map(c => (
            <button key={c.key} type="button" role="tab" aria-selected={activeCat === c.key}
              className={`${styles.tab} ${activeCat === c.key ? styles.tabOn : ''}`} onClick={() => selectCat(c.key)}>{c.label}</button>
          ))}
        </div>
        <button type="button" className={styles.writeBtn} onClick={() => { setError(null); setWriteOpen(true); }}>
          <svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg> 글쓰기
        </button>
      </div>

      {/* 피드 */}
      <div className={styles.feed}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.skeleton} />)
        ) : posts.length === 0 ? (
          <p className={styles.empty}>아직 글이 없어요. 첫 글을 남겨보세요!</p>
        ) : (
          posts.map(p => (
            <PostCard key={p.id} post={p} href={`/board/${p.id}`} onReport={onReport} onDelete={onDelete} />
          ))
        )}
      </div>

      {hasMore && !loading && (
        <button type="button" className={styles.more} onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? '불러오는 중…' : '더 보기'}
        </button>
      )}

      {/* 글쓰기 모달 */}
      {writeOpen && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setWriteOpen(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="글쓰기" onClick={e => e.stopPropagation()}>
            <header className={styles.modalHead}>
              <h2 className={styles.modalTitle}>글쓰기</h2>
              <button type="button" className={styles.modalClose} onClick={() => setWriteOpen(false)} aria-label="닫기">✕</button>
            </header>

            <form className={styles.composer} onSubmit={onSubmit}>
              <div className={styles.catPick} role="radiogroup" aria-label="카테고리 선택">
                {BOARD_CATEGORIES.map(c => (
                  <button key={c.key} type="button" role="radio" aria-checked={composeCat === c.key}
                    className={`${styles.catPill} ${composeCat === c.key ? styles.catPillOn : ''}`}
                    onClick={() => setComposeCat(c.key)}>{c.label}</button>
                ))}
              </div>

              <div className={styles.composerTop}>
                <input type="text" className={styles.nick} placeholder="제목" autoComplete="off"
                  value={title} onChange={e => setTitle(e.target.value)} maxLength={60} disabled={submitting} />
                <input type="password" className={styles.pw} placeholder="비번(숫자4)" inputMode="numeric" maxLength={4}
                  autoComplete="new-password"
                  value={password} onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={submitting} aria-label="비밀번호 숫자 4자리" />
              </div>
              <textarea className={styles.content} autoComplete="off"
                placeholder="지금 무슨 생각을 하고 있나요? (사진도 올릴 수 있어요 · 최대 1000자)"
                value={content} onChange={e => setContent(e.target.value)} maxLength={1000} rows={4} disabled={submitting} />

              {imagePreview && (
                <div className={styles.preview}>
                  <img src={imagePreview} alt="첨부 미리보기" />
                  <button type="button" className={styles.previewRemove} onClick={clearImage} aria-label="사진 제거">✕</button>
                </div>
              )}

              <div className={styles.composerBottom}>
                <label className={styles.attachBtn}>
                  <svg className="ic" aria-hidden="true"><use href="#ic-image" /></svg> 사진
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPickImage} disabled={submitting} />
                </label>
                {error && <span className={styles.error}>{error}</span>}
                <span className={styles.counter}>{content.length}/1000</span>
                <button type="submit" className={styles.submit}
                  disabled={submitting || !title.trim() || password.length !== 4}>
                  {submitting ? '올리는 중…' : '게시'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/PageShell';
import { PostActions } from '@/components/PostActions';
import { PostComments } from '@/components/PostComments';
import { formatRelative, categoryLabel } from '@/lib/boardFormat';
import boardStyles from '@/components/Board.module.css';

export const dynamic = 'force-dynamic'; // 글은 수시로 바뀜 → 요청마다 최신

interface PostRow {
  id: number;
  title: string | null;
  nickname: string;
  content: string | null;
  created_at: string;
  image_url: string | null;
  ip_prefix: string | null;
  category: string | null;
}

async function getPost(id: number): Promise<PostRow | null> {
  if (!supabase || !Number.isFinite(id)) return null;
  const { data } = await supabase
    .from('posts')
    .select('id,title,nickname,content,created_at,image_url,ip_prefix,category')
    .eq('id', id)
    .maybeSingle(); // RLS가 숨김글은 자동 제외 → 없으면 null
  return (data as PostRow) ?? null;
}

function postTitle(p: PostRow): string {
  return p.title?.trim() || p.content?.trim().slice(0, 40) || '커뮤니티 글';
}

// 너무 얇은 글(짧은 텍스트·이미지 없음)은 색인 제외 → 저품질 인덱싱/AdSense 리스크 방지
function isIndexable(p: PostRow): boolean {
  return (p.title?.trim().length ?? 0) + (p.content?.trim().length ?? 0) >= 12 || !!p.image_url;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id);
  const post = await getPost(id);
  if (!post) {
    return { title: '커뮤니티 | Gcalen', robots: { index: false, follow: true } };
  }
  const t = postTitle(post);
  const desc = (post.content?.trim() || t).slice(0, 155);
  const url = `https://gcalen.com/board/${id}`;
  return {
    title: `${t} - 커뮤니티 | Gcalen`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      url, type: 'article', title: t, description: desc,
      images: post.image_url ? [post.image_url] : undefined,
    },
    robots: { index: isIndexable(post), follow: true },
  };
}

export default async function BoardPostPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const post = await getPost(id);

  const jsonLd = post && {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: postTitle(post).slice(0, 110),
    text: post.content || undefined,
    datePublished: post.created_at,
    author: { '@type': 'Person', name: post.nickname || '익명' },
    image: post.image_url || undefined,
    url: `https://gcalen.com/board/${id}`,
    isPartOf: { '@type': 'WebSite', name: 'Gcalen', url: 'https://gcalen.com' },
  };

  return (
    <PageShell>
      <section className="board-page">
        <div className={boardStyles.board}>
          <a href="/board" className={boardStyles.backLink}>‹ 커뮤니티</a>

          {!post ? (
            <p className={boardStyles.empty}>삭제됐거나 존재하지 않는 글이에요.</p>
          ) : (
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
              <article className={boardStyles.card}>
                <header className={boardStyles.cardHead}>
                  <div className={boardStyles.titleLink}>
                    <span className={boardStyles.catBadge}>{categoryLabel(post.category)}</span>
                    <h1 className={boardStyles.postTitle}>{postTitle(post)}</h1>
                  </div>
                  <div className={boardStyles.metaRow}>
                    <span className={boardStyles.metaAuthor}>{post.nickname || '익명'}</span>
                    {post.ip_prefix && <span className={boardStyles.cardIp}>({post.ip_prefix})</span>}
                    <span className={boardStyles.metaDot}>·</span>
                    <time className={boardStyles.cardDate}>{formatRelative(post.created_at)}</time>
                  </div>
                </header>
                {post.image_url && (
                  <div className={boardStyles.media}><img src={post.image_url} alt={postTitle(post)} /></div>
                )}
                {post.title?.trim() && post.content && <p className={boardStyles.cardBody}>{post.content}</p>}
                <PostActions postId={id} />
              </article>

              <PostComments postId={id} />
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

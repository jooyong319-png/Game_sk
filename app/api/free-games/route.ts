// 에픽게임즈 스토어 무료배포(주간) 실시간 수집 — 손 안 대도 자동 갱신.
export const revalidate = 3600;

const EPIC_URL =
  'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=ko&country=KR&allowCountries=KR';

interface FreeGame {
  title: string;
  status: 'current' | 'upcoming';
  start: string | null;
  end: string | null;
  image: string | null;
  url: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function slugOf(e: any): string | null {
  return (
    e?.catalogNs?.mappings?.[0]?.pageSlug ||
    e?.offerMappings?.[0]?.pageSlug ||
    e?.productSlug ||
    e?.urlSlug ||
    null
  );
}

function imageOf(e: any): string | null {
  const imgs: any[] = e?.keyImages ?? [];
  const order = ['OfferImageWide', 'DieselStoreFrontWide', 'Thumbnail', 'OfferImageTall'];
  for (const t of order) {
    const hit = imgs.find(k => k?.type === t);
    if (hit?.url) return hit.url;
  }
  return imgs[0]?.url ?? null;
}

export async function GET() {
  try {
    const res = await fetch(EPIC_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json({ games: [] });
    const json: any = await res.json();
    const els: any[] = json?.data?.Catalog?.searchStore?.elements ?? [];

    const games: FreeGame[] = [];
    for (const e of els) {
      const slug = slugOf(e);
      const base = {
        title: e?.title ?? '',
        image: imageOf(e),
        url: slug ? `https://store.epicgames.com/ko/p/${slug}` : null,
      };
      const collect = (groups: any[], status: 'current' | 'upcoming') => {
        for (const g of groups ?? []) {
          for (const po of g?.promotionalOffers ?? []) {
            const free = po?.discountSetting?.discountPercentage === 0;
            if (!free) continue;
            games.push({ ...base, status, start: po?.startDate ?? null, end: po?.endDate ?? null });
          }
        }
      };
      collect(e?.promotions?.promotionalOffers, 'current');
      collect(e?.promotions?.upcomingPromotionalOffers, 'upcoming');
    }

    return Response.json(
      { games },
      { headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=3600' } },
    );
  } catch {
    return Response.json({ games: [] });
  }
}

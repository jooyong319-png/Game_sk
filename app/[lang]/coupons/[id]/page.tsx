import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCouponGame, getCouponPageKeys, getCouponsLastUpdated, getActiveCouponGames, couponKeywords,
} from '@/lib/coupons';
import { CouponList } from '@/components/CouponList';
import { ViewCounter } from '@/components/ViewCounter';
import { PageShell } from '@/components/PageShell';
import { LOCALES, CAL, UI, termLabel, couponGameName, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/coupons/coupons.module.css';

interface Props {
  params: { lang: string; id: string };
}

function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export async function generateStaticParams() {
  const keys = await getCouponPageKeys();
  const params: { lang: Locale; id: string }[] = [];
  for (const lang of LOCALES) {
    for (const id of keys) params.push({ lang, id });
  }
  return params;
}

function yearMonth(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long' }).format(new Date(iso));
}
function fullDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const t = CAL[lang];
  const g = await getCouponGame(params.id);
  if (!g || (g.active.length === 0 && g.expired.length === 0)) return { title: UI[lang].notFound };

  const { term: rawTerm, active } = g;
  const name = couponGameName(g, lang);
  const term = termLabel(rawTerm, lang);
  const lastUpdated = await getCouponsLastUpdated();
  const ym = yearMonth(lastUpdated, lang);
  const url = `https://gcalen.com/${lang}/coupons/${g.key}`;
  const title = `${name} ${term}${ym ? ` (${ym})` : ''}`;
  const desc = (active.length > 0
    ? `${active.length} active ${name} ${term}${ym ? `, updated ${ym}` : ''}. Copy a code and redeem it in-game or on the official page for free rewards. Updated daily.`
    : `${name} ${term} — no active codes right now, but see recently expired codes and how to redeem below.`
  ).slice(0, 158);

  return {
    title: { absolute: `${title} | Gcalen` },
    description: desc,
    keywords: [...couponKeywords(name), `${name} ${term}`, `${name} codes`],
    alternates: {
      canonical: url,
      languages: {
        ko: `https://gcalen.com/coupons/${g.key}`,
        en: `https://gcalen.com/en/coupons/${g.key}`,
        ja: `https://gcalen.com/ja/coupons/${g.key}`,
      },
    },
    openGraph: {
      title, description: desc, url, type: 'article',
      images: [{ url: g.image_url || '/og-image.png', alt: `${name} ${term}` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [g.image_url || '/og-image.png'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function LocaleCouponPage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const t = CAL[lang];
  const g = await getCouponGame(params.id);
  if (!g || (g.active.length === 0 && g.expired.length === 0)) notFound();

  const { key, term: rawTerm, active, expired, image_url, game_id, redeem_url } = g;
  const name = couponGameName(g, lang);
  const term = termLabel(rawTerm, lang);
  const url = `https://gcalen.com/${lang}/coupons/${key}`;

  const lastUpdated = await getCouponsLastUpdated();
  const lastUpdatedStr = lastUpdated ? fullDate(lastUpdated, lang) : null;
  const ym = yearMonth(lastUpdated, lang);

  const related = (await getActiveCouponGames()).filter(x => x.key !== key).slice(0, 8);

  const steps = [
    { name: lang === 'en' ? 'Copy the code' : 'コードをコピー', text: lang === 'en' ? `Tap the copy button next to a code above.` : `上のコードのコピーボタンをタップします。` },
    { name: lang === 'en' ? `Open the ${term} entry screen` : `${term}入力画面を開く`, text: redeem_url
      ? (lang === 'en' ? `Open ${name}'s official redemption page, or go to in-game Settings › ${term}.` : `${name}公式登録ページを開くか、ゲーム内の設定 › ${term}へ移動します。`)
      : (lang === 'en' ? `Launch ${name} and go to Settings › ${term}.` : `${name}を起動し、設定 › ${term}へ移動します。`) },
    { name: lang === 'en' ? 'Redeem for rewards' : '登録して報酬を受け取る', text: lang === 'en' ? 'Paste the code and confirm — rewards arrive in your in-game mailbox. Enter it exactly, including case and hyphens.' : 'コードを貼り付けて登録すると、報酬がゲーム内メールボックスに届きます。大文字・小文字やハイフンも正確に入力してください。' },
  ];

  const faqs = lang === 'en' ? [
    { q: `Where do I enter ${name} ${term}?`, a: redeem_url ? `Use ${name}'s official ${term} redemption page, or the in-game Settings menu. On the web page, log in, pick your character/server, then enter the code.` : `Enter it via in-game Settings or near your mailbox. Some games also offer a web redemption page.` },
    { q: `What ${name} ${term} work today?`, a: `The "active" list at the top of this page is valid as of ${lastUpdatedStr ?? 'the latest update'}. Expired or exhausted codes are marked below, and new codes are added daily.` },
    { q: `My ${name} ${term} isn't working.`, a: `Double-check case and hyphens. Already-used, expired, or region/server-restricted codes won't redeem — check each code's reward note.` },
    { q: `How often do new ${name} ${term} come out?`, a: `Usually during official broadcasts, major updates, or anniversary events. They're often first-come or time-limited, so redeem as soon as they appear.` },
  ] : [
    { q: `${name}の${term}はどこで入力しますか?`, a: redeem_url ? `${name}公式${term}登録ページ、またはゲーム内設定メニューから登録できます。Web登録の場合、ログイン後にキャラクター・サーバーを選んでコードを入力してください。` : `ゲーム内設定またはメールボックス付近の${term}入力メニューから登録します。公式サイトに登録ページがある場合もあります。` },
    { q: `今使える${name}の${term}は?`, a: `このページ上部の「使用可能」リストが${lastUpdatedStr ?? '最新の更新時点'}で有効なコードです。期限切れ・終了したコードは下部に表示され、新しいコードは毎日追加されます。` },
    { q: `${name}の${term}が登録できません。`, a: `大文字・小文字とハイフンを正確に入力しているか確認してください。使用済み・期限切れ・サーバー/アカウント条件が合わないコードは登録できません。` },
    { q: `${name}の${term}はどのくらいの頻度で出ますか?`, a: `通常、公式配信・大型アップデート・記念イベントの際に配布されます。先着順・期間限定のことが多いため、公開されたらすぐ登録するのがおすすめです。` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url, url,
        name: `${name} ${term}`,
        ...(image_url ? { primaryImageOfPage: image_url } : {}),
        ...(lastUpdated ? { dateModified: lastUpdated } : {}),
        inLanguage: lang,
      },
      {
        '@type': 'HowTo', name: t.howToUse(name, term),
        step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, ...(i === 1 && redeem_url ? { url: redeem_url } : {}) })),
      },
      { '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <PageShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <header className={styles.detailHead}>
          {image_url && <img className={styles.detailThumb} src={image_url} alt={`${name} ${term}`} loading="eager" />}
          <div className={styles.detailHeadBody}>
            <h1 className={styles.title}>{name} {term}</h1>
            <p className={styles.subtitle}>
              {active.length > 0
                ? `${ym ? `As of ${ym}, ` : ''}${active.length} active ${name} ${term}. Copy a code and enter it in-game or on the official page for free rewards.`
                : `No active ${name} ${term} right now. See recently expired codes below — new codes will appear here first.`}
            </p>
            <ViewCounter gameId={`coupon:${key}`} />
          </div>
        </header>

        {redeem_url && (
          <a className={styles.redeemBtn} href={redeem_url} target="_blank" rel="noopener nofollow">
            <svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg>
            {t.officialRedeemPage(name, term)}
          </a>
        )}

        {active.length > 0 && <CouponList coupons={active} />}

        {expired.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>{t.pastCoupons(term)}</h2>
            <CouponList coupons={expired} expired />
          </>
        )}

        <div className={styles.intro}>
          <p>{t.couponIntro(name, term)}</p>
        </div>

        <div className={styles.usage}>
          <h2 className={styles.sectionTitle}>{t.howToUse(name, term)}</h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> — {i === 1 && redeem_url
                  ? <>{lang === 'en' ? 'Open the ' : ''}<a href={redeem_url} target="_blank" rel="noopener nofollow">{lang === 'en' ? `official ${term} redemption page` : `公式${term}登録ページ`}</a>{lang === 'en' ? `, or go to in-game Settings › ${term}.` : `を開くか、ゲーム内設定 › ${term}へ移動します。`}</>
                  : s.text}
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.faq}>
          <h2 className={styles.sectionTitle}>{t.faqTitle(name, term)}</h2>
          <dl className={styles.faqList}>
            {faqs.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {related.length > 0 && (
          <div className={styles.relatedGames}>
            <h2 className={styles.sectionTitle}>{t.otherGameCoupons(term)}</h2>
            <div className={styles.chips}>
              {related.map(r => (
                <a key={r.key} href={`/${lang}/coupons/${r.key}`} className={styles.chip}>
                  {couponGameName(r, lang)} {termLabel(r.term, lang)}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={styles.related}>
          <a href={`/${lang}/games/${key}`} className={styles.relatedLink}>{t.gameHub(name)}</a>
          {game_id && <a href={`/${lang}/game/${game_id}`} className={styles.relatedLink}>{t.releaseInfo(name)}</a>}
          <a href={`/${lang}/coupons`} className={styles.relatedLink}>{t.allCoupons}</a>
        </div>

        {lastUpdatedStr && (
          <p className={styles.note}>{t.lastUpdatedCouponNote(lastUpdatedStr)}</p>
        )}
      </section>
    </PageShell>
  );
}

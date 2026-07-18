'use client';
import { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { CAL, type Locale } from '@/lib/i18nLabels';
import styles from './CouponList.module.css';

export interface Coupon {
  code: string;
  reward: string;
  expires?: string | null;
}

function fmtExpires(iso: string | null | undefined, lang: Locale | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  if (lang) return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { month: 'long', day: 'numeric' }).format(d);
  return `${d.getMonth() + 1}월 ${d.getDate()}일까지`;
}

export function CouponList({ coupons, expired = false }: { coupons: Coupon[]; expired?: boolean }) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(c => (c === code ? null : c)), 1600);
    } catch {
      /* 클립보드 미지원 시 무시 (코드는 화면에 노출돼 있음) */
    }
  }

  if (coupons.length === 0) return null;

  return (
    <ul className={styles.list}>
      {coupons.map((c, i) => {
        const exp = fmtExpires(c.expires, lang);
        return (
          <li key={`${c.code}-${i}`} className={`${styles.item} ${expired ? styles.itemExpired : ''}`}>
            <div className={styles.top}>
              <code className={styles.code}>{c.code}</code>
              {expired ? (
                <span className={styles.expiredTag}>{t ? t.expiredTag : '만료됨'}</span>
              ) : (
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => copy(c.code)}
                  aria-label={t ? t.copyAria(c.code) : `${c.code} 복사`}
                >
                  {copied === c.code ? (t ? t.copiedCheck : '복사됨 ✓') : (t ? t.copy : '복사')}
                </button>
              )}
            </div>
            <p className={styles.reward}>{c.reward}</p>
            {exp && <span className={styles.expires}>{expired ? (t ? t.expiredUntil(exp) : `${exp} · 만료`) : exp}</span>}
          </li>
        );
      })}
    </ul>
  );
}

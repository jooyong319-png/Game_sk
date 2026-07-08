'use client';
import { useState } from 'react';

// 블로그 대표 이미지 — 게임 image_url이 죽은 경우(404 등) 깨진 아이콘 대신 컨테이너째 숨김.
// 서버 컴포넌트인 블로그 페이지에서 onError 폴백을 쓰려고 분리한 클라 래퍼.
interface Props {
  src: string;
  containerClassName: string;
  alt?: string;
  eager?: boolean;
}

export function BlogImg({ src, containerClassName, alt = '', eager }: Props) {
  const [err, setErr] = useState(false);
  if (err) return null;
  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setErr(true)}
      />
    </div>
  );
}

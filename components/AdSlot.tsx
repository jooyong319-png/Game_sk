import type { ReactNode } from 'react';

interface AdSlotProps {
  /** AdSense 슬롯 식별자 (승인 후 실제 광고 코드 교체용) */
  slot: string;
  /** 'top'(90px) | 'mid'(250px) */
  size?: 'top' | 'mid';
  label?: ReactNode;
}

export function AdSlot({ slot, size = 'top', label }: AdSlotProps) {
  return (
    <div className={`ad-slot ${size === 'mid' ? 'ad-slot-mid' : ''}`} data-ad-slot-name={slot}>
      <span className="ad-slot-label">{label ?? `광고 자리 (${size === 'top' ? '상단' : '하단'})`}</span>
    </div>
  );
}

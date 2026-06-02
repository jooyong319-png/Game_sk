import type { Game } from '@/lib/types';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';

export function GoogleCalendarButton({ game }: { game: Game }) {
  const url = buildGoogleCalendarUrl(game);
  if (!url) return null;
  return (
    <a className="gcal-link" href={url} target="_blank" rel="noopener">
      <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> 캘린더 추가
    </a>
  );
}

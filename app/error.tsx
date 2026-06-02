'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>오류가 발생했어요</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>잠시 후 다시 시도해주세요.</p>
      <button onClick={reset} style={{ background: '#4a90e2', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' }}>
        다시 시도
      </button>
    </div>
  );
}

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>페이지를 찾을 수 없어요</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>요청하신 게임이나 페이지가 없거나 삭제되었습니다.</p>
      <a href="/" style={{ color: '#4a90e2' }}>← 메인으로 돌아가기</a>
    </div>
  );
}

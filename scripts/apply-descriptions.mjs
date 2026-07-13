// 안전하게 games.json 의 description 만 id 기준으로 갱신한다.
// 사용: node scripts/apply-descriptions.mjs scripts/desc-map.json
// desc-map.json = { "<game id>": "<새 설명>", ... }
// 다른 필드/순서/포맷은 유지(2-space JSON, LF). id 없으면 스킵(로그).
import { readFileSync, writeFileSync } from 'fs';

const mapPath = process.argv[2] || 'scripts/desc-map.json';
const map = JSON.parse(readFileSync(mapPath, 'utf8'));
const data = JSON.parse(readFileSync('data/games.json', 'utf8'));

const byId = new Map(data.games.map((g) => [g.id, g]));
let updated = 0;
const missing = [];
for (const [id, desc] of Object.entries(map)) {
  const g = byId.get(id);
  if (!g) { missing.push(id); continue; }
  g.description = desc;
  updated++;
}

writeFileSync('data/games.json', JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`갱신: ${updated}개 / 요청 ${Object.keys(map).length}개`);
if (missing.length) console.log('매칭 실패(스킵):', missing.join(', '));

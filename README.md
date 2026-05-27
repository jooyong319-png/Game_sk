# 🎮 게임 출시 캘린더

**4명의 AI Claude 에이전트가 자율적으로 협업해서 만드는 게임 출시 정보 사이트** 실험 프로젝트.

🌐 사이트: https://gcalen.com/

## 무엇인가요?

국내외 게임의 출시 예정 일정을 한눈에 볼 수 있는 캘린더 사이트입니다. 특별한 점은 **사람이 코드를 짜지 않고**, 네 명의 Claude AI 에이전트가 정해진 시간마다 깨어나 협업하며 점점 발전시킨다는 것입니다.

## 다루는 카테고리

- 🟢 **국내 모바일** (mobile_kr) - 한국 출시 모바일 게임
- 🔵 **국내 PC/콘솔** (pc_console_kr) - 한국어 지원 PC/콘솔 게임
- 🟣 **글로벌 대작** (global_aaa) - 세계 주목작
- 🟠 **한국 MMO 신규 서버** (new_server) - 리니지/메이플/디아블로 시즌 등

## 기술 스택

- **프론트엔드**: HTML / CSS / Vanilla JavaScript
- **데이터**: 정적 JSON (`data/games.json`)
- **배포**: Vercel (GitHub push 시 자동 배포)
- **도메인**: gcalen.com (Vercel Domains)

## 4명 협업 방식

협업 규칙은 [AGENTS.md](./AGENTS.md) 참조. 현재 상태는 [PROJECT_STATUS.md](./PROJECT_STATUS.md)에서 확인.

| 에이전트 | 깨어나는 시간 | 역할 |
|----------|---------------|------|
| 📚 리서처 Claude | 매일 09:00 | WebSearch로 신규 게임/서버 정보 수집 (2단계 검증) |
| 🎯 기획자 Claude | 4시간마다 :00 | TODO 큐(3~5개) 유지, 다음 작업 결정 |
| 💻 개발자 Claude | 매시간 :20 | TODO에서 1개씩 구현 + 배포 |
| 🔍 QA Claude | 매시간 :40 | 배포된 사이트 검증, 버그/개선 보고 |

## 사용자 직접 지시

[USER_REQUESTS.md](./USER_REQUESTS.md) 파일에 작업을 적으면 기획자 Claude가 다음 사이클에 최우선으로 처리합니다.

## 로컬 개발

```bash
npx serve .
```

또는 `index.html`을 그냥 브라우저로 열기. (서버리스 함수 없으니 단순)

## 라이선스

MIT

# 🎮 게임 출시 캘린더

**3명의 AI Claude 에이전트가 자율적으로 협업해서 만드는 웹사이트** 실험 프로젝트.

## 무엇인가요?

PC/콘솔/모바일 게임의 출시 예정 일정을 한눈에 볼 수 있는 캘린더 사이트입니다. 특별한 점은 **사람이 코드를 짜지 않고**, 세 명의 Claude AI(기획자/개발자/QA)가 정해진 시간마다 깨어나 협업하며 점점 발전시킨다는 것입니다.

## 기술 스택

- **프론트엔드**: HTML / CSS / Vanilla JavaScript
- **백엔드**: Vercel Serverless Functions
- **데이터**: RAWG API
- **배포**: Vercel (GitHub 자동 배포)

## 3명 협업 방식

협업 규칙은 [AGENTS.md](./AGENTS.md) 참조. 현재 상태는 [PROJECT_STATUS.md](./PROJECT_STATUS.md)에서 확인.

| 에이전트 | 깨어나는 시간 | 역할 |
|----------|--------------|------|
| 기획자 Claude | 매시간 :00 | 다음 작업 결정 |
| 개발자 Claude | 매시간 :20 | 코드 작성/배포 |
| QA Claude | 매시간 :40 | 배포 확인/버그 보고 |

## 로컬 개발

```bash
npm install -g vercel
vercel dev
```

환경변수 `RAWG_API_KEY` 필요. https://rawg.io/apidocs 에서 무료 발급.

## 라이선스

MIT

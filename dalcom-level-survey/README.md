# 우리 아이는 유아 1단계? 유아 2단계?

달콤교육 유아 사고력 단계 추천 설문 웹페이지 (모바일 우선).

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- 시작 화면 → 11개 문항(한 화면에 한 문항) → 결과 화면
- 문항·배점·판정 기준·결과 문구는 전부 `src/config/` 에 분리
- 결과 계산은 부수효과 없는 순수 함수 (`src/lib/calculateResult.ts`)

---

## 배포

링크로 공유하고 응답을 모으는 방법은 **[DEPLOY.md](./DEPLOY.md)** 를 보세요.
구글 스프레드시트 연결 → GitHub → Vercel 순서로 안내되어 있습니다.

`SHEET_WEBHOOK_URL` 환경변수를 설정하지 않으면 수집만 꺼지고 설문은 그대로 동작합니다.

## 실행 방법

```bash
# 1. 의존성 설치 (Node.js 18.17 이상 필요)
npm install

# 2. 개발 서버 실행 → http://localhost:3000
npm run dev

# 3. 결과 계산 로직 테스트 (9개 케이스)
npm run verify

# 4. 실제 화면을 브라우저 엔진에 올려 처음부터 끝까지 풀어보는 검사
npm run build
npx next start -p 3300 &
npm run e2e 3300

# 4. 타입 검사 / 프로덕션 빌드
npm run typecheck
npm run build && npm start
```

휴대폰에서 확인하려면 `npm run dev -- -H 0.0.0.0` 으로 실행한 뒤,
같은 Wi-Fi에서 `http://<PC의 내부 IP>:3000` 으로 접속하세요.

---

## 파일 구조

```
dalcom-level-survey/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── README.md
├── DEPLOY.md                      # ★ 링크로 배포하고 응답 모으는 방법
├── .env.example                   # 환경변수 예시
├── google-apps-script/
│   └── Code.gs                    # 구글 스프레드시트 수집 스크립트
├── public/
│   └── images/                    # 문항에 붙는 교재 이미지 4장
├── scripts/
│   └── verify.ts                  # 결과 계산 로직 검증 스크립트
└── src/
    ├── app/
    │   ├── api/track/route.ts     # 응답을 구글 시트로 중계
    │   ├── layout.tsx             # 루트 레이아웃 · 메타데이터 · viewport
    │   ├── page.tsx               # 진입 페이지 (모바일 폭 컨테이너)
    │   └── globals.css            # Tailwind + 포커스 링 · 모션 축소 대응
    ├── types/
    │   └── survey.ts              # 모든 타입 정의
    ├── config/
    │   ├── survey.config.ts       # ★ 시작 화면 문구 · 11개 문항 · 배점
    │   └── result.config.ts       # ★ 판정 기준 · 결과 문구 · CTA 링크
    ├── lib/
    │   ├── calculateResult.ts     # ★ 결과 계산 순수 함수
    │   └── analytics.ts           # 응답 수집 전송 (익명)
    └── components/
        ├── SurveyApp.tsx          # 상태 관리 (start / question / result)
        ├── StartScreen.tsx        # 1. 시작 화면 (교재 표지 2장)
        ├── LevelChoiceScreen.tsx  # 예외 케이스에서 단계 직접 고르기
        ├── ProgressBar.tsx        # 4. 진행률 표시
        ├── QuestionScreen.tsx     # 2·3. 한 화면에 한 문항
        ├── OptionGroup.tsx        # 접근성 라디오그룹 (키보드 · aria)
        ├── QuestionImages.tsx     # 문항 이미지 (1장 / 1·2단계 비교)
        └── ResultScreen.tsx       # 7·9·10. 결과 · 표지 · 재검사 · CTA
```

★ 표시된 3개 파일만 수정하면 문항·점수·문구·링크를 모두 바꿀 수 있습니다.
컴포넌트에는 문항 텍스트가 하드코딩되어 있지 않습니다.

---

## 배점 규칙

모든 문항에서 **A는 0점**, B는 아래 점수를 얻습니다. (만점 15점)

| 문항 | 영역 | B 선택 시 |
| --- | --- | --- |
| 2 ~ 4 | 사고력 수준 | 각 1점 |
| 5 ~ 10 | 수와 연산 | 각 **2점** |

1번(연령) 문항은 점수가 없고, 판정 기준을 고르는 데만 사용됩니다.
총점은 내부 판정에만 쓰이고 **결과 화면에는 표시하지 않습니다.**

---

## 문항 구성

총 10문항입니다. 1번(연령)만 점수가 없습니다.

**사고력 수준 (각 1점)**

| 번호 | 문항 | 이미지 |
| --- | --- | --- |
| 1 | 아이가 몇 살인가요? | 없음 |
| 2 | 사고력 문제집·수업 경험 | 쥐를 잡자! 게임 (유아 1단계) |
| 3 | 문제를 풀거나 새 활동을 시작할 때 | 올바른 순서를 찾아라 (유아 2단계) |
| 4 | 규칙이 있는 게임을 할 때 | 목표 수 만들기 게임 (유아 2단계) |

**수와 연산 (각 2점) — 단계를 가르는 핵심**

| 번호 | 문항 | 이미지 |
| --- | --- | --- |
| 5 | 20에서부터 거꾸로 세어 내려갈 수 있다 | 수의 순서 길 연결하기 (유아2 p8) |
| 6 | 한 자리 수의 연산 | 수직선에서 작은 수 연산하기 (유아2 p21) |
| 7 | 두 개씩 묶어 세기 | 2씩 묶어 세기 (유아2 p83) |
| 8 | 더해서 10이 되는 두 수 | 10 만들기 (유아1 p183) |
| 9 | 수의 크기를 비교할 수 있다 | 수의 크기 비교하기 (유아2 p124) |
| 10 | 수를 '양'으로 이해할 수 있다 | 수배열표 (유아1 p161) |

수·연산 6문항은 서술문 + `아직 어려워해요 / 할 수 있어요` 형식입니다.

이미지는 `public/images/` 에 있고 모두 **760 × 708** 로 크기가 같습니다.
(6번 유아2 p21 이미지 높이를 기준으로 맞췄습니다)
확대 보기 기능은 넣지 않았습니다. 모바일에서 화면을 벌려 확대하면 충분히 보입니다.

`survey.config.ts` 의 각 문항에 `images: [...]` 로 지정합니다.
2장을 넣으면 왼쪽 = 유아 1단계, 오른쪽 = 유아 2단계 로 나란히 배치됩니다.

---

## 판정 로직

`calculateResult(answers)` 는 **수·연산 6문항(5~10번) 중 '가능'을 고른 개수**로 판정하고
`{ level: 1 | 2, reason, totalScore }` 를 반환합니다.

| 순서 | 조건 | 결과 | reason |
| --- | --- | --- | --- |
| 1 | **4세** | 유아 1단계 | `AGE` |
| 2 | 수·연산 '가능'이 기준 이상 | 유아 2단계 | `LEVEL_2_READY` |
| 3 | 기준에 **1개** 모자람 | 유아 1단계 | `MORE_FOUNDATION_NEEDED` |
| 4 | **2개 이상** 모자람 | 유아 1단계 | `CORE_NOT_READY` |

연령별 기준 (`LEVEL_2_CRITERIA`)

| 연령 | 수·연산 6문항 중 '가능' |
| --- | --- |
| 4세 | — (항상 유아 1단계) |
| 5세 | **5개 이상** |
| 6~7세 | **4개 이상** |

사고력 3문항(2~4번)은 최소 조건으로 씁니다. 수·연산 기준을 채워도
사고력 B가 `minThinkingB`(현재 1개) 미만이면 유아 1단계입니다.

> **예외** — 수·연산 6문항을 **모두** 할 수 있는데 사고력이 기준 미만이면,
> 결과를 바로 보여주지 않고 **학부모가 직접 단계를 고르는 화면**을 띄웁니다.
> (`LevelChoiceScreen.tsx`, 문구는 `result.config.ts` 의 `LEVEL_CHOICE_CONTENT`)
> 고른 단계는 스프레드시트 '선택한 단계' 열에 기록됩니다.
> 판별 기준은 `THINKING_OVERRIDE_NUMERACY` 로 조절합니다. (7 이상이면 예외 없음)

> 개수 기준은 응답이 쌓이면 `result.config.ts` 의 `minNumeracyB` 숫자만 바꿔서 조정하면 됩니다.

`npm run verify` 는 대표 케이스 15개와 **전체 경우의 수 1,536가지**를 모두 검사합니다.

---

## 접근성

- 선택지는 WAI-ARIA **radiogroup 패턴**(수동 활성화)으로 구현
  - `Tab` 그룹 진입/이탈, `↑ ↓ ← →` 포커스 이동, `Home` / `End` 처음·끝
  - `Space` / `Enter` 선택, `1` `2` `3` 숫자키로 바로 선택
- 모든 선택 버튼에 문항 번호·질문·선택지를 담은 `aria-label` 자동 생성
  (config에서 `ariaLabel` 을 직접 지정하면 그 값이 우선 적용됩니다)
- 진행률에 `role="progressbar"` + `aria-valuenow` / `aria-valuetext`
- 문항 전환 시 제목으로 포커스 이동 + `aria-live="polite"` 로 진행 상황 안내
- 터치 타깃 최소 60px, `prefers-reduced-motion` 대응, `:focus-visible` 포커스 링

---

## 결과 화면 구성

추천 결과 → 결과 카드(연령 배지 · 단계 제목 · 한 줄 요약 · 오른쪽에 교재 표지 96px)
→ **'지금 시작하기' 버튼** → '유아 N단계에서는' 항목 3개 → 다시 검사하기(텍스트 링크)

상세페이지 버튼을 결과 카드 바로 아래에 두어 **스크롤 없이 보이게** 했습니다.
이전에는 페이지 78% 지점에 있어 대부분 보지 못했습니다.

간결하게 하려고 설명문, 판정 사유 안내 박스, 학부모 후기, 하단 안내문은 화면에서 뺐습니다.
후기 이미지는 `public/images/review-level1.jpg`, `review-level2.jpg` 로 남아 있어
`ResultScreen.tsx` 에 다시 넣으면 바로 표시됩니다.
판정 사유 문구(`REASON_NOTES`)는 `result.config.ts` 에 그대로 남아 있어,
`ResultScreen.tsx` 에 다시 넣으면 바로 표시됩니다.

## 상세페이지 링크

`src/config/result.config.ts` 의 `cta.href` 에 들어 있습니다.

- 유아 1단계 · https://mkt.shopping.naver.com/link/68395a398f1c490586c4c68a
- 유아 2단계 · https://mkt.shopping.naver.com/link/68395a389afe254322008372

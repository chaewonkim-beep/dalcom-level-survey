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

모든 문항에서 **A는 0점**, B는 아래 점수를 얻습니다. (만점 13점)

| 문항 | 내용 | B 선택 시 |
| --- | --- | --- |
| 2 | 달콤 프로젝트·특강 경험 | 1점 |
| 3 | 사고력 문제집·수업 경험 | 1점 |
| 4 | 문제와 활동 이해 | 1점 |
| 5 | 30 이상 세기와 묶어 세기 | **2점** |
| 6 | 10을 만드는 수 조합 | **2점** |
| 7 | 한 자리 수 덧셈·뺄셈 | **2점** |
| 8 | 위치를 나타내는 말 이해 | 1점 |
| 9 | 순서 기억과 예상 | 1점 |
| 10 | 게임 규칙과 차례 지키기 | 1점 |
| 11 | 스스로 생각하고 시도하기 | 1점 |

1번(연령) 문항은 점수가 없고, 판정 기준을 고르는 데만 사용됩니다.
총점은 내부 판정에만 쓰이고 **결과 화면에는 표시하지 않습니다.**

## 문항 이미지

2~11번 문항에 교재 이미지가 붙어 있습니다.
확대 보기 기능은 넣지 않았습니다. 모바일에서 화면을 벌려 확대하면 충분히 보입니다.

| 문항 | 이미지 | 설명 |
| --- | --- | --- |
| 2 | 달콤수학 로드맵 | 달콤수학 로드맵 |
| 3 | 쥐를 잡자! 게임 | 유아 1단계 |
| 4 | 올바른 순서를 찾아라 | 유아 2단계 |
| 5 | 그림 묶어 세기 | 유아 2단계 |
| 6 | 모으기 가르기 | 유아 2단계 |
| 7 | (몇십)+(몇) 덧셈 | 유아 2단계 |
| 8 | 앞·옆·위에서 본 모양 | 유아 2단계 |
| 9 | 패턴 놀이 | 유아 2단계 |
| 10 | 목표 수 만들기 게임 | 유아 2단계 |
| 11 | 수 구슬을 차곡차곡 | 유아 2단계 |

`survey.config.ts` 의 각 문항에 `images: [...]` 로 지정합니다.

- **1장**이면 그대로 한 장을 보여주고 아래에 `label` 을 씁니다.
- **2장**이면 왼쪽 = 유아 1단계, 오른쪽 = 유아 2단계 로 나란히 놓고
  아래에 `IMAGE_COMPARE_CAPTION`(= '유아 1단계, 2단계 비교')을 씁니다.
  (현재는 모든 문항이 1장만 쓰지만, 2장을 넣으면 바로 비교 배치로 바뀝니다)

이미지 파일은 `public/images/` 에 있습니다.
3번(로드맵 표)만 화면 전체 폭(`wide: true`)이고, 나머지 12장은 모두 **760 × 636** 으로
같게 잘라 두어 문항끼리 이미지 크기가 어긋나지 않습니다.

> 참고: `public/images/` 에 `q6-gather-split.jpg`, `q8-blocks.jpg`, `q9-pattern.jpg`,
> `q10-number-game.jpg` 가 남아 있으면 예전 버전 파일이라 지워도 됩니다.
> `src/components/QuestionImage.tsx` 도 마찬가지입니다.

---

## 판정 로직

`calculateResult(answers)` 는 아래 순서로 판정하고
`{ level: 1 | 2, reason, totalScore }` 를 반환합니다.

| 순서 | 조건 | 결과 | reason |
| --- | --- | --- | --- |
| 1 | **4세** | 유아 1단계 | `AGE` |
| 2 | 연령별 세 조건 중 **하나라도** 충족 | 유아 2단계 | `LEVEL_2_READY` |
| 3 | 셋 다 미달 | 유아 1단계 | `CORE_NOT_READY` |

유아 2단계 조건 (셋 중 하나만 충족하면 됩니다)

| | 5세 | 6~7세 |
| --- | --- | --- |
| ① 총점 | 11점 이상 | 9점 이상 |
| ② 5~7번 | 모두 B | 모두 B |
| ③ 4번 + 8~11번 중 B | 4개 이상 | 3개 이상 |

4세는 위 조건과 관계없이 항상 유아 1단계입니다.

> `reason` 의 `MORE_FOUNDATION_NEEDED` 는 타입에는 남아 있지만 실제로는 나오지 않습니다.
> 조건 ②(5~7번 모두 B)를 채우면 그 자체로 유아 2단계가 되기 때문입니다.
> 조건을 다시 AND 로 바꾸면 살아납니다.

`reason` 값에 따라 결과 화면에 서로 다른 추가 안내 문구가 표시됩니다
(`REASON_NOTES` in `src/config/result.config.ts`).

`npm run verify` 는 대표 케이스 11개와 **전체 경우의 수 3,072가지**를 모두 검사합니다.

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

추천 결과 → 단계 제목 → 한 줄 요약 → **교재 표지** → '유아 N단계에서는' 항목 3개
→ 단계별 상세페이지 버튼 → 다시 검사하기

간결하게 하려고 설명문, 판정 사유 안내 박스, 학부모 후기, 하단 안내문은 화면에서 뺐습니다.
후기 이미지는 `public/images/review-level1.jpg`, `review-level2.jpg` 로 남아 있어
`ResultScreen.tsx` 에 다시 넣으면 바로 표시됩니다.
판정 사유 문구(`REASON_NOTES`)는 `result.config.ts` 에 그대로 남아 있어,
`ResultScreen.tsx` 에 다시 넣으면 바로 표시됩니다.

## 상세페이지 링크

`src/config/result.config.ts` 의 `cta.href` 에 들어 있습니다.

- 유아 1단계 · https://mkt.shopping.naver.com/link/68395a398f1c490586c4c68a
- 유아 2단계 · https://mkt.shopping.naver.com/link/68395a389afe254322008372

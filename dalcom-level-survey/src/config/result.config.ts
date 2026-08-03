import type {
  AgeGroup,
  LevelCriteria,
  Level,
  ReasonNote,
  ResultContent,
  ResultReason,
} from '@/types/survey';

/* ==================================================================
 * 결과 판정 기준 · 결과 화면 문구 설정
 * ================================================================== */

/** 핵심 수·연산 문항 — 셋 다 B면 그 자체로 유아 2단계 조건 하나를 충족합니다 */
export const CORE_QUESTION_IDS = [5, 6, 7] as const;

/** 기초 준비도 문항 — B 개수를 세는 대상 (4번 + 8~11번) */
export const READINESS_QUESTION_IDS = [4, 8, 9, 10, 11] as const;

/**
 * 연령별 유아 2단계 추천 기준.
 * 아래 조건과 '5~7번 모두 B' 중 **하나라도** 충족하면 유아 2단계입니다.
 * null = 점수와 관계없이 유아 1단계 (4세)
 */
export const LEVEL_2_CRITERIA: Record<AgeGroup, LevelCriteria | null> = {
  AGE_4: null,
  AGE_5: { minTotalScore: 11, minReadinessB: 4 },
  AGE_6_7: { minTotalScore: 9, minReadinessB: 3 },
};

/** 연령 선택값 → 화면 표기 */
export const AGE_LABEL: Record<AgeGroup, string> = {
  AGE_4: '4세',
  AGE_5: '5세',
  AGE_6_7: '6~7세',
};

/** 단계별 결과 화면 문구 + CTA */
export const RESULT_CONTENT: Record<Level, ResultContent> = {
  1: {
    badge: '추천 단계',
    title: '유아 1단계',
    headline: '기초부터 차근차근,\n여러 사고력 영역을 골고루 경험해요.',
    cover: {
      src: '/images/cover-level1.jpg',
      alt: '달콤수학 유아사고력 1단계 프로젝트 교재 표지',
    },
    pointsTitle: '유아 1단계에서는',
    points: [
      '수와 연산의 기초를 충분히 다져요.',
      '도형·위치·규칙을 놀이처럼 경험해요.',
      '스스로 생각하고 해결하는 힘을 길러요',
    ],
    review: {
      src: '/images/review-level1.jpg',
      alt: '유아 1단계 학부모 후기. 수학을 습득하는 과정이 놀이로 구성되어 있어 아이가 참 좋아하고, 매번 계속하겠다고 투정부린다는 내용입니다.',
    },
    cta: {
      label: '유아 1단계 자세히 보기',
      href: 'https://mkt.shopping.naver.com/link/68395a398f1c490586c4c68a',
    },
  },
  2: {
    badge: '추천 단계',
    title: '유아 2단계',
    headline: '익숙한 수 개념을 바탕으로\n더 깊은 사고력 활동에 도전해요.',
    cover: {
      src: '/images/cover-level2.jpg',
      alt: '달콤수학 유아사고력 2단계 프로젝트 교재 표지',
    },
    pointsTitle: '유아 2단계에서는',
    points: [
      '받아올림·받아내림이 있는 덧셈·뺄셈을 익혀요.',
      '자릿값과 수의 규칙을 이해해요.',
      '입체도형과 수 패턴으로 사고력을 확장해요.',
    ],
    review: {
      src: '/images/review-level2.jpg',
      alt: '유아 2단계 학부모 후기. 아이가 먼저 숫자놀이를 하자고 하고, 46개월인 지금 수량일치, 직산, 가르기 모으기, 10까지 연산을 할 수 있게 되었다는 내용입니다.',
    },
    cta: {
      label: '유아 2단계 자세히 보기',
      href: 'https://mkt.shopping.naver.com/link/68395a389afe254322008372',
    },
  },
};

/**
 * 판정 사유별 추가 안내 문구.
 * 현재 결과 화면에서는 화면을 간결하게 하기 위해 표시하지 않습니다.
 * 다시 보이게 하려면 ResultScreen.tsx 에서 REASON_NOTES 블록의 주석을 해제하세요.
 */
export const REASON_NOTES: Record<ResultReason, ReasonNote> = {
  AGE: {
    title: '4세는 점수와 관계없이 유아 1단계를 추천해요',
    body: '수·연산이 빠르더라도 도형, 규칙, 게임 등 여러 사고력 영역을 기초부터 골고루 경험하는 것을 우선해요.',
  },
  CORE_NOT_READY: {
    title: '기초를 조금 더 다지면 좋아요',
    body: '세기, 10 가르기·모으기, 한 자리 수 덧셈·뺄셈(5~7번)을 비롯해 아직 도움이 필요한 부분이 있어요. 이 부분이 유아 2단계 활동의 바탕이 되기 때문에, 먼저 충분히 익히는 것이 좋아요.',
  },
  MORE_FOUNDATION_NEEDED: {
    title: '수·연산은 준비됐지만, 다른 영역을 조금 더 다져요',
    body: '수·연산은 잘 준비되어 있어요. 다만 문제 이해, 위치 개념, 순서, 게임 규칙, 활동 태도까지 전반적으로 준비되었을 때 유아 2단계 활동을 더 즐겁게 소화할 수 있어요.',
  },
  LEVEL_2_READY: {
    title: '유아 2단계를 시작하기에 좋은 시점이에요',
    body: '수·연산, 문제 이해, 활동 태도 가운데 유아 2단계를 시작할 만한 준비가 확인됐어요. 지금 바로 유아 2단계 활동을 시작해도 좋아요.',
  },
};

/** 결과 화면 공통 문구 */
export const RESULT_UI_TEXT = {
  eyebrow: '추천 결과',
  restartLabel: '다시 검사하기',
} as const;

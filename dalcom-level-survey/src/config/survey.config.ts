import type { AgeQuestion, ChoiceQuestion, Question } from '@/types/survey';

/* ==================================================================
 * 설문 문항 · 배점 설정
 * ------------------------------------------------------------------
 * 문항 텍스트나 배점을 바꾸려면 이 파일만 수정하면 됩니다.
 * 컴포넌트에는 어떤 문항 텍스트도 하드코딩되어 있지 않습니다.
 * ================================================================== */

/** 시작 화면 문구 */
export const INTRO_CONTENT = {
  eyebrow: '달콤 유아 사고력',
  title: '우리 아이는\n유아 1단계? 유아 2단계?',
  /** 안내 문구 */
  description:
    '아이의 연령, 경험, 현재 수준을 확인하고\n우리 아이에게 맞는 단계를 찾아보세요.',
  /** 보조 문구 */
  subText: '약 1분 · 총 10문항',
  /** 시작 버튼 */
  startLabel: '우리 아이 단계 확인하기',
  /** 시작 화면에 설명 없이 나란히 놓는 교재 표지 2장 */
  covers: [
    {
      src: '/images/cover-level1.jpg',
      alt: '달콤수학 유아사고력 1단계 프로젝트 교재 표지',
    },
    {
      src: '/images/cover-level2.jpg',
      alt: '달콤수학 유아사고력 2단계 프로젝트 교재 표지',
    },
  ],
} as const;

/** 1번 — 연령 문항(3지선다) */
export const AGE_QUESTION: AgeQuestion = {
  id: 1,
  type: 'age',
  title: '아이가 몇 살인가요?',
  options: [
    { value: 'AGE_4', label: '4세' },
    { value: 'AGE_5', label: '5세' },
    { value: 'AGE_6_7', label: '6~7세' },
  ],
};

/**
 * 2~11번 — A/B 선택 문항
 * A는 모든 문항에서 0점, B는 scoreB 만큼 점수를 얻습니다.
 * 핵심 수·연산 문항(5~7번)만 2점, 나머지는 1점 → 총점 13점 만점
 */
export const CHOICE_QUESTIONS: ChoiceQuestion[] = [
  /* ---------------------- 사고력 수준 (각 1점) ---------------------- */
  {
    id: 2,
    type: 'choice',
    title: '사고력 문제집이나 수업을 경험해 본 적이 있나요?',
    scoreB: 1,
    images: [
      {
        src: '/images/q2-mouse-game.jpg',
        alt:
          '유아 1단계 교재의 ’쥐를 잡자! 게임’ 게임판. 두 수와 물음표가 그려진 쥐 카드가 놓여 있습니다.',
        label: '유아 1단계',
      },
    ],
    options: [
      { value: 'A', label: '처음이거나 잠깐 경험했어요.' },
      { value: 'B', label: '꾸준히 경험했어요.' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    title: '사고력 문제를 풀거나 새로운 활동을 시작할 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q3-order.jpg',
        alt:
          '유아 2단계 교재의 ’올바른 순서를 찾아라’ 페이지. 1부터 7까지 적힌 종이컵의 자리를 서로 바꾸며 올바른 순서를 찾는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '문제를 읽어주고 방법을 설명해 주어야 해요.' },
      { value: 'B', label: '문제를 스스로 읽고 이해해 풀어요.' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    title: '규칙이 있는 게임을 할 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q4-number-game.jpg',
        alt:
          '유아 2단계 교재의 ’목표 수 만들기 게임’ 페이지. 수 카드를 펼쳐 놓고 더해서 목표 수가 되는 두 카드를 먼저 찾는 게임입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '규칙과 차례를 자주 알려주어야 해요.' },
      { value: 'B', label: '규칙을 기억하고 차례에 맞게 참여해요.' },
    ],
  },

  /* ---------------------- 수와 연산 (각 2점) ----------------------
   * 아래 6문항이 단계를 가르는 핵심입니다.
   * 이미지가 준비되면 각 문항에 images 를 넣어주세요.
   * ---------------------------------------------------------------- */
  {
    id: 5,
    type: 'choice',
    title: '수를 20에서부터 거꾸로 세어 내려가는 것이 어렵지 않다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q5-count-back.jpg',
        alt:
          '유아 2단계 교재의 ’수의 순서 길 연결하기’ 페이지. 9, 13, 16처럼 적힌 칸과 구슬·수 막대 그림을 수의 순서대로 길처럼 연결하는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '어렵지 않아요' },
    ],
  },
  {
    id: 6,
    type: 'choice',
    title: '한 자리 수의 연산을 천천히 할 수 있다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q6-numberline.jpg',
        alt:
          '유아 2단계 교재의 ’수직선에서 작은 수 연산하기’ 페이지. 수 카드와 기호 카드를 뽑아 수직선 위에서 덧셈과 뺄셈을 해 보는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '할 수 있어요' },
    ],
  },
  {
    id: 7,
    type: 'choice',
    title: '두 개씩 묶어 셀 수 있다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q7-count-by-two.jpg',
        alt:
          '유아 2단계 교재의 ’2씩 묶어 세기’ 페이지. 구체물 20개를 2개씩 묶어 세고 짝수인지 홀수인지 이야기해 보는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '할 수 있어요' },
    ],
  },
  {
    id: 8,
    type: 'choice',
    title: '더해서 10이 되는 두 수를 말할 수 있다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q8-make-ten.jpg',
        alt:
          '유아 1단계 교재의 ’10 만들기’ 페이지. 두 가지 색깔의 구체물로 10을 만드는 여러 방법을 찾아 식으로 표현해 보는 활동입니다.',
        label: '유아 1단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '말할 수 있어요' },
    ],
  },
  {
    id: 9,
    type: 'choice',
    title: '수의 크기를 비교하는 것이 어렵지 않다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q9-compare.jpg',
        alt:
          '유아 2단계 교재의 ’수의 크기 비교하기’ 페이지. 수 카드와 수 막대 카드를 놓고 더 큰 수와 작은 수를 기호 카드로 비교하는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '어렵지 않아요' },
    ],
  },
  {
    id: 10,
    type: 'choice',
    title: '수를 단순히 읽는 것을 넘어 ‘양’으로 이해하고 있다.',
    scoreB: 2,
    images: [
      {
        src: '/images/q10-number-chart.jpg',
        alt:
          '유아 1단계 교재의 수배열표. 6부터 50까지의 수가 낱개 블록과 10 묶음 막대 그림과 함께 나란히 놓여 있습니다.',
        label: '유아 1단계',
      },
    ],
    options: [
      { value: 'A', label: '아직 어려워해요' },
      { value: 'B', label: '이해하고 있어요' },
    ],
  },
];

/**
 * 특정 문항에서 한 번만 보여주는 안내.
 * questionNumber 를 바꾸면 다른 문항으로 옮길 수 있고,
 * text 를 빈 문자열로 두면 표시되지 않습니다.
 */
export const QUESTION_NOTICE = {
  /** 몇 번째 문항에 띄울지 (1부터) */
  questionNumber: 2,
  text: '다음 문항부터는\n우리 아이 모습에 더 가까운 쪽을 골라주세요.',
} as const;

/** 이미지 두 장(1단계·2단계)을 나란히 보여줄 때 아래에 붙는 설명 */
export const IMAGE_COMPARE_CAPTION = '유아 1단계, 2단계 비교';

/** 화면에 노출되는 전체 문항 순서 (1 → 11) */
export const QUESTIONS: Question[] = [AGE_QUESTION, ...CHOICE_QUESTIONS];

/** 총 문항 수 (11) */
export const TOTAL_QUESTIONS = QUESTIONS.length;

/** 만점 (13점) */
export const MAX_TOTAL_SCORE = CHOICE_QUESTIONS.reduce(
  (sum, q) => sum + q.scoreB,
  0,
);

/** 문항 id로 A/B 문항을 빠르게 찾기 위한 맵 */
export const CHOICE_QUESTION_MAP: Record<number, ChoiceQuestion> =
  Object.fromEntries(CHOICE_QUESTIONS.map((q) => [q.id, q]));

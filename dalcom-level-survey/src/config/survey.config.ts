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
  subText: '약 1분 · 총 11문항',
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
  {
    id: 2,
    type: 'choice',
    title: '달콤 프로젝트나 특강을 경험해 본 적이 있나요?',
    scoreB: 1,
    images: [
      {
        src: '/images/q3.jpg',
        alt:
          '달콤수학 로드맵 표. 4세부터 11세까지 나이별로 유아사고력 1·2단계, 초등사고력 1~3단계 프로젝트와 스터디, 스페셜, 특강 과정이 언제 진행되는지 한눈에 정리되어 있습니다.',
        label: '달콤수학 로드맵',
        wide: true,
      },
    ],
    options: [
      { value: 'A', label: '처음 참여해요.' },
      { value: 'B', label: '참여한 적이 있어요.' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    title: '사고력 문제집이나 수업을 경험해 본 적이 있나요?',
    scoreB: 1,
    images: [
      {
        src: '/images/q2.jpg',
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
    id: 4,
    type: 'choice',
    title: '사고력 문제를 풀거나 새로운 활동을 시작할 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q4.jpg',
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
    id: 5,
    type: 'choice',
    title: '많은 물건의 개수를 셀 때',
    scoreB: 2,
    images: [
      {
        src: '/images/q5.jpg',
        alt:
          '유아 2단계 교재의 ’그림 묶어 세기’ 페이지. 흩어진 케이크 그림을 묶어 세는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '하나씩 세고, 개수가 많아지면 헷갈려요.' },
      { value: 'B', label: '30개 이상 정확히 세고, 10개씩 묶어 셀 수 있어요.' },
    ],
  },
  {
    id: 6,
    type: 'choice',
    title: '10을 두 수로 가르고 모을 때',
    scoreB: 2,
    images: [
      {
        src: '/images/q6-level2.jpg',
        alt:
          '유아 2단계 교재의 모으기 가르기 활동. 직산 카드를 모으기 가르기 판에 올려 1에서 10까지의 수를 다루는 예시입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '손가락이나 교구를 이용해 답을 찾아요.' },
      { value: 'B', label: '10을 만드는 수 조합을 알고 있어요.' },
    ],
  },
  {
    id: 7,
    type: 'choice',
    title: '받아올림이 없는 한 자리 수의 덧셈·뺄셈을 할 때',
    scoreB: 2,
    images: [
      {
        src: '/images/q7.jpg',
        alt:
          '유아 2단계 교재의 ’(몇십) + (몇), (몇십몇) + (몇)’ 덧셈 페이지. 수 카드 두 장을 뽑아 수 막대 카드로 나타내고 계산해 보는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '손가락이나 교구의 도움이 필요해요.' },
      { value: 'B', label: '대부분의 문제를 어렵지 않게 풀어요.' },
    ],
  },
  {
    id: 8,
    type: 'choice',
    title: '위치를 나타내는 말을 들었을 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q8-level2.jpg',
        alt:
          '유아 2단계 교재의 ’앞, 옆, 위에서 본 모양’ 페이지. 쌓기나무를 앞, 옆, 위 세 방향에서 본 모양을 그려 보는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '위치를 하나씩 알려주어야 해요.' },
      { value: 'B', label: '앞, 옆, 위와 같은 말을 이해해요.' },
    ],
  },
  {
    id: 9,
    type: 'choice',
    title: '반복되는 패턴을 보았을 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q9.jpg',
        alt:
          '유아 2단계 교재의 ’패턴 놀이’ 페이지. 과일 카드로 패턴을 만들고 이어서 놓는 활동과, 요소를 더해 이중 패턴을 만드는 활동입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '다음 패턴을 계속 알려주어야 해요.' },
      { value: 'B', label: '패턴을 기억하고 다음을 예상할 수 있어요.' },
    ],
  },
  {
    id: 10,
    type: 'choice',
    title: '규칙이 있는 게임을 할 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q10.jpg',
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
  {
    id: 11,
    type: 'choice',
    title: '바로 답이 나오지 않는 문제를 만났을 때',
    scoreB: 1,
    images: [
      {
        src: '/images/q11.jpg',
        alt:
          '유아 2단계 교재의 ’수 구슬을 차곡차곡’ 페이지. 아래 두 수를 더하면 바로 위의 수가 되는 규칙에 맞게 빈 구슬을 채우는 문제입니다.',
        label: '유아 2단계',
      },
    ],
    options: [
      { value: 'A', label: '어려워하며 바로 도움을 요청해요.' },
      { value: 'B', label: '스스로 한 번 더 생각하거나 시도해요.' },
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

/** 이미지에 커서를 올렸을 때 이미지 위에 뜨는 문구 */
export const IMAGE_ZOOM_HINT = '이미지를 클릭하면 커집니다';

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

/* ------------------------------------------------------------------
 * 설문 전반에서 사용하는 타입 정의
 * ------------------------------------------------------------------ */

/** 1번(연령) 문항의 선택값 */
export type AgeGroup = 'AGE_4' | 'AGE_5' | 'AGE_6' | 'AGE_7';

/** 2~11번(A/B) 문항의 선택값 */
export type Choice = 'A' | 'B';

/** 문항 하나에 대한 답변값 */
export type AnswerValue = AgeGroup | Choice;

/** 문항 id(1~11)를 key로 갖는 답변 맵 */
export type Answers = Partial<Record<number, AnswerValue>>;

/** 추천 단계 */
export type Level = 1 | 2;

/** 판정 사유 */
export type ResultReason =
  /** 4세 → 점수와 관계없이 유아 1단계 */
  | 'AGE'
  /** 수·연산 준비가 기준에 여유 있게 못 미쳐 유아 1단계 */
  | 'CORE_NOT_READY'
  /** 수·연산이 한 문항 차이로 아깝게 미달해 유아 1단계 */
  | 'MORE_FOUNDATION_NEEDED'
  /** 수·연산은 충분하지만 사고력 경험이 부족해 유아 1단계 */
  | 'THINKING_NOT_READY'
  /** 모든 조건 충족 → 유아 2단계 */
  | 'LEVEL_2_READY';

/** 결과 계산 함수의 반환값 */
export interface SurveyResult {
  level: Level;
  reason: ResultReason;
  totalScore: number;
}

/* ---------------------------- 문항 데이터 ---------------------------- */

export interface AgeOption {
  value: AgeGroup;
  /** 화면에 표시되는 선택지 텍스트 */
  label: string;
  /** 선택 버튼의 aria-label (생략 시 자동 생성) */
  ariaLabel?: string;
}

export interface ChoiceOption {
  value: Choice;
  label: string;
  ariaLabel?: string;
}

/** 문항 이해를 돕는 교재 이미지 (선택) */
export interface QuestionImage {
  /** public/images/ 아래 파일 경로 */
  src: string;
  /** 대체 텍스트 — 스크린리더가 읽어줍니다 */
  alt: string;
  /** 이미지 한 장만 쓸 때 아래에 표시되는 설명 (예: '유아 1단계') */
  label: string;
  /**
   * true 면 화면 전체 폭으로 크게 넣습니다. (가로로 넓은 표 등)
   * 기본값은 false — 다른 문항들과 같은 작은 크기로 들어갑니다.
   */
  wide?: boolean;
}

interface BaseQuestion {
  /** 1 ~ 11 */
  id: number;
  /** 질문 본문 */
  title: string;
  /**
   * 문항 이해를 돕는 이미지.
   * - 1장: 한 장만 표시하고 아래에 image.label 을 씁니다.
   * - 2장: 왼쪽 = 유아 1단계, 오른쪽 = 유아 2단계 로 나란히 놓고
   *        아래에 '유아 1단계, 2단계 비교' 를 씁니다.
   */
  images?: QuestionImage[];
}

export interface AgeQuestion extends BaseQuestion {
  type: 'age';
  options: AgeOption[];
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  /** B를 선택했을 때 얻는 점수 (A는 항상 0점) */
  scoreB: number;
  options: ChoiceOption[];
}

export type Question = AgeQuestion | ChoiceQuestion;

/* ---------------------------- 결과 콘텐츠 ---------------------------- */

export interface LevelCriteria {
  /** 유아 2단계 추천에 필요한 수·연산 문항(5~10번) '가능' 최소 개수 */
  minNumeracyB: number;
  /**
   * 유아 2단계 추천에 필요한 사고력 문항(2~4번) B 최소 개수.
   * 수·연산 기준을 채워도 이 개수를 못 채우면 유아 1단계입니다.
   */
  minThinkingB: number;
}

/** 설명 없이 이미지만 보여줄 때 쓰는 최소 정보 */
export interface PlainImage {
  src: string;
  alt: string;
}

export interface ResultContent {
  badge: string;
  title: string;
  headline: string;
  /** 교재 표지 */
  cover: PlainImage;
  /** 항목 목록 위에 붙는 소제목 (예: '유아 1단계에서는') */
  pointsTitle: string;
  points: string[];
  /** 학부모 후기 이미지 — 현재 결과 화면에서는 쓰지 않습니다 (넣으려면 ResultScreen 에서 사용) */
  review?: PlainImage;
  cta: {
    label: string;
    href: string;
  };
}

export interface ReasonNote {
  title: string;
  body: string;
}

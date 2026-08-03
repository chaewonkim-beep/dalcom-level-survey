import {
  CHOICE_QUESTIONS,
  CHOICE_QUESTION_MAP,
  QUESTIONS,
} from '@/config/survey.config';
import {
  CORE_QUESTION_IDS,
  LEVEL_2_CRITERIA,
  READINESS_QUESTION_IDS,
} from '@/config/result.config';
import type {
  AgeGroup,
  Answers,
  Choice,
  SurveyResult,
} from '@/types/survey';

/* ==================================================================
 * 결과 계산 (순수 함수)
 * ------------------------------------------------------------------
 * 같은 answers를 넣으면 언제나 같은 결과를 돌려주며,
 * 외부 상태를 읽거나 바꾸지 않습니다.
 * ================================================================== */

/** 총점 계산 — 모든 문항에서 A는 0점, B는 문항별 scoreB */
export function calculateTotalScore(answers: Answers): number {
  return CHOICE_QUESTIONS.reduce(
    (sum, q) => (answers[q.id] === 'B' ? sum + q.scoreB : sum),
    0,
  );
}

/** 주어진 문항 id 목록 중 B로 답한 개수 */
export function countB(
  answers: Answers,
  questionIds: readonly number[],
): number {
  return questionIds.filter((id) => answers[id] === 'B').length;
}

/** 모든 문항에 답했는지 확인 */
export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined);
}

/**
 * 설문 결과를 계산합니다.
 *
 * 판정 순서
 *  1. 4세 → 점수와 관계없이 유아 1단계 (AGE)
 *  2. 연령별 세 조건 중 **하나라도** 충족하면 유아 2단계 (LEVEL_2_READY)
 *       ① 총점이 기준 이상
 *       ② 5~7번이 모두 B
 *       ③ 4번과 8~11번 중 B가 기준 개수 이상
 *  3. 셋 다 못 채우면 유아 1단계
 *       - 5~7번에 A가 있으면            → CORE_NOT_READY
 *       - (5~7번은 모두 B인 경우)        → MORE_FOUNDATION_NEEDED
 *         ※ 5~7번이 모두 B면 조건 ②로 이미 2단계가 되므로 실제로는 나오지 않습니다.
 */
export function calculateResult(answers: Answers): SurveyResult {
  const totalScore = calculateTotalScore(answers);
  const age = answers[1] as AgeGroup | undefined;

  const criteria = age ? LEVEL_2_CRITERIA[age] : null;

  // 1) 4세는 점수와 관계없이 유아 1단계
  //    (연령 미응답도 안전하게 유아 1단계로 처리)
  if (!age || criteria === null) {
    return { level: 1, reason: 'AGE', totalScore };
  }

  const coreAllB = CORE_QUESTION_IDS.every((id) => answers[id] === 'B');
  const readinessB = countB(answers, READINESS_QUESTION_IDS);

  // 2) 세 조건 중 하나라도 충족하면 유아 2단계
  const meetsScore = totalScore >= criteria.minTotalScore;
  const meetsReadiness = readinessB >= criteria.minReadinessB;

  if (meetsScore || coreAllB || meetsReadiness) {
    return { level: 2, reason: 'LEVEL_2_READY', totalScore };
  }

  // 3) 하나도 충족하지 못하면 유아 1단계
  return {
    level: 1,
    reason: coreAllB ? 'MORE_FOUNDATION_NEEDED' : 'CORE_NOT_READY',
    totalScore,
  };
}

/** 결과 화면 보조 표시용 — 문항별 획득 점수 (디버깅/상담용) */
export function getScoreBreakdown(
  answers: Answers,
): Array<{ id: number; choice: Choice | undefined; score: number }> {
  return CHOICE_QUESTIONS.map((q) => {
    const choice = answers[q.id] as Choice | undefined;
    return {
      id: q.id,
      choice,
      score: choice === 'B' ? CHOICE_QUESTION_MAP[q.id].scoreB : 0,
    };
  });
}

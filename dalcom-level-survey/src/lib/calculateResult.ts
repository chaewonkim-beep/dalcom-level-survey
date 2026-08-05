import { CHOICE_QUESTIONS, QUESTIONS } from '@/config/survey.config';
import {
  LEVEL_2_CRITERIA,
  NUMERACY_QUESTION_IDS,
  THINKING_QUESTION_IDS,
} from '@/config/result.config';
import type { AgeGroup, Answers, SurveyResult } from '@/types/survey';

/* ==================================================================
 * 결과 계산 (순수 함수)
 * ------------------------------------------------------------------
 * 같은 answers를 넣으면 언제나 같은 결과를 돌려주며,
 * 외부 상태를 읽거나 바꾸지 않습니다.
 * ================================================================== */

/** 총점 — A는 0점, B는 문항별 scoreB (사고력 1점 · 수·연산 2점, 만점 15점) */
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

/** 수·연산 6문항(5~10번) 중 '가능'을 고른 개수 */
export function countNumeracyB(answers: Answers): number {
  return countB(answers, NUMERACY_QUESTION_IDS);
}

/** 사고력 3문항(2~4번) 중 B를 고른 개수 — 결과 문구 참고용 */
export function countThinkingB(answers: Answers): number {
  return countB(answers, THINKING_QUESTION_IDS);
}

/** 모든 문항에 답했는지 확인 */
export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => answers[q.id] !== undefined);
}

/**
 * 설문 결과를 계산합니다.
 *
 * 판정 순서
 *  1. 4세                          → 유아 1단계 (AGE)
 *  2. 수·연산이 기준에 2개 이상 모자람 → 유아 1단계 (CORE_NOT_READY)
 *  3. 수·연산이 1개 모자람           → 유아 1단계 (MORE_FOUNDATION_NEEDED)
 *  4. 수·연산은 충분하지만
 *     사고력이 기준 미만            → 유아 1단계 (THINKING_NOT_READY)
 *  5. 둘 다 충족                    → 유아 2단계 (LEVEL_2_READY)
 *
 * 연령별 기준은 result.config.ts 의 LEVEL_2_CRITERIA 에서 바꿉니다.
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

  const numeracyB = countNumeracyB(answers);
  const shortfall = criteria.minNumeracyB - numeracyB;

  // 2) 수·연산이 2개 이상 모자라면 기초부터
  if (shortfall >= 2) {
    return { level: 1, reason: 'CORE_NOT_READY', totalScore };
  }

  // 3) 한 문항 차이로 아깝게 미달
  if (shortfall === 1) {
    return { level: 1, reason: 'MORE_FOUNDATION_NEEDED', totalScore };
  }

  // 4) 수·연산은 충분하지만 사고력 경험이 부족
  if (countThinkingB(answers) < criteria.minThinkingB) {
    return { level: 1, reason: 'THINKING_NOT_READY', totalScore };
  }

  // 5) 둘 다 충족
  return { level: 2, reason: 'LEVEL_2_READY', totalScore };
}

/** 상담·디버깅용 — 문항별 획득 점수 */
export function getScoreBreakdown(
  answers: Answers,
): Array<{ id: number; choice: string | undefined; score: number }> {
  return CHOICE_QUESTIONS.map((q) => {
    const choice = answers[q.id];
    return {
      id: q.id,
      choice: typeof choice === 'string' ? choice : undefined,
      score: choice === 'B' ? q.scoreB : 0,
    };
  });
}
